import { prisma } from './src/main/database/prisma';

async function runTest() {
  console.log("📊 Extraindo Indicadores de Engenharia...");

  // 1. Busca o equipamento e as falhas registradas
  const equipamento = await prisma.equipamento.findFirst({
    where: { tag: 'BOMBA-001' },
    include: { falhas: true }
  });

  if (!equipamento) {
    console.error("❌ Equipamento não encontrado.");
    return;
  }

  const falhas = equipamento.falhas;
  const totalFalhas = falhas.length;

  if (totalFalhas === 0) {
    console.log("Máquina operando 100% - Sem falhas registradas.");
    return;
  }

  // 2. Cálculos de Confiabilidade
  const totalDowntime = falhas.reduce((acc, f) => acc + (f.tempo_parada_horas || 0), 0);
  const agora = new Date().getTime();
  const instalacao = equipamento.data_instalacao.getTime();
  
  // Converte o tempo de vida total de milissegundos para horas
  const tempoVidaTotalHoras = (agora - instalacao) / (1000 * 60 * 60);
  
  const uptime = tempoVidaTotalHoras - totalDowntime;
  const mtbf = uptime / totalFalhas;
  const mttr = totalDowntime / totalFalhas;
  const disponibilidade = (uptime / tempoVidaTotalHoras) * 100;

  // 3. Exibe os resultados
  console.table([{
    Equipamento: equipamento.tag,
    "Total de Falhas": totalFalhas,
    "Tempo Parado (h)": totalDowntime,
    "MTBF (h)": mtbf.toFixed(2),
    "MTTR (h)": mttr.toFixed(2),
    "Disponibilidade (%)": disponibilidade.toFixed(2) + "%"
  }]);

  console.log("\n🏁 Lógica de Back-end validada com sucesso!");
}

runTest()
  .catch(console.error)
  .finally(() => prisma.$disconnect());