import React, { useState, useEffect } from 'react';

export function ViewPlansView() {
  // Estados de Filtro (Equipamento)
  const [equipamentos, setEquipamentos] = useState<any[]>([]);
  const [equipamentoSelecionado, setEquipamentoSelecionado] = useState('');

  // Estados de Dados
  const [planosVinculados, setPlanosVinculados] = useState<any[]>([]);
  const [planoSelecionado, setPlanoSelecionado] = useState<any | null>(null);
  
  // Controles de Edição
  const [editandoTarefaId, setEditandoTarefaId] = useState<string | null>(null);
  const [dadosEdicao, setDadosEdicao] = useState({ tarefa: '', descricao: '', tempo_execucao: '' });

  // 1. Carrega a lista de todos os equipamentos ao abrir a tela
  useEffect(() => {
    const fetchEquipamentos = async () => {
      // @ts-ignore
      const res = await window.api.getEquipments();
      if (res.success) setEquipamentos(res.data);
    };
    fetchEquipamentos();
  }, []);

  // 2. Carrega os planos atrelados ao equipamento selecionado
  const carregarPlanos = async (idEquipamento: string) => {
    if (!idEquipamento) {
      setPlanosVinculados([]);
      setPlanoSelecionado(null);
      return;
    }

    // @ts-ignore
    const res = await window.api.getEquipmentPlans(idEquipamento);
    if (res.success) {
      setPlanosVinculados(res.data); // Array de EquipamentoTemPlano
      
      // Se um plano já estava aberto, atualiza os dados dele para refletir edições/exclusões
      if (planoSelecionado) {
        const vinculoAtualizado = res.data.find((v: any) => v.plano.idplanos === planoSelecionado.idplanos);
        setPlanoSelecionado(vinculoAtualizado ? vinculoAtualizado.plano : null);
      }
    }
  };

  // Dispara a busca de planos sempre que o usuário trocar de máquina no Select
  useEffect(() => {
    carregarPlanos(equipamentoSelecionado);
  }, [equipamentoSelecionado]);

  // 🟢 Funções de Ação (Back-end)
  const handleExcluirTarefa = async (id: string) => {
    if (confirm("Tem certeza que deseja remover esta tarefa?")) {
      // @ts-ignore
      const res = await window.api.deleteTask(id);
      if (res.success) {
        carregarPlanos(equipamentoSelecionado); // Recarrega os dados da tela
      } else {
        alert("Erro ao excluir: " + res.error);
      }
    }
  };

  const iniciarEdicao = (tarefa: any) => {
    setEditandoTarefaId(tarefa.idtarefas);
    setDadosEdicao({
      tarefa: tarefa.tarefa,
      descricao: tarefa.descricao || '',
      tempo_execucao: tarefa.tempo_execucao || ''
    });
  };

  const salvarEdicao = async (id: string) => {
    // @ts-ignore
    const res = await window.api.updateTask({
      id,
      data: {
        tarefa: dadosEdicao.tarefa,
        descricao: dadosEdicao.descricao,
        tempo_execucao: dadosEdicao.tempo_execucao ? Number(dadosEdicao.tempo_execucao) : null
      }
    });

    if (res.success) {
      setEditandoTarefaId(null);
      carregarPlanos(equipamentoSelecionado);
    } else {
      alert("Erro ao salvar: " + res.error);
    }
  };

  return (
    <div style={{ display: 'flex', gap: '20px', height: '100%', fontFamily: 'sans-serif' }}>
      
      {/* COLUNA ESQUERDA: Filtro de Equipamento e Lista de Planos */}
      <div style={{ width: '320px', backgroundColor: 'white', padding: '15px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column' }}>
        
        {/* Filtro de Máquina */}
        <div style={{ marginBottom: '20px', borderBottom: '2px solid #eee', paddingBottom: '15px' }}>
          <h3 style={{ margin: '0 0 10px 0' }}>⚙️ Selecionar Máquina</h3>
          <select 
            value={equipamentoSelecionado} 
            onChange={e => {
              setEquipamentoSelecionado(e.target.value);
              setPlanoSelecionado(null); // Reseta a tela da direita ao trocar de máquina
            }} 
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #bdc3c7' }}
          >
            <option value="">-- Escolha um Equipamento --</option>
            {equipamentos.map(eq => (
              <option key={eq.idequipamentos} value={eq.idequipamentos}>
                {eq.tag} - {eq.nome}
              </option>
            ))}
          </select>
        </div>

        {/* Lista de Planos do Equipamento Selecionado */}
        <h4 style={{ margin: '0 0 10px 0', color: '#7f8c8d' }}>Planos Vinculados</h4>
        <div style={{ overflowY: 'auto', flex: 1 }}>
          {!equipamentoSelecionado ? (
            <p style={{ fontSize: '14px', color: '#95a5a6' }}>Selecione um equipamento acima.</p>
          ) : planosVinculados.length === 0 ? (
            <p style={{ fontSize: '14px', color: '#e74c3c' }}>Nenhum plano atrelado a esta máquina.</p>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {planosVinculados.map((vinculo) => (
                <li 
                  key={vinculo.idequipamentos_tem_planos} 
                  onClick={() => {
                    setPlanoSelecionado(vinculo.plano);
                    setEditandoTarefaId(null);
                  }}
                  style={{
                    padding: '12px', 
                    marginBottom: '8px', 
                    backgroundColor: planoSelecionado?.idplanos === vinculo.plano.idplanos ? '#3498db' : '#f8f9fa',
                    color: planoSelecionado?.idplanos === vinculo.plano.idplanos ? 'white' : '#2c3e50',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    border: '1px solid #e0e0e0'
                  }}
                >
                  <strong>{vinculo.plano.tipo_manutencao}</strong>
                  <div style={{ fontSize: '12px', marginTop: '4px' }}>A cada {vinculo.plano.periocidade_dias} dias</div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* COLUNA DIREITA: Detalhes e Tarefas */}
      <div style={{ flex: 1, backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflowY: 'auto' }}>
        {planoSelecionado ? (
          <>
            <h2 style={{ borderBottom: '2px solid #eee', paddingBottom: '10px', marginTop: 0 }}>
              Plano de Manutenção: {planoSelecionado.tipo_manutencao}
            </h2>
            <p><strong>Periodicidade:</strong> {planoSelecionado.periocidade_dias} dias</p>
            
            <h3 style={{ marginTop: '30px' }}>Passo a Passo</h3>
            
            {planoSelecionado.tarefas.length === 0 ? (
              <p style={{ color: '#e74c3c' }}>Este plano não tem tarefas ativas.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {planoSelecionado.tarefas.map((tarefa: any) => (
                  <div key={tarefa.idtarefas} style={{ padding: '15px', backgroundColor: '#f8f9fa', borderLeft: '4px solid #3498db', borderRadius: '4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    
                    {editandoTarefaId === tarefa.idtarefas ? (
                      <div style={{ flex: 1, display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', flex: 1 }}>
                          <input type="text" value={dadosEdicao.tarefa} onChange={e => setDadosEdicao({...dadosEdicao, tarefa: e.target.value})} style={{ padding: '6px' }} />
                          <input type="text" value={dadosEdicao.descricao} onChange={e => setDadosEdicao({...dadosEdicao, descricao: e.target.value})} placeholder="Descrição" style={{ padding: '6px' }} />
                        </div>
                        <input type="number" value={dadosEdicao.tempo_execucao} onChange={e => setDadosEdicao({...dadosEdicao, tempo_execucao: e.target.value})} placeholder="Horas" style={{ padding: '6px', width: '80px' }} />
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                          <button onClick={() => salvarEdicao(tarefa.idtarefas)} style={{ padding: '6px 12px', background: '#2ecc71', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Salvar</button>
                          <button onClick={() => setEditandoTarefaId(null)} style={{ padding: '6px 12px', background: '#95a5a6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Cancelar</button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div>
                          <strong style={{ color: '#2c3e50' }}>#{tarefa.ordem} - {tarefa.tarefa}</strong>
                          {tarefa.descricao && <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#7f8c8d' }}>{tarefa.descricao}</p>}
                          {tarefa.tempo_execucao && <span style={{ display: 'inline-block', marginTop: '6px', fontSize: '12px', backgroundColor: '#ecf0f1', padding: '2px 6px', borderRadius: '4px' }}>⏱️ {tarefa.tempo_execucao}h</span>}
                        </div>
                        
                        <div style={{ display: 'flex', gap: '10px' }}>
                          <button onClick={() => iniciarEdicao(tarefa)} style={{ padding: '6px 12px', backgroundColor: '#f39c12', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>✏️ Editar</button>
                          <button onClick={() => handleExcluirTarefa(tarefa.idtarefas)} style={{ padding: '6px 12px', backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>🗑️ Excluir</button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <div style={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#95a5a6' }}>
            <p>{equipamentoSelecionado ? "Selecione um plano na lista ao lado para ver os detalhes." : "Aguardando seleção de equipamento..."}</p>
          </div>
        )}
      </div>
    </div>
  );
}