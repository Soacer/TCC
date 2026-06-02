import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("api", {
  //Equipaments
  createEquipment: (data: any) => ipcRenderer.invoke("create-equipment", data),
  getEquipments: () => ipcRenderer.invoke("get-equipments"),
  softDeleteEquipment: (id: string) =>
    ipcRenderer.invoke("soft-delete-equipment", id),
  updateEquipment: (id: string, data: any) =>
    ipcRenderer.invoke("update-equipment", id, data),
  reactivateEquipment: (id: string) =>
    ipcRenderer.invoke("reactivate-equipment", id),

  //Failures
  createFailure: (data: any) => ipcRenderer.invoke("create-failure", data),
  getCausasRaiz: () => ipcRenderer.invoke("get-causas-raiz"),
  getFailures: () => ipcRenderer.invoke("get-failures"),

  //Plans
  createPlan: (data: any) => ipcRenderer.invoke("create-plan", data),
  getPlans: () => ipcRenderer.invoke("get-plans"),
  deletePlan: (id: string) => ipcRenderer.invoke("delete-plan", id),

  //EquipmentHasPlan
  linkPlanToEquipment: (data: any) =>
    ipcRenderer.invoke("link-plan-to-equipment", data),
  getEquipmentPlans: (equipamentoId: string) =>
    ipcRenderer.invoke("get-equipment-plans", equipamentoId),
  registerPlanExecution: (data: any) =>
    ipcRenderer.invoke("register-plan-execution", data),

  //Tasks
  updateTask: (data: any) => ipcRenderer.invoke("update-task", data),
  deleteTask: (id: string) => ipcRenderer.invoke("delete-task", id),

  //DigitalTwin
  getDigitalTwin: (setorId: string) =>
    ipcRenderer.invoke("get-digital-twin", setorId),
  saveDigitalTwin: (data: any) => ipcRenderer.invoke("save-digital-twin", data),

  //Plantas e Setores
  getPlantas: () => ipcRenderer.invoke("get-plantas"),
  createPlanta: (nome: string) => ipcRenderer.invoke("create-planta", nome),
  createSetor: (data: any) => ipcRenderer.invoke("create-setor", data),
  updatePlanta: (data: any) => ipcRenderer.invoke("update-planta", data),
  updateSetor: (data: any) => ipcRenderer.invoke("update-setor", data),
  deletePlanta: (id: string) => ipcRenderer.invoke("delete-planta", id),
  deleteSetor: (id: string) => ipcRenderer.invoke("delete-setor", id),

  //Dashboard
  getSetores: (plantaId: string) => ipcRenderer.invoke('getSetores', plantaId),
  getEquipamentos: (setorId: string) => ipcRenderer.invoke('getEquipamentos', setorId),
  getGlobalKPIs: (filters?: any) =>
    ipcRenderer.invoke("getGlobalKPIs", filters),
  getParetoData: (filters?: any) =>
    ipcRenderer.invoke("getParetoData", filters),
});
