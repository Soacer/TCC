import { PrismaClient } from "@prisma/client";
import { classificarTopologia } from "../../../utils/topologyAnalyzer";
import { SaveBlockDTO, SaveConnectionDTO } from '../../../shared/dto/DigitalTwin/digitalTwin.dto';

const prisma = new PrismaClient();

export class DigitalTwinRepository {
  // 1. Carrega o diagrama completo de um Setor (Blocos e Linhas)
  async findBySetor(setorId: string) {
    const blocks = await prisma.diagramaBloco.findMany({
      where: { setorId },
      include: {
        equipamento: true, // Traz os dados da máquina real atrelada ao bloco
      },
    });

    const connections = await prisma.diagramaConexao.findMany({
      where: { setorId },
    });

    return { blocks, connections };
  }

  // 2. Grava de forma atómica o novo estado do diagrama usando Transação
  async saveDiagram(
    setorId: string,
    blocks: SaveBlockDTO[],
    connections: SaveConnectionDTO[],
  ) {
    return await prisma.$transaction(async (tx) => {
      // Passo A e B: Limpeza
      await tx.diagramaConexao.deleteMany({ where: { setorId } });
      await tx.diagramaBloco.deleteMany({ where: { setorId } });

      // Passo C: Salvar Blocos
      if (blocks.length > 0) {
        await tx.diagramaBloco.createMany({
          data: blocks.map((b) => ({
            id_bloco: b.id_bloco,
            tipo_bloco: b.tipo_bloco,
            posicao_x: b.posicao_x,
            posicao_y: b.posicao_y,
            setorId: setorId,
            equipamentoId:
              b.equipamentoId && b.equipamentoId !== ""
                ? b.equipamentoId
                : null,
          })),
        });
      }

      // Passo D: Processar Lógica Topológica e Salvar Conexões
      if (connections.length > 0) {
        // 🟢 Delegação da Regra de Negócio
        const processedConnections = classificarTopologia(blocks, connections);

        await tx.diagramaConexao.createMany({
          data: processedConnections.map((c) => ({
            id_conexao: c.id_conexao,
            tipo_ligacao: c.tipo_ligacao,
            setorId: setorId,
            blocoOrigemId: c.blocoOrigemId,
            blocoDestinoId: c.blocoDestinoId,
          })),
        });
      }

      return { success: true };
    });
  }
}
