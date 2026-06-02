import React, { useEffect, useState } from "react";

export function ListEquipments() {
  const [equipamentos, setEquipamentos] = useState<any[]>([]);
  const [mostrarApenasAtivos, setMostrarApenasAtivos] = useState(true);
  const [loading, setLoading] = useState(true);
  const [equipamentoEmEdicao, setEquipamentoEmEdicao] = useState<any | null>(
    null,
  );
  const [formData, setFormData] = useState<any>({});

  const fetchEquipamentos = async () => {
    setLoading(true);
    // @ts-ignore
    const response = await window.api.getEquipments();
    if (response.success) {
      setEquipamentos(response.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchEquipamentos();
  }, []);

  const handleSoftDelete = async (id: string, tag: string) => {
    const confirmar = window.confirm(
      `Tem certeza que deseja desativar o equipamento ${tag}?`,
    );
    if (confirmar) {
      // @ts-ignore
      const response = await window.api.softDeleteEquipment(id);
      if (response.success) {
        fetchEquipamentos();
      } else {
        alert("Erro ao desativar: " + response.error);
      }
    }
  };

  const handleReactivate = async (id: string, tag: string) => {
    const confirmar = window.confirm(`Deseja reativar o equipamento ${tag}?`);
    if (confirmar) {
      // @ts-ignore
      const response = await window.api.reactivateEquipment(id);
      if (response.success) {
        fetchEquipamentos();
      } else {
        alert("Erro ao reativar: " + response.error);
      }
    }
  };

  const equipamentosFiltrados = equipamentos.filter((eq) => {
    if (mostrarApenasAtivos) {
      return eq.isActive === true;
    }
    return true;
  });

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h2>Inventário de Equipamentos</h2>
        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            cursor: "pointer",
            backgroundColor: "white",
            padding: "10px",
            borderRadius: "8px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          }}
        >
          <input
            type="checkbox"
            checked={mostrarApenasAtivos}
            onChange={(e) => setMostrarApenasAtivos(e.target.checked)}
            style={{ width: "18px", height: "18px" }}
          />
          Mostrar apenas ativos
        </label>
      </div>
      {loading ? (
        <p>Carregando dados do banco...</p>
      ) : (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            backgroundColor: "white",
            boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
          }}
        >
          <thead>
            <tr
              style={{
                backgroundColor: "#2c3e50",
                color: "white",
                textAlign: "left",
              }}
            >
              <th style={{ padding: "12px" }}>Status</th>
              <th style={{ padding: "12px" }}>TAG</th>
              <th style={{ padding: "12px" }}>Nome</th>
              <th style={{ padding: "12px" }}>Fabricante</th>
              <th style={{ padding: "12px" }}>Modelo</th>
              <th style={{ padding: "12px" }}>Setor</th>
              <th style={{ padding: "12px" }}>Instalação</th>
              <th style={{ padding: "12px" }}>Status</th>
              <th style={{ padding: "12px" }}>ABC</th>
              <th style={{ padding: "12px" }}>XYZ</th>
              <th style={{ padding: "12px", textAlign: "center" }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {equipamentosFiltrados.length === 0 ? (
              <tr>
                <td
                  colSpan={11}
                  style={{ padding: "20px", textAlign: "center" }}
                >
                  Nenhum equipamento encontrado.
                </td>
              </tr>
            ) : (
              equipamentosFiltrados.map((eq) => (
                <tr
                  key={eq.idequipamentos}
                  style={{ borderBottom: "1px solid #ddd" }}
                >
                  <td style={{ padding: "12px" }}>
                    <span
                      style={{
                        padding: "4px 8px",
                        borderRadius: "12px",
                        fontSize: "12px",
                        color: "white",
                        fontWeight: "bold",
                        backgroundColor: eq.isActive ? "#2e7d32" : "#c62828",
                      }}
                    >
                      {eq.isActive ? "Ativo" : "Inativo"}
                    </span>
                  </td>
                  <td style={{ padding: "12px", fontWeight: "bold" }}>
                    {eq.tag}
                  </td>
                  <td style={{ padding: "12px" }}>{eq.status}</td>
                  <td style={{ padding: "12px" }}>{eq.tag}</td>
                  <td style={{ padding: "12px" }}>{eq.nome}</td>
                  <td style={{ padding: "12px" }}>
                    {eq.setor?.nome || "-"}
                  </td>{" "}
                  <td style={{ padding: "12px" }}>
                    {eq.data_instalacao
                      ? new Date(eq.data_instalacao).toLocaleDateString("pt-BR")
                      : "-"}
                  </td>
                  <td style={{ padding: "12px" }}>{eq.status}</td>
                  <td
                    style={{
                      padding: "12px",
                      fontWeight: "bold",
                      color: "#2c3e50",
                    }}
                  >
                    {eq.abc?.nivel
                      ? `Classe ${eq.abc.nivel}`
                      : eq.abc_idcriticidade}
                  </td>
                  <td
                    style={{
                      padding: "12px",
                      fontWeight: "bold",
                      color: "#2c3e50",
                    }}
                  >
                    {eq.xyz?.nivel ? `Classe ${eq.xyz.nivel}` : eq.xyz_idxyz}
                  </td>
                  <td
                    style={{
                      padding: "12px",
                      textAlign: "center",
                      display: "flex",
                      gap: "10px",
                      justifyContent: "center",
                    }}
                  >
                    <button
                      onClick={() => {
                        setEquipamentoEmEdicao(eq);
                        setFormData({
                          nome: eq.nome,
                          tag: eq.tag,
                          fabricante: eq.fabricante,
                          modelo: eq.modelo,
                          setor: eq.setor,
                          tipo: eq.tipo || "OUTROS", // 🟢 Carrega o tipo atual
                          idcriticidade: eq.abc_idcriticidade,
                          idxyz: eq.xyz_idxyz,
                        });
                      }}
                      style={{
                        padding: "6px 12px",
                        cursor: "pointer",
                        backgroundColor: "#f39c12",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        fontWeight: "bold",
                      }}
                    >
                      ✏️ Editar
                    </button>
                    {eq.isActive ? (
                      <button
                        onClick={() =>
                          handleSoftDelete(eq.idequipamentos, eq.tag)
                        }
                        style={{
                          padding: "6px 12px",
                          cursor: "pointer",
                          backgroundColor: "#e74c3c",
                          color: "white",
                          border: "none",
                          borderRadius: "4px",
                          fontWeight: "bold",
                        }}
                      >
                        🗑️ Desativar
                      </button>
                    ) : (
                      <button
                        onClick={() =>
                          handleReactivate(eq.idequipamentos, eq.tag)
                        }
                        style={{
                          padding: "6px 12px",
                          cursor: "pointer",
                          backgroundColor: "#2e7d32",
                          color: "white",
                          border: "none",
                          borderRadius: "4px",
                          fontWeight: "bold",
                        }}
                      >
                        🔄 Reativar
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
      {/* --- MODAL DE EDIÇÃO RÁPIDA --- */}
      {equipamentoEmEdicao && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.6)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "30px",
              borderRadius: "8px",
              width: "400px",
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
            }}
          >
            <h3 style={{ marginTop: 0 }}>Editar Equipamento</h3>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                marginBottom: "20px",
              }}
            >
              <label>
                Nome:
                <input
                  type="text"
                  value={formData.nome || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, nome: e.target.value })
                  }
                  style={{ width: "100%", padding: "8px", marginTop: "4px" }}
                />
              </label>
              <label>
                TAG:
                <input
                  type="text"
                  value={formData.tag || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, tag: e.target.value })
                  }
                  style={{ width: "100%", padding: "8px", marginTop: "4px" }}
                />
              </label>
              <label>
                Setor:
                <input
                  type="text"
                  value={formData.setor || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, setor: e.target.value })
                  }
                  style={{ width: "100%", padding: "8px", marginTop: "4px" }}
                />
              </label>
              <label>
                Tipo do Equipamento:
                <select
                  value={formData.tipo || "OUTROS"}
                  onChange={(e) =>
                    setFormData({ ...formData, tipo: e.target.value })
                  }
                  style={{
                    width: "100%",
                    padding: "8px",
                    marginTop: "4px",
                    backgroundColor: "white",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                  }}
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
              {/* Você pode adicionar os outros campos (Fabricante, Modelo) seguindo o mesmo padrão */}
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "10px",
              }}
            >
              <button
                onClick={() => setEquipamentoEmEdicao(null)}
                style={{
                  padding: "8px 16px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Cancelar
              </button>

              <button
                onClick={async () => {
                  // @ts-ignore
                  const response = await window.api.updateEquipment(
                    equipamentoEmEdicao.idequipamentos,
                    formData,
                  );
                  if (response.success) {
                    setEquipamentoEmEdicao(null); // Fecha o modal
                    fetchEquipamentos(); // Recarrega a tabela com os novos dados
                  } else {
                    alert("Erro ao atualizar: " + response.error);
                  }
                }}
                style={{
                  padding: "8px 16px",
                  backgroundColor: "#2ecc71",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                Salvar Alterações
              </button>
            </div>
          </div>
        </div>
      )}{" "}
    </div>
  );
}
