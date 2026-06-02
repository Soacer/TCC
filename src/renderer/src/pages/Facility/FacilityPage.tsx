import React, { useState, useEffect } from 'react';

export function FacilityPage() {
  const [plantas, setPlantas] = useState<any[]>([]);
  const [novaPlantaNome, setNovaPlantaNome] = useState('');
  const [novoSetorNome, setNovoSetorNome] = useState('');
  const [plantaSelecionadaId, setPlantaSelecionadaId] = useState('');

  const carregarDados = async () => {
    // @ts-ignore
    const res = await window.api.getPlantas();
    if (res.success) setPlantas(res.data);
  };

  useEffect(() => { carregarDados(); }, []);

  const handleCriarPlanta = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!novaPlantaNome) return;
    // @ts-ignore
    const res = await window.api.createPlanta(novaPlantaNome);
    if (res.success) { setNovaPlantaNome(''); carregarDados(); }
  };

  const handleCriarSetor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!novoSetorNome || !plantaSelecionadaId) return;
    // @ts-ignore
    const res = await window.api.createSetor({ nome: novoSetorNome, plantaId: plantaSelecionadaId });
    if (res.success) { setNovoSetorNome(''); setPlantaSelecionadaId(''); carregarDados(); }
  };

  // 🟢 FUNÇÕES DE UPDATE E DELETE
  const handleEditarPlanta = async (id: string, nomeAtual: string) => {
    const novoNome = prompt("Editar nome da Planta:", nomeAtual);
    if (!novoNome || novoNome === nomeAtual) return;
    // @ts-ignore
    const res = await window.api.updatePlanta({ id, nome: novoNome });
    if (res.success) carregarDados();
  };

  const handleDeletarPlanta = async (id: string) => {
    if (!confirm("Tem certeza? Isso apagará a planta e todos os seus setores!")) return;
    // @ts-ignore
    const res = await window.api.deletePlanta(id);
    if (res.success) carregarDados();
  };

  const handleEditarSetor = async (id: string, nomeAtual: string) => {
    const novoNome = prompt("Editar nome do Setor:", nomeAtual);
    if (!novoNome || novoNome === nomeAtual) return;
    // @ts-ignore
    const res = await window.api.updateSetor({ id, nome: novoNome });
    if (res.success) carregarDados();
  };

  const handleDeletarSetor = async (id: string) => {
    if (!confirm("Tem certeza que deseja apagar este setor?")) return;
    // @ts-ignore
    const res = await window.api.deleteSetor(id);
    if (res.success) carregarDados();
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h2 style={{ borderBottom: '2px solid #eee', paddingBottom: '10px', marginTop: 0 }}>🏭 Gerir Instalações</h2>

      <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
        
        {/* Formulários de Criação */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h3 style={{ marginTop: 0, color: '#2c3e50' }}>1. Cadastrar Planta</h3>
            <form onSubmit={handleCriarPlanta} style={{ display: 'flex', gap: '10px' }}>
              <input type="text" placeholder="Ex: Planta Salvador" value={novaPlantaNome} onChange={e => setNovaPlantaNome(e.target.value)} style={{ flex: 1, padding: '10px', borderRadius: '4px', border: '1px solid #bdc3c7' }} />
              <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>+ Planta</button>
            </form>
          </div>

          <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h3 style={{ marginTop: 0, color: '#2c3e50' }}>2. Cadastrar Setor</h3>
            <form onSubmit={handleCriarSetor} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <select value={plantaSelecionadaId} onChange={e => setPlantaSelecionadaId(e.target.value)} style={{ padding: '10px', borderRadius: '4px', border: '1px solid #bdc3c7' }}>
                <option value="">-- Selecione a Planta Pai --</option>
                {plantas.map(p => <option key={p.idplanta} value={p.idplanta}>{p.nome}</option>)}
              </select>
              <div style={{ display: 'flex', gap: '10px' }}>
                <input type="text" placeholder="Ex: Setor de Moagem" value={novoSetorNome} onChange={e => setNovoSetorNome(e.target.value)} style={{ flex: 1, padding: '10px', borderRadius: '4px', border: '1px solid #bdc3c7' }} />
                <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#2ecc71', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>+ Setor</button>
              </div>
            </form>
          </div>
        </div>

        {/* Listagem com Opções de Edição/Exclusão */}
        <div style={{ flex: 1, backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h3 style={{ marginTop: 0, color: '#2c3e50' }}>Estrutura Atual da Empresa</h3>
          
          {plantas.length === 0 ? (
            <p style={{ color: '#7f8c8d' }}>Nenhuma planta cadastrada.</p>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {plantas.map(planta => (
                <li key={planta.idplanta} style={{ marginBottom: '15px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <strong style={{ fontSize: '18px', color: '#2c3e50' }}>🏭 {planta.nome}</strong>
                    <div>
                      <button onClick={() => handleEditarPlanta(planta.idplanta, planta.nome)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px' }}>✏️</button>
                      <button onClick={() => handleDeletarPlanta(planta.idplanta)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px' }}>🗑️</button>
                    </div>
                  </div>
                  
                  <ul style={{ listStyle: 'none', paddingLeft: '20px', marginTop: '10px' }}>
                    {planta.setores.length === 0 ? (
                      <li style={{ color: '#95a5a6', fontSize: '14px' }}>↳ Nenhum setor cadastrado.</li>
                    ) : (
                      planta.setores.map((setor: any) => (
                        <li key={setor.idsetor} style={{ padding: '8px', backgroundColor: '#f8f9fa', marginBottom: '5px', borderRadius: '4px', borderLeft: '3px solid #3498db', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span><span style={{ color: '#7f8c8d', fontSize: '12px' }}>ID: {setor.idsetor.slice(0, 4)}... | </span> <strong>{setor.nome}</strong></span>
                          <div>
                            <button onClick={() => handleEditarSetor(setor.idsetor, setor.nome)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px' }}>✏️</button>
                            <button onClick={() => handleDeletarSetor(setor.idsetor)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px' }}>🗑️</button>
                          </div>
                        </li>
                      ))
                    )}
                  </ul>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}