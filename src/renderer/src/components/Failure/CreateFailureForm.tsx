import React, { useState, useEffect } from "react";

export function CreateFailureForm() {
  const [equipamentos, setEquipamentos] = useState<any[]>([]);
  const [causasRaiz, setCausasRaiz] = useState<any[]>([]);

  const [equipamentoId, setEquipamentoId] = useState("");
  const [descricao, setDescricao] = useState("");
  const [dataHora, setDataHora] = useState("");
  const [dataHoraReparo, setDataHoraReparo] = useState("");

  const [causaSelecionada, setCausaSelecionada] = useState("");
  const [novaCausaTexto, setNovaCausaTexto] = useState("");
  const [isNovaCausa, setIsNovaCausa] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      // @ts-ignore
      const resEq = await window.api.getEquipments();
      if (resEq.success)
        setEquipamentos(resEq.data.filter((eq: any) => eq.isActive));

      // @ts-ignore
      const resCausas = await window.api.getCausasRaiz();
      if (resCausas.success) setCausasRaiz(resCausas.data);
    };
    fetchData();

    const agora = new Date();
    agora.setMinutes(agora.getMinutes() - agora.getTimezoneOffset());
    setDataHora(agora.toISOString().slice(0, 16));
  }, []);

  const handleCausaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const valor = e.target.value;
    if (valor === "NOVA_CAUSA") {
      setIsNovaCausa(true);
      setCausaSelecionada("");
    } else {
      setIsNovaCausa(false);
      setCausaSelecionada(valor);
      setNovaCausaTexto("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const nomeDaCausaFinal = isNovaCausa
      ? novaCausaTexto.trim()
      : causaSelecionada;

    if (!nomeDaCausaFinal) {
      alert("Por favor, selecione ou digite uma Causa Raiz.");
      return;
    }

    const payload = {
      equipamento_id: equipamentoId,
      descricao: descricao,
      data_hora_falha: new Date(dataHora).toISOString(),
      causa_raiz_nome: nomeDaCausaFinal,
      data_hora_reparo: dataHoraReparo
        ? new Date(dataHoraReparo).toISOString()
        : null,
    };

    // @ts-ignore
    const response = await window.api.createFailure(payload);

    if (response.success) {
      window.location.reload();
    } else {
      alert("❌ Erro ao salvar falha: " + response.error);
    }
  };

  return (
    <div
      style={{ maxWidth: "600px", padding: "20px", fontFamily: "sans-serif" }}
    >
      <h2>🚨 Registrar Ocorrência de Falha</h2>

      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "15px" }}
      >
        <label
          style={{
            display: "flex",
            flexDirection: "column",
            fontWeight: "bold",
          }}
        >
          Equipamento Afetado:
          <select
            value={equipamentoId}
            onChange={(e) => setEquipamentoId(e.target.value)}
            required
            style={{ padding: "10px", marginTop: "5px" }}
          >
            <option value="">Selecione o Equipamento...</option>
            {equipamentos.map((eq) => (
              <option key={eq.idequipamentos} value={eq.idequipamentos}>
                {eq.tag} - {eq.nome}
              </option>
            ))}
          </select>
        </label>

        <label
          style={{
            display: "flex",
            flexDirection: "column",
            fontWeight: "bold",
          }}
        >
          Data e Hora da Falha:
          <input
            type="datetime-local"
            value={dataHora}
            onChange={(e) => setDataHora(e.target.value)}
            required
            style={{ padding: "10px", marginTop: "5px" }}
          />
        </label>

        <label
          style={{
            display: "flex",
            flexDirection: "column",
            fontWeight: "bold",
          }}
        >
          Data e Hora do Reparo:
          <input
            type="datetime-local"
            value={dataHoraReparo}
            onChange={(e) => setDataHoraReparo(e.target.value)}
            style={{
              padding: "10px",
              marginTop: "5px",
              border: "1px solid #ccc",
            }}
          />
        </label>

        {/* 🟢 O NOVO COMPORTAMENTO DA CAUSA RAIZ */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            padding: "15px",
            backgroundColor: "#f8f9fa",
            borderRadius: "8px",
            border: "1px solid #ddd",
          }}
        >
          <label
            style={{
              display: "flex",
              flexDirection: "column",
              fontWeight: "bold",
            }}
          >
            Causa Raiz da Falha:
            <select
              value={isNovaCausa ? "NOVA_CAUSA" : causaSelecionada}
              onChange={handleCausaChange}
              required={!isNovaCausa}
              style={{ padding: "10px", marginTop: "5px" }}
            >
              <option value="">Selecione uma causa conhecida...</option>
              {causasRaiz.map((causa) => (
                <option key={causa.idcausaraiz} value={causa.nome}>
                  {causa.nome}
                </option>
              ))}
              <option disabled>──────────</option>
              <option value="NOVA_CAUSA">
                ➕ Cadastrar nova Causa Raiz...
              </option>
            </select>
          </label>

          {/* Campo de texto que só aparece se o usuário escolher "Cadastrar nova" */}
          {isNovaCausa && (
            <label
              style={{
                display: "flex",
                flexDirection: "column",
                fontWeight: "bold",
                color: "#e74c3c",
              }}
            >
              Nome da Nova Causa Raiz:
              <input
                type="text"
                value={novaCausaTexto}
                onChange={(e) => setNovaCausaTexto(e.target.value)}
                required={isNovaCausa}
                placeholder="Ex: Curto-circuito no painel principal"
                style={{
                  padding: "10px",
                  marginTop: "5px",
                  border: "1px solid #e74c3c",
                }}
              />
              <span
                style={{
                  fontSize: "12px",
                  color: "#666",
                  marginTop: "4px",
                  fontWeight: "normal",
                }}
              >
                *Atenção: Esta causa será salva no catálogo para usos futuros.
                Evite erros de digitação.
              </span>
            </label>
          )}
        </div>

        <label
          style={{
            display: "flex",
            flexDirection: "column",
            fontWeight: "bold",
          }}
        >
          Descrição / Relato do Operador:
          <textarea
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            required
            rows={4}
            style={{ padding: "10px", marginTop: "5px" }}
          />
        </label>

        <button
          type="submit"
          style={{
            padding: "12px",
            backgroundColor: "#e74c3c",
            color: "white",
            border: "none",
            borderRadius: "4px",
            fontWeight: "bold",
            cursor: "pointer",
            marginTop: "10px",
          }}
        >
          Salvar Ocorrência
        </button>
      </form>
    </div>
  );
}
