let electron = require("electron");
//#region src/preload/index.ts
electron.contextBridge.exposeInMainWorld("api", {
	createEquipment: (data) => electron.ipcRenderer.invoke("create-equipment", data),
	getEquipments: () => electron.ipcRenderer.invoke("get-equipments"),
	softDeleteEquipment: (id) => electron.ipcRenderer.invoke("soft-delete-equipment", id),
	updateEquipment: (id, data) => electron.ipcRenderer.invoke("update-equipment", id, data),
	reactivateEquipment: (id) => electron.ipcRenderer.invoke("reactivate-equipment", id)
});
//#endregion
