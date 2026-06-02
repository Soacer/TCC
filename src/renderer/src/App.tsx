import React from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import { CreateEquipmentForm } from "./components/Equipment/CreateEquipmentForm";
import { ListEquipments } from "./pages/Equipment/ListEquipments";
import { CreateFailureForm } from "./components/Failure/CreateFailureForm";
import { FailuresView } from "./pages/Failure/FailuresView";
import { ViewPlansView } from "./pages/Plan/ViewPlansView";
import { CreatePlanView } from "./pages/Plan/CreatePlanView";
import { DigitalTwinPage } from "./pages/DigitalTwin/DigitalTwinPage";
import { FacilityPage } from "./pages/Facility/FacilityPage";
import { Dashboard } from "./pages/Dashboard/Dashboard";

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="cadastro-equipamento" element={<CreateEquipmentForm />}/>
          <Route path="equipamentos" element={<ListEquipments />} />
          <Route path="registro-falha" element={<CreateFailureForm />} />
          <Route path="/historico-falhas" element={<FailuresView />} />
          <Route path="/criar-plano" element={<CreatePlanView />} />
          <Route path="/visualizar-planos" element={<ViewPlansView />} />
          <Route path="/digital-twin" element={<DigitalTwinPage />} />{" "}
          <Route path="/instalacoes" element={<FacilityPage />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}
