import React, { useEffect, useState } from "react";

export function ListEquipments() {
  const [equipamentos, setEquipamentos] = useState<any[]>([]);
  const [mostrarApenasAtivos, setMostrarApenasAtivos] = useState(true); // O filtro local
  const [loading, setLoading] = useState(true);

  // Busca TODOS os equipamentos no banco de dados apenas uma vez
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
        fetchEquipamentos(); // Recarrega para atualizar o status visual
      } else {
        alert("Erro ao desativar: " + response.error);
      }
    }
  };

  // 🟢 A MÁGICA DO FILTRO NO FRONT-END
  const equipamentosFiltrados = equipamentos.filter((eq) => {
    if (mostrarApenasAtivos) {
      return eq.isActive === true;
    }
    return true; // Se o toggle estiver desligado, mostra todos
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

        {/* Toggle do Filtro */}
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
              <th style={{ padding: "12px" }}>Data de Instalação</th>
              <th style={{ padding: "12px" }}>Status</th>
              <th style={{ padding: "12px" }}>Curva ABC</th>
              <th style={{ padding: "12px" }}>Curva XYZ</th>
              <th style={{ padding: "12px", textAlign: "center" }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {equipamentosFiltrados.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
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
                  <td style={{ padding: "12px" }}>{eq.setor}</td>
                  <td style={{ padding: "12px" }}>
                    {eq.data_instalacao
                      ? new Date(eq.data_instalacao).toLocaleDateString("pt-BR")
                      : "-"}
                  </td>{" "}
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
                    {/* Botão Editar (Deixado pronto para a próxima etapa) */}
                    <button
                      onClick={() =>
                        alert(
                          `A tela de edição do ${eq.tag} será construída aqui!`,
                        )
                      }
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

                    {/* Botão de Soft Delete */}
                    {eq.isActive && (
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
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
