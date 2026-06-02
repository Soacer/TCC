import React, { useEffect, useState } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';
import { Chart } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend);

export function Dashboard() {
  const [filters, setFilters] = useState({ plantaId: '', setorId: '', equipamentoId: '' });
  const [options, setOptions] = useState({ plantas: [], setores: [], equipamentos: [] });
  const [kpis, setKpis] = useState({ mtbf: 0, mttr: 0, disponibilidade: "0.00", totalFalhas: 0 });
  const [paretoData, setParetoData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const api = (window as any).api;

  // Carrega plantas ao montar
  useEffect(() => {
    api.getPlantas().then((res: any) => setOptions(prev => ({ ...prev, plantas: res.data })));
  }, []);

  // Cascata de Setores
  useEffect(() => {
    if (filters.plantaId) {
      api.getSetores(filters.plantaId).then((res: any) => setOptions(prev => ({ ...prev, setores: res.data, equipamentos: [] })));
    }
  }, [filters.plantaId]);

  // Cascata de Equipamentos
  useEffect(() => {
    if (filters.setorId) {
      api.getEquipamentos(filters.setorId).then((res: any) => setOptions(prev => ({ ...prev, equipamentos: res.data })));
    }
  }, [filters.setorId]);

  // Busca dados toda vez que o filtro muda
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const [resKPIs, resPareto] = await Promise.all([
        api.getGlobalKPIs(filters),
        api.getParetoData(filters)
      ]);
      if (resKPIs.success) setKpis(resKPIs.data);
      if (resPareto.success) setParetoData(resPareto.data);
      setLoading(false);
    };
    loadData();
  }, [filters]);

  return (
    <div style={{ padding: '30px', fontFamily: 'sans-serif', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <h1 style={{ color: '#2c3e50', marginBottom: '20px' }}>Análise Hierárquica de Confiabilidade</h1>

      {/* Filtros */}
      <div style={{ display: 'flex', gap: '15px', marginBottom: '30px' }}>
        <select value={filters.plantaId} onChange={(e) => setFilters({ plantaId: e.target.value, setorId: '', equipamentoId: '' })} style={selectStyle}>
          <option value="">Todas as Plantas</option>
          {options.plantas.map((p: any) => <option key={p.idplanta} value={p.idplanta}>{p.nome}</option>)}
        </select>

        <select value={filters.setorId} disabled={!filters.plantaId} onChange={(e) => setFilters({ ...filters, setorId: e.target.value, equipamentoId: '' })} style={selectStyle}>
          <option value="">Todos os Setores</option>
          {options.setores.map((s: any) => <option key={s.idsetor} value={s.idsetor}>{s.nome}</option>)}
        </select>

        <select value={filters.equipamentoId} disabled={!filters.setorId} onChange={(e) => setFilters({ ...filters, equipamentoId: e.target.value })} style={selectStyle}>
          <option value="">Todos os Equipamentos</option>
          {options.equipamentos.map((eq: any) => <option key={eq.idequipamentos} value={eq.idequipamentos}>{eq.nome}</option>)}
        </select>
      </div>

      {/* Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '40px' }}>
        {['Disponibilidade', 'MTBF', 'MTTR', 'Total Falhas'].map((label, idx) => (
          <div key={label} style={cardStyle}>
            <h3 style={titleStyle}>{label}</h3>
            <p style={valueStyle}>
              {idx === 0 ? `${kpis.disponibilidade}%` : idx === 1 ? `${kpis.mtbf.toFixed(1)}h` : idx === 2 ? `${kpis.mttr.toFixed(1)}h` : kpis.totalFalhas}
            </p>
          </div>
        ))}
      </div>

      {/* Gráfico */}
      <div style={chartContainerStyle}>
        <h3 style={titleStyle}>Pareto de Causas Raízes</h3>
        {loading ? <p>Carregando...</p> : (
          <Chart type="bar" data={{
            labels: paretoData.map(i => i.nome),
            datasets: [
              { type: 'line' as const, label: '% Acumulado', borderColor: '#e74c3c', data: paretoData.map(i => i.percentualAcumulado), yAxisID: 'y1' },
              { type: 'bar' as const, label: 'Ocorrências', backgroundColor: '#3498db', data: paretoData.map(i => i.quantidade), yAxisID: 'y' }
            ]
          }} options={{
            responsive: true, maintainAspectRatio: false, scales: {
              y: { beginAtZero: true },
              y1: { position: 'right', min: 0, max: 100, grid: { drawOnChartArea: false } }
            }
          }} />
        )}
      </div>
    </div>
  );
}

const cardStyle: React.CSSProperties = { backgroundColor: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #ddd', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' };
const valueStyle: React.CSSProperties = { fontSize: '24px', fontWeight: 'bold', margin: '10px 0 0 0' };
const titleStyle: React.CSSProperties = { fontSize: '13px', color: '#666', textTransform: 'uppercase' };
const selectStyle: React.CSSProperties = { padding: '10px', borderRadius: '5px', border: '1px solid #bdc3c7', flex: 1 };
const chartContainerStyle: React.CSSProperties = { backgroundColor: '#fff', padding: '25px', borderRadius: '8px', border: '1px solid #ddd', height: '400px' };