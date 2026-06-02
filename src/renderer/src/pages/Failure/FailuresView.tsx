import React, { useState, useEffect } from 'react';
import { CreateFailureForm } from "../../components/Failure/CreateFailureForm";
export function FailuresView() {
  const [falhas, setFalhas] = useState<any[]>([]);
  const [busca, setBusca] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const carregarFalhas = async () => {
    // @ts-ignore
    const response = await window.api.getFailures();
    if (response.success) {
      setFalhas(response.data);
    } else {
      console.error("Erro ao buscar falhas:", response.error);
    }
  };

  useEffect(() => {
    carregarFalhas();
  }, []);

  // 🟢 Lógica para recarregar a tabela quando o formulário for salvo com sucesso
  const handleFechamentoDoModal = () => {
    setIsModalOpen(false);
    carregarFalhas(); // Atualiza a tabela com o dado novo!
  };

  // 🟢 Filtro em tempo real (Pesquisa por TAG, Equipamento ou Causa)
  const falhasFiltradas = falhas.filter(f => 
    f.equipamento?.tag?.toLowerCase().includes(busca.toLowerCase()) ||
    f.equipamento?.nome?.toLowerCase().includes(busca.toLowerCase()) ||
    f.causa_raiz?.nome?.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      
      {/* CABEÇALHO DA TELA */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>📊 Histórico de Ocorrências</h2>
        <button 
          onClick={() => setIsModalOpen(true)}
          style={{ padding: '10px 20px', backgroundColor: '#2ecc71', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}
        >
          + Nova Ocorrência
        </button>
      </div>

      {/* BARRA DE PESQUISA */}
      <input 
        type="text" 
        placeholder="🔍 Pesquisar por TAG, Máquina ou Causa Raiz..." 
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
        style={{ width: '100%', padding: '12px', marginBottom: '20px', border: '1px solid #ccc', borderRadius: '4px' }}
      />

      {/* TABELA DE DADOS */}
      <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <thead>
          <tr style={{ backgroundColor: '#f8f9fa', textAlign: 'left' }}>
            <th style={{ padding: '12px', borderBottom: '2px solid #ddd' }}>Data da Falha</th>
            <th style={{ padding: '12px', borderBottom: '2px solid #ddd' }}>TAG</th>
            <th style={{ padding: '12px', borderBottom: '2px solid #ddd' }}>Equipamento</th>
            <th style={{ padding: '12px', borderBottom: '2px solid #ddd' }}>Causa Raiz</th>
            <th style={{ padding: '12px', borderBottom: '2px solid #ddd' }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {falhasFiltradas.length > 0 ? (
            falhasFiltradas.map((falha) => (
              <tr key={falha.idfalhas} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '12px' }}>{new Date(falha.data_hora_falha).toLocaleString('pt-BR')}</td>
                <td style={{ padding: '12px', fontWeight: 'bold' }}>{falha.equipamento?.tag}</td>
                <td style={{ padding: '12px' }}>{falha.equipamento?.nome}</td>
                <td style={{ padding: '12px', color: '#e74c3c', fontWeight: '500' }}>{falha.causa_raiz?.nome || 'Não informada'}</td>
                <td style={{ padding: '12px' }}>
                  {falha.data_hora_reparo 
                    ? <span style={{ color: 'green', fontWeight: 'bold' }}>Reparado</span> 
                    : <span style={{ color: 'red', fontWeight: 'bold' }}>Pendente</span>}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} style={{ padding: '20px', textAlign: 'center', color: '#666' }}>Nenhuma ocorrência encontrada.</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* MODAL FLUTUANTE DO FORMULÁRIO */}
      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', maxHeight: '90vh', overflowY: 'auto', width: '600px', position: 'relative' }}>
            
            {/* Botão de Fechar o Modal */}
            <button 
              onClick={handleFechamentoDoModal} 
              style={{ position: 'absolute', top: '15px', right: '15px', background: 'transparent', border: 'none', fontSize: '18px', cursor: 'pointer', fontWeight: 'bold', color: '#999' }}
            >
              X
            </button>
            
            {/* Importando o formulário que já criamos */}
            <CreateFailureForm />
            
          </div>
        </div>
      )}
    </div>
  );
}