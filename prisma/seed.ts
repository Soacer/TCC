// prisma/seed.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🧹 Limpando o banco de dados...');
  // A ordem de exclusão importa! Primeiro os "filhos" (Falhas), depois os "pais".
  await prisma.falha.deleteMany();
  await prisma.equipamento.deleteMany();
  await prisma.causaRaiz.deleteMany();
  await prisma.abc.deleteMany();
  await prisma.xyz.deleteMany();

  console.log('🌱 Populando tabelas de Criticidade (ABC / XYZ)...');
  
  await prisma.abc.createMany({
    data: [
      { idcriticidade: 1, nivel: 'A' },
      { idcriticidade: 2, nivel: 'B' },
      { idcriticidade: 3, nivel: 'C' }
    ]
  });

  await prisma.xyz.createMany({
    data: [
      { idxyz: 1, nivel: 'X' },
      { idxyz: 2, nivel: 'Y' },
      { idxyz: 3, nivel: 'Z' }
    ]
  });

  console.log('🌱 Criando Causas Raízes...');
  const causas = {
    lubrificacao: await prisma.causaRaiz.create({ data: { nome: 'Falta de Lubrificação' } }), // Nosso ofensor #1
    desgaste: await prisma.causaRaiz.create({ data: { nome: 'Desgaste Natural do Componente' } }), // Ofensor #2
    eletrica: await prisma.causaRaiz.create({ data: { nome: 'Sobrecarga Elétrica' } }),
    operacional: await prisma.causaRaiz.create({ data: { nome: 'Erro Operacional' } }),
    vibracao: await prisma.causaRaiz.create({ data: { nome: 'Excesso de Vibração' } }),
  };

  console.log('🌱 Criando Equipamentos...');
  // Nota: Se os seus equipamentos precisarem do ID do abc/xyz diretamente na criação, 
  // basta adicionar os campos aqui (ex: abc_id: 1, xyz_id: 1)
  const equipamentos = [
    await prisma.equipamento.create({ 
      data: { 
        tag: 'BOMBA-001', 
        nome: 'Bomba de Recalque Principal',
        fabricante: 'KSB',
        modelo: 'Meganorm 32-160',
        setor: 'Casa de Bombas',
        data_instalacao: new Date('2023-05-10T00:00:00Z'),
        // 🟢 Usando o connect: O Prisma se vira para achar a coluna correta!
        abc: { connect: { idcriticidade: 1 } }, // 1 = A
        xyz: { connect: { idxyz: 1 } }          // 1 = X
      } 
    }),
    await prisma.equipamento.create({ 
      data: { 
        tag: 'MOTOR-002', 
        nome: 'Motor da Esteira Secundária',
        fabricante: 'WEG',
        modelo: 'W22 Premium',
        setor: 'Linha de Montagem',
        data_instalacao: new Date('2024-01-15T00:00:00Z'),
        abc: { connect: { idcriticidade: 2 } }, // 2 = B
        xyz: { connect: { idxyz: 2 } }          // 2 = Y
      } 
    }),
    await prisma.equipamento.create({ 
      data: { 
        tag: 'COMP-003', 
        nome: 'Compressor de Ar Central',
        fabricante: 'Atlas Copco',
        modelo: 'GA 50',
        setor: 'Utilidades',
        data_instalacao: new Date('2022-11-20T00:00:00Z'),
        abc: { connect: { idcriticidade: 1 } }, // 1 = A
        xyz: { connect: { idxyz: 1 } }          // 1 = X
      } 
    }),
    await prisma.equipamento.create({ 
      data: { 
        tag: 'VENT-004', 
        nome: 'Ventilador de Exaustão',
        fabricante: 'Ebmpapst',
        modelo: 'Axial S-Force',
        setor: 'Pintura',
        data_instalacao: new Date('2025-02-05T00:00:00Z'),
        abc: { connect: { idcriticidade: 3 } }, // 3 = C
        xyz: { connect: { idxyz: 3 } }          // 3 = Z
      } 
    })
  ];

  console.log('🌱 Gerando Histórico de Falhas (Viciado para o Pareto)...');
  
  // Função auxiliar para gerar datas passadas
  const diasAtras = (dias: number) => {
    const d = new Date();
    d.setDate(d.getDate() - dias);
    return d;
  };

  const falhasSeed = [
    // --- O GIGANTE: Falta de Lubrificação (8 ocorrências) ---
    { eq: equipamentos[0], causa: causas.lubrificacao, dias: 2, horasReparo: 2 },
    { eq: equipamentos[1], causa: causas.lubrificacao, dias: 5, horasReparo: 1 },
    { eq: equipamentos[0], causa: causas.lubrificacao, dias: 8, horasReparo: null }, // Pendente
    { eq: equipamentos[2], causa: causas.lubrificacao, dias: 12, horasReparo: 4 },
    { eq: equipamentos[3], causa: causas.lubrificacao, dias: 15, horasReparo: 2 },
    { eq: equipamentos[0], causa: causas.lubrificacao, dias: 18, horasReparo: 3 },
    { eq: equipamentos[1], causa: causas.lubrificacao, dias: 20, horasReparo: null }, // Pendente
    { eq: equipamentos[2], causa: causas.lubrificacao, dias: 25, horasReparo: 1 },

    // --- O MÉDIO: Desgaste Natural (4 ocorrências) ---
    { eq: equipamentos[0], causa: causas.desgaste, dias: 10, horasReparo: 6 },
    { eq: equipamentos[1], causa: causas.desgaste, dias: 14, horasReparo: 5 },
    { eq: equipamentos[3], causa: causas.desgaste, dias: 22, horasReparo: 8 },
    { eq: equipamentos[2], causa: causas.desgaste, dias: 28, horasReparo: 4 },

    // --- OS ISOLADOS (1 a 2 ocorrências) ---
    { eq: equipamentos[2], causa: causas.eletrica, dias: 3, horasReparo: 12 },
    { eq: equipamentos[1], causa: causas.operacional, dias: 7, horasReparo: 2 },
    { eq: equipamentos[0], causa: causas.vibracao, dias: 30, horasReparo: 4 },
  ];

  for (const item of falhasSeed) {
    const dataFalha = diasAtras(item.dias);
    let dataReparo = null;
    
    // Se tiver horas de reparo, soma na data da falha
    if (item.horasReparo) {
      dataReparo = new Date(dataFalha);
      dataReparo.setHours(dataReparo.getHours() + item.horasReparo);
    }

    await prisma.falha.create({
      data: {
        descricao: `Falha registrada durante a operação. Sintoma detectado pelo operador da área.`,
        data_hora_falha: dataFalha,
        data_hora_reparo: dataReparo,
        equipamento_id: item.eq.idequipamentos,
        causa_raiz_id: item.causa.idcausaraiz
      }
    });
  }

  console.log('✅ Banco de dados populado com sucesso!');
}

main()
  .catch((e) => {
    console.error('❌ Erro ao rodar a seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });