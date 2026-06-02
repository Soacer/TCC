import React, { useState, useEffect } from "react";

export function CreatePlanView() {
  const [equipamentos, setEquipamentos] = useState<any[]>([]);
  const [equipamentoSelecionado, setEquipamentoSelecionado] = useState("");

  // Dados do Plano Mestre
  const [tipoManutencao, setTipoManutencao] = useState("PREVENTIVA");
  const [periocidade, setPeriocidade] = useState<number | "">("");

  // Lista Dinâmica de Tarefas
  const [tarefas, setTarefas] = useState([
    { ordem: 1, tarefa: "", descricao: "", tempo_execucao: "" },
  ]);

  useEffect(() => {
    // Carrega a lista de máquinas para o select
    const carregarEquipamentos = async () => {
      // @ts-ignore
      const res = await window.api.getEquipments(); // Assumindo que você tem essa rota!
      if (res.success) setEquipamentos(res.data);
    };
    carregarEquipamentos();
  }, []);

  // 🟢 Funções para manipular a lista dinâmica de tarefas
  const adicionarTarefa = () => {
    setTarefas([
      ...tarefas,
      {
        ordem: tarefas.length + 1,
        tarefa: "",
        descricao: "",
        tempo_execucao: "",
      },
    ]);
  };

  const atualizarTarefa = (index: number, campo: string, valor: any) => {
    const novasTarefas = [...tarefas];
    novasTarefas[index] = { ...novasTarefas[index], [campo]: valor };
    setTarefas(novasTarefas);
  };

  const removerTarefa = (index: number) => {
    const novasTarefas = tarefas.filter((_, i) => i !== index);
    // Reajusta a ordem (1, 2, 3...)
    const tarefasReordenadas = novasTarefas.map((t, i) => ({
      ...t,
      ordem: i + 1,
    }));
    setTarefas(tarefasReordenadas);
  };

  // 🟢 O Fluxo de Salvamento Duplo
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!equipamentoSelecionado) return alert("Selecione um equipamento!");

    // 1. Cria o Plano Mestre no Banco
    // @ts-ignore
    const resPlano = await window.api.createPlan({
      tipo_manutencao: tipoManutencao,
      periocidade_dias: Number(periocidade),
      tarefas: tarefas.map((t) => ({
        ...t,
        tempo_execucao: t.tempo_execucao ? Number(t.tempo_execucao) : null,
      })),
    });

    if (!resPlano.success) {
      return alert("Erro ao criar plano: " + resPlano.error);
    }

    // 2. Anexa o Plano recém-criado ao Equipamento selecionado
    const planoId = resPlano.data.idplanos;
    // @ts-ignore
    const resVinculo = await window.api.linkPlanToEquipment({
      equipamentoId: equipamentoSelecionado,
      planoId: planoId,
    });

    if (resVinculo.success) {
      alert("✅ Plano criado e anexado com sucesso!");
      // Limpa a tela
      setTarefas([{ ordem: 1, tarefa: "", descricao: "", tempo_execucao: "" }]);
      setPeriocidade("");
      setEquipamentoSelecionado("");
    }
  };

  return (
    <div
      style={{
        padding: "20px",
        maxWidth: "800px",
        margin: "0 auto",
        backgroundColor: "white",
        borderRadius: "8px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      }}
    >
      <h2 style={{ borderBottom: "2px solid #eee", paddingBottom: "10px" }}>
        📝 Novo Plano de Manutenção
      </h2>

      <form onSubmit={handleSubmit}>
        {/* CABEÇALHO DO PLANO */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: "15px",
            marginBottom: "30px",
            marginTop: "20px",
          }}
        >
          <div>
            <label>Equipamento Alvo</label>
            <select
              value={equipamentoSelecionado}
              onChange={(e) => setEquipamentoSelecionado(e.target.value)}
              required
              style={{ width: "100%", padding: "8px" }}
            >
              <option value="">-- Selecione --</option>
              {equipamentos.map((eq) => (
                <option key={eq.idequipamentos} value={eq.idequipamentos}>
                  {eq.tag} - {eq.nome}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label>Tipo</label>
            <select
              value={tipoManutencao}
              onChange={(e) => setTipoManutencao(e.target.value)}
              style={{ width: "100%", padding: "8px" }}
            >
              <option value="CORRETIVA_PLANEJADA">Corretiva Planejada</option>  
              <option value="CORRETIVA_NAO_PLANEJADA">Corretiva Não-Planejada</option>  
              <option value="PREVENTIVA">Preventiva</option>
              <option value="PREDITIVA">Preditiva</option>
              <option value="INSPETIVA">Inspetiva</option>
            </select>
          </div>
          <div>
            <label>Periodicidade (Dias)</label>
            <input
              type="number"
              min="1"
              value={periocidade}
              onChange={(e) =>
                setPeriocidade(
                  e.target.value === "" ? "" : Number(e.target.value),
                )
              }
              required
              style={{ width: "100%", padding: "8px" }}
            />{" "}
          </div>
        </div>

        {/* LISTA DE TAREFAS */}
        <div
          style={{
            backgroundColor: "#f8f9fa",
            padding: "20px",
            borderRadius: "8px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "15px",
            }}
          >
            <h3 style={{ margin: 0 }}>Passo a Passo (Tarefas)</h3>
            <button
              type="button"
              onClick={adicionarTarefa}
              style={{
                padding: "8px 15px",
                backgroundColor: "#3498db",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              + Adicionar Passo
            </button>
          </div>

          {tarefas.map((t, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                gap: "10px",
                alignItems: "flex-start",
                marginBottom: "15px",
                padding: "15px",
                backgroundColor: "white",
                border: "1px solid #ddd",
                borderRadius: "4px",
              }}
            >
              <div
                style={{
                  padding: "8px",
                  backgroundColor: "#eee",
                  borderRadius: "4px",
                  fontWeight: "bold",
                }}
              >
                #{t.ordem}
              </div>

              <div
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                <input
                  type="text"
                  placeholder="O que deve ser feito? (Ex: Lubrificar Rolamento)"
                  value={t.tarefa}
                  onChange={(e) =>
                    atualizarTarefa(index, "tarefa", e.target.value)
                  }
                  required
                  style={{ padding: "8px" }}
                />
                <input
                  type="text"
                  placeholder="Instruções adicionais (Opcional)"
                  value={t.descricao}
                  onChange={(e) =>
                    atualizarTarefa(index, "descricao", e.target.value)
                  }
                  style={{ padding: "8px" }}
                />
              </div>

              <input
                type="number"
                placeholder="Horas (Ex: 0.5)"
                value={t.tempo_execucao}
                onChange={(e) =>
                  atualizarTarefa(index, "tempo_execucao", e.target.value)
                }
                style={{ padding: "8px", width: "120px" }}
              />

              <button
                type="button"
                onClick={() => removerTarefa(index)}
                style={{
                  padding: "8px",
                  backgroundColor: "#e74c3c",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                X
              </button>
            </div>
          ))}
        </div>

        <button
          type="submit"
          style={{
            width: "100%",
            padding: "15px",
            backgroundColor: "#2ecc71",
            color: "white",
            border: "none",
            borderRadius: "4px",
            fontSize: "16px",
            fontWeight: "bold",
            marginTop: "20px",
            cursor: "pointer",
          }}
        >
          💾 Salvar Plano e Anexar
        </button>
      </form>
    </div>
  );
}
