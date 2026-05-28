// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';
import path from 'node:path';

// Carrega o .env explicitamente
dotenv.config({ path: path.join(process.cwd(), '.env') });

async function main() {
  const url = process.env.DATABASE_URL;

  console.log('🔍 Iniciando Diagnóstico de Seed:');
  console.log('------------------------------------');

  if (!url) {
    console.error('❌ ERRO: DATABASE_URL não encontrada no .env');
    return;
  }

  // Instanciando com a propriedade correta para a versão 7.x
  const prisma = new PrismaClient({
    datasourceUrl: url, 
  });

  console.log('✅ Conexão configurada. Tentando popular o banco...');

  try {
    // 1. Populando Níveis ABC (Criticidade)
    const niveisABC = ['A', 'B', 'C'];
    for (const nivel of niveisABC) {
      await prisma.abc.upsert({
        where: { nivel: nivel },
        update: {},
        create: { nivel: nivel }
      });
    }

    // 2. Populando Níveis XYZ (Previsibilidade)
    const niveisXYZ = ['X', 'Y', 'Z'];
    for (const nivel of niveisXYZ) {
      await prisma.xyz.upsert({
        where: { nivel: nivel },
        update: {},
        create: { nivel: nivel }
      });
    }

    console.log('✅ Categorias ABC e XYZ prontas.');

    // 3. Criando Equipamento de Teste (BOMBA-001)
    const catA = await prisma.abc.findFirst({ where: { nivel: 'A' } });
    const catX = await prisma.xyz.findFirst({ where: { nivel: 'X' } });

    if (catA && catX) {
      await prisma.equipamento.upsert({
        where: { tag: 'BOMBA-001' },
        update: {},
        create: {
          nome: "Bomba de Recalque de Teste",
          tag: "BOMBA-001",
          fabricante: "KSB",
          modelo: "Meganorm",
          setor: "Utilidades",
          data_instalacao: new Date('2024-01-01'),
          abc_idcriticidade: catA.idcriticidade,
          xyz_idxyz: catX.idxyz,
          status: 'OPERANDO'
        }
      });
      console.log('💎 Equipamento "BOMBA-001" garantido no banco.');
    }
  } catch (error) {
    console.error('❌ Erro durante a execução do Prisma:', error);
  } finally {
    await prisma.$disconnect();
    console.log('🔌 Conexão encerrada.');
  }
}

main();