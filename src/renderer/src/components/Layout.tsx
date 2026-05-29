import React from "react";
import { Outlet, Link } from "react-router-dom";

export function Layout() {
  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "sans-serif" }}>
      {/* MENU LATERAL FIXO (Esqueleto) */}
      <nav
        style={{
          width: "250px",
          backgroundColor: "#2c3e50",
          padding: "20px",
          color: "white",
        }}
      >
        <h2
          style={{
            fontSize: "18px",
            borderBottom: "1px solid #34495e",
            paddingBottom: "10px",
          }}
        >
          Engenharia de Manutenção
        </h2>
        <ul style={{ listStyle: "none", padding: 0, marginTop: "20px" }}>
          <li style={{ marginBottom: "10px" }}>
            <Link to="/" style={{ color: "#ecf0f1", textDecoration: "none" }}>
              📊 Dashboard
            </Link>
          </li>
          <li style={{ marginBottom: "10px" }}>
            <Link
              to="/cadastro-equipamento"
              style={{ color: "#ecf0f1", textDecoration: "none" }}
            >
              ⚙️ Novo Equipamento
            </Link>
          </li>
          <li style={{ marginBottom: "10px" }}>
            <Link
              to="/equipamentos"
              style={{ color: "#ecf0f1", textDecoration: "none" }}
            >
              📋 Lista de Equipamentos
            </Link>
          </li>
          <li style={{ marginBottom: "10px" }}>
            <Link
              to="/registro-falha"
              style={{ color: "#ecf0f1", textDecoration: "none" }}
            >
              🚨 Registro de Falhas
            </Link>
          </li>
          <li style={{ marginBottom: "10px" }}>
            <Link
              to="/historico-falhas"
              style={{ color: "#ecf0f1", textDecoration: "none" }}
            >
              📚 Histórico de Falhas
            </Link>
          </li>
        </ul>
      </nav>

      {/* ÁREA PRINCIPAL DINÂMICA */}
      <main
        style={{
          flex: 1,
          padding: "30px",
          backgroundColor: "#f4f6f7",
          overflowY: "auto",
        }}
      >
        {/* A mágica acontece aqui: O conteúdo da página aparece dentro do Outlet */}
        <Outlet />
      </main>
    </div>
  );
}
