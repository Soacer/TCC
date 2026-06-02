import React, { useEffect, useState } from "react";

export function CreateEquipmentForm() {
  const [formData, setFormData] = useState({
    nome: "",
    tag: "",
    fabricante: "",
    modelo: "",
    plantaId: "",
    setorId: "",
    tipo: "OUTROS", // Valor inicial padrão
    data_instalacao: "",
    idcriticidade: 1,
    idxyz: 1,
  });

  const [options, setOptions] = useState({ plantas: [], setores: [] });
  const [mensagem, setMensagem] = useState({ tipo: "", texto: "" });
  const api = (window as any).api;

  useEffect(() => {
    api.getPlantas().then((res: any) => {
      if (res.success) setOptions((prev) => ({ ...prev, plantas: res.data }));
    });
  }, []);

  useEffect(() => {
    if (formData.plantaId) {
      api.getSetores(formData.plantaId).then((res: any) => {
        if (res.success) setOptions((prev) => ({ ...prev, setores: res.data }));
      });
    } else {
      setOptions((prev) => ({ ...prev, setores: [] }));
    }
  }, [formData.plantaId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "idcriticidade" || name === "idxyz" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensagem({ tipo: "loading", texto: "Salvando equipamento..." });

    const payload = {
      ...formData,
      data_instalacao: new Date(formData.data_instalacao),
    };
    const response = await api.createEquipment(payload);

    if (response.success) {
      setMensagem({
        tipo: "success",
        texto: `Equipamento ${payload.tag} cadastrado com sucesso!`,
      });
      // Resetar form mantendo os campos limpos
      setFormData({
        nome: "",
        tag: "",
        fabricante: "",
        modelo: "",
        plantaId: "",
        setorId: "",
        tipo: "OUTROS",
        data_instalacao: "",
        idcriticidade: 1,
        idxyz: 1,
      });
    } else {
      setMensagem({
        tipo: "error",
        texto: response.error || "Erro ao cadastrar",
      });
    }
  };

  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "0 auto",
        padding: "20px",
        fontFamily: "sans-serif",
      }}
    >
      <h2>Cadastrar Novo Equipamento</h2>

      {mensagem.texto && (
        <div
          style={{
            padding: "10px",
            marginBottom: "15px",
            backgroundColor: mensagem.tipo === "error" ? "#ffebee" : "#e8f5e9",
            color: mensagem.tipo === "error" ? "#c62828" : "#2e7d32",
          }}
        >
          {mensagem.texto}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "15px" }}
      >
        <div style={{ display: "flex", gap: "15px" }}>
          <label style={{ flex: 1 }}>
            Planta:
            <select
              required
              name="plantaId"
              value={formData.plantaId}
              onChange={handleChange}
              style={{ width: "100%", padding: "8px" }}
            >
              <option value="">Selecione...</option>
              {options.plantas.map((p: any) => (
                <option key={p.idplanta} value={p.idplanta}>
                  {p.nome}
                </option>
              ))}
            </select>
          </label>
          <label style={{ flex: 1 }}>
            Setor:
            <select
              required
              name="setorId"
              value={formData.setorId}
              onChange={handleChange}
              disabled={!formData.plantaId}
              style={{ width: "100%", padding: "8px" }}
            >
              {" "}
              <option value="">Selecione o setor...</option>
              {options.setores.map((s: any) => (
                <option key={s.idsetor} value={s.idsetor}>
                  {s.nome}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div style={{ display: "flex", gap: "15px" }}>
          <label style={{ flex: 1 }}>
            Nome:
            <input
              required
              type="text"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              style={{ width: "100%", padding: "8px" }}
            />
          </label>
          <label style={{ flex: 1 }}>
            TAG:
            <input
              required
              type="text"
              name="tag"
              value={formData.tag}
              onChange={handleChange}
              style={{ width: "100%", padding: "8px" }}
            />
          </label>
        </div>

        {/* --- Campo TIPO adicionado aqui --- */}
        <label>
          Tipo do Equipamento:
          <select
            name="tipo"
            value={formData.tipo}
            onChange={handleChange}
            style={{ width: "100%", padding: "8px" }}
          >
            <option value="BOMBA">Bomba</option>
            <option value="COMPRESSOR">Compressor</option>
            <option value="MOTOR">Motor</option>
            <option value="VALVULA">Válvula</option>
            <option value="TANQUE">Tanque</option>
            <option value="PERMUTADOR">Permutador de Calor</option>
            <option value="INSTRUMENTO">Instrumento</option>
            <option value="OUTROS">Outros</option>
          </select>
        </label>

        <div style={{ display: "flex", gap: "15px" }}>
          <label style={{ flex: 1 }}>
            Fabricante:
            <input
              required
              type="text"
              name="fabricante"
              value={formData.fabricante}
              onChange={handleChange}
              style={{ width: "100%", padding: "8px" }}
            />
          </label>
          <label style={{ flex: 1 }}>
            Modelo:
            <input
              required
              type="text"
              name="modelo"
              value={formData.modelo}
              onChange={handleChange}
              style={{ width: "100%", padding: "8px" }}
            />
          </label>
        </div>

        <label>
          Data de Instalação:
          <input
            required
            type="date"
            name="data_instalacao"
            value={formData.data_instalacao}
            onChange={handleChange}
            style={{ width: "100%", padding: "8px" }}
          />
        </label>

        <div style={{ display: "flex", gap: "15px" }}>
          <label style={{ flex: 1 }}>
            Criticidade (ABC):
            <select
              name="idcriticidade"
              value={formData.idcriticidade}
              onChange={handleChange}
              style={{ width: "100%", padding: "8px" }}
            >
              <option value={1}>Classe A</option>
              <option value={2}>Classe B</option>
              <option value={3}>Classe C</option>
            </select>
          </label>
          <label style={{ flex: 1 }}>
            Previsibilidade (XYZ):
            <select
              name="idxyz"
              value={formData.idxyz}
              onChange={handleChange}
              style={{ width: "100%", padding: "8px" }}
            >
              <option value={1}>Classe X</option>
              <option value={2}>Classe Y</option>
              <option value={3}>Classe Z</option>
            </select>
          </label>
        </div>

        <button
          type="submit"
          style={{
            padding: "10px 15px",
            backgroundColor: "#0056b3",
            color: "white",
            border: "none",
            cursor: "pointer",
          }}
        >
          Salvar Equipamento
        </button>
      </form>
    </div>
  );
}
