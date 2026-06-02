// prisma/seed.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🧹 Limpando o banco de dados...");
  await prisma.falha.deleteMany();
  await prisma.equipamento.deleteMany();
  await prisma.setor.deleteMany();
  await prisma.planta.deleteMany();
  await prisma.causaRaiz.deleteMany();
  await prisma.abc.deleteMany();
  await prisma.xyz.deleteMany();

  console.log("🌱 Populando tabelas de Criticidade (ABC / XYZ)...");
  await prisma.abc.createMany({
    data: [
      { idcriticidade: 1, nivel: "A" },
      { idcriticidade: 2, nivel: "B" },
      { idcriticidade: 3, nivel: "C" },
    ],
  });
  await prisma.xyz.createMany({
    data: [
      { idxyz: 1, nivel: "X" },
      { idxyz: 2, nivel: "Y" },
      { idxyz: 3, nivel: "Z" },
    ],
  });

  console.log("🌱 Criando Planta e Setores...");
  const planta = await prisma.planta.create({
    data: { nome: "Planta Principal" },
  });

  const setorCasaBombas = await prisma.setor.create({ data: { nome: "Casa de Bombas", plantaId: planta.idplanta } });
  const setorArmazenamento = await prisma.setor.create({ data: { nome: "Armazenamento", plantaId: planta.idplanta } });
  const setorUtilidades = await prisma.setor.create({ data: { nome: "Utilidades", plantaId: planta.idplanta } });
  const setorLinha = await prisma.setor.create({ data: { nome: "Linha de Montagem", plantaId: planta.idplanta } });

  console.log("🌱 Criando Causas Raízes...");
  const causas = {
    lubrificacao: await prisma.causaRaiz.create({ data: { nome: "Falta de Lubrificação" } }),
    desgaste: await prisma.causaRaiz.create({ data: { nome: "Desgaste Natural do Componente" } }),
    eletrica: await prisma.causaRaiz.create({ data: { nome: "Sobrecarga Elétrica" } }),
    operacional: await prisma.causaRaiz.create({ data: { nome: "Erro Operacional" } }),
    vibracao: await prisma.causaRaiz.create({ data: { nome: "Excesso de Vibração" } }),
    vazamento: await prisma.causaRaiz.create({ data: { nome: "Vazamento de Fluido" } }),
  };

  console.log("🌱 Criando Equipamentos...");
  const equipData = [
    { tag: "BOMBA-001", nome: "Bomba de Recalque Principal", tipo: "BOMBA", setor: setorCasaBombas },
    { tag: "BOMBA-002", nome: "Bomba de Recalque Standby", tipo: "BOMBA", setor: setorCasaBombas },
    { tag: "TQ-001", nome: "Tanque Pulmão de Água", tipo: "TANQUE", setor: setorArmazenamento },
    { tag: "TC-001", nome: "Permutador de Calor Casco-Tubo", tipo: "PERMUTADOR", setor: setorUtilidades },
    { tag: "MOTOR-001", nome: "Motor da Esteira Secundária", tipo: "MOTOR", setor: setorLinha },
    { tag: "COMP-001", nome: "Compressor de Ar Central", tipo: "COMPRESSOR", setor: setorUtilidades },
    { tag: "VALV-001", nome: "Válvula de Controle Proporcional", tipo: "VALVULA", setor: setorCasaBombas },
  ];

  const equipamentos = [];
  for (const eq of equipData) {
    const e = await prisma.equipamento.create({
      data: {
        tag: eq.tag,
        nome: eq.nome,
        tipo: eq.tipo as any,
        fabricante: "Genérico",
        modelo: "Modelo 01",
        data_instalacao: new Date(new Date().setFullYear(new Date().getFullYear() - 1)), // 1 ano de vida
        setor: { connect: { idsetor: eq.setor.idsetor } },
        abc: { connect: { idcriticidade: 1 } },
        xyz: { connect: { idxyz: 1 } },
      },
    });
    equipamentos.push(e);
  }

  console.log("🌱 Gerando Histórico de Falhas...");
  const diasAtras = (dias: number) => {
    const d = new Date();
    d.setDate(d.getDate() - dias);
    return d;
  };

  const falhasSeed = [
    { eq: equipamentos[0], causa: causas.lubrificacao, dias: 2, horasReparo: 2 },
    { eq: equipamentos[1], causa: causas.lubrificacao, dias: 5, horasReparo: 1 },
    { eq: equipamentos[4], causa: causas.lubrificacao, dias: 12, horasReparo: 4 },
    { eq: equipamentos[5], causa: causas.lubrificacao, dias: 15, horasReparo: 2 },
    { eq: equipamentos[0], causa: causas.lubrificacao, dias: 18, horasReparo: 3 },
    { eq: equipamentos[5], causa: causas.lubrificacao, dias: 25, horasReparo: 1 },
    { eq: equipamentos[1], causa: causas.lubrificacao, dias: 30, horasReparo: 2 },
    { eq: equipamentos[0], causa: causas.lubrificacao, dias: 35, horasReparo: 5 },
    { eq: equipamentos[4], causa: causas.lubrificacao, dias: 42, horasReparo: 3 },
    { eq: equipamentos[0], causa: causas.desgaste, dias: 10, horasReparo: 6 },
    { eq: equipamentos[4], causa: causas.desgaste, dias: 14, horasReparo: 5 },
    { eq: equipamentos[6], causa: causas.desgaste, dias: 22, horasReparo: 8 },
    { eq: equipamentos[5], causa: causas.desgaste, dias: 28, horasReparo: 4 },
    { eq: equipamentos[3], causa: causas.desgaste, dias: 40, horasReparo: 12 },
    { eq: equipamentos[6], causa: causas.desgaste, dias: 50, horasReparo: 2 },
    { eq: equipamentos[5], causa: causas.eletrica, dias: 3, horasReparo: 12 },
    { eq: equipamentos[4], causa: causas.eletrica, dias: 17, horasReparo: 8 },
    { eq: equipamentos[0], causa: causas.eletrica, dias: 26, horasReparo: 14 },
    { eq: equipamentos[1], causa: causas.eletrica, dias: 33, horasReparo: 6 },
    { eq: equipamentos[4], causa: causas.operacional, dias: 7, horasReparo: 2 },
    { eq: equipamentos[0], causa: causas.vibracao, dias: 60, horasReparo: 4 },
    { eq: equipamentos[2], causa: causas.vazamento, dias: 19, horasReparo: 5 },
  ];

  for (const item of falhasSeed) {
    const dataFalha = diasAtras(item.dias);
    
    // 🟢 CORREÇÃO: Calculando a data de reparo aqui
    const dataReparo = new Date(dataFalha.getTime() + (item.horasReparo * 60 * 60 * 1000));

    await prisma.falha.create({
      data: {
        descricao: `Falha técnica em ${item.eq.tag}`,
        data_hora_falha: dataFalha,
        data_hora_reparo: dataReparo, // 🟢 Agora a data é salva no banco!
        tempo_parada_horas: item.horasReparo,
        equipamento_id: item.eq.idequipamentos,
        causa_raiz_id: item.causa.idcausaraiz,
      },
    });
  }

  console.log("✅ Banco populado com sucesso!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });