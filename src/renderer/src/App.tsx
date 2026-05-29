import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { CreateEquipmentForm } from './components/Equipment/CreateEquipmentForm';
import { ListEquipments } from './components/Equipment/ListEquipments';
import { CreateFailureForm } from './components/Failure/CreateFailureForm';
import { FailuresView } from './components/Failure/FailuresView';

// Uma página temporária super simples só para testar a navegação
function Dashboard() {
  return (
    <div>
      <h2>Visão Geral da Planta</h2>
      <p>Aqui entrarão os KPIs de MTBF e Disponibilidade no futuro.</p>
    </div>
  );
}

export default function App() {
  return (
    <HashRouter>
      <Routes>
        {/* A Rota "Pai" é o Layout. Tudo que estiver dentro dela vai aparecer no <Outlet /> */}
        <Route path="/" element={<Layout />}>
          
          {/* Páginas "Filhas" */}
          <Route index element={<Dashboard />} />
          <Route path="cadastro-equipamento" element={<CreateEquipmentForm />} />
          <Route path="equipamentos" element={<ListEquipments />} />
          <Route path="registro-falha" element={<CreateFailureForm />} />
          <Route path="/historico-falhas" element={<FailuresView />} />
          
        </Route>
      </Routes>
    </HashRouter>
  );
}