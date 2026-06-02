let electron = require("electron");
//#region src/preload/index.ts
electron.contextBridge.exposeInMainWorld("api", {
	createEquipment: (data) => electron.ipcRenderer.invoke("create-equipment", data),
	getEquipments: () => electron.ipcRenderer.invoke("get-equipments"),
	softDeleteEquipment: (id) => electron.ipcRenderer.invoke("soft-delete-equipment", id),
	updateEquipment: (id, data) => electron.ipcRenderer.invoke("update-equipment", id, data),
	reactivateEquipment: (id) => electron.ipcRenderer.invoke("reactivate-equipment", id),
	createFailure: (data) => electron.ipcRenderer.invoke("create-failure", data),
	getCausasRaiz: () => electron.ipcRenderer.invoke("get-causas-raiz"),
	getFailures: () => electron.ipcRenderer.invoke("get-failures"),
	createPlan: (data) => electron.ipcRenderer.invoke("create-plan", data),
	getPlans: () => electron.ipcRenderer.invoke("get-plans"),
	deletePlan: (id) => electron.ipcRenderer.invoke("delete-plan", id),
	linkPlanToEquipment: (data) => electron.ipcRenderer.invoke("link-plan-to-equipment", data),
	getEquipmentPlans: (equipamentoId) => electron.ipcRenderer.invoke("get-equipment-plans", equipamentoId),
	registerPlanExecution: (data) => electron.ipcRenderer.invoke("register-plan-execution", data),
	updateTask: (data) => electron.ipcRenderer.invoke("update-task", data),
	deleteTask: (id) => electron.ipcRenderer.invoke("delete-task", id),
	getDigitalTwin: (setorId) => electron.ipcRenderer.invoke("get-digital-twin", setorId),
	saveDigitalTwin: (data) => electron.ipcRenderer.invoke("save-digital-twin", data),
	getPlantas: () => electron.ipcRenderer.invoke("get-plantas"),
	createPlanta: (nome) => electron.ipcRenderer.invoke("create-planta", nome),
	createSetor: (data) => electron.ipcRenderer.invoke("create-setor", data),
	updatePlanta: (data) => electron.ipcRenderer.invoke("update-planta", data),
	updateSetor: (data) => electron.ipcRenderer.invoke("update-setor", data),
	deletePlanta: (id) => electron.ipcRenderer.invoke("delete-planta", id),
	deleteSetor: (id) => electron.ipcRenderer.invoke("delete-setor", id),
	getSetores: (plantaId) => electron.ipcRenderer.invoke("getSetores", plantaId),
	getEquipamentos: (setorId) => electron.ipcRenderer.invoke("getEquipamentos", setorId),
	getGlobalKPIs: (filters) => electron.ipcRenderer.invoke("getGlobalKPIs", filters),
	getParetoData: (filters) => electron.ipcRenderer.invoke("getParetoData", filters)
});
//#endregion
