import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('api', {

  //Equipaments
  createEquipment: (data: any) => ipcRenderer.invoke('create-equipment', data),
  getEquipments: () => ipcRenderer.invoke('get-equipments'), 
  softDeleteEquipment: (id: string) => ipcRenderer.invoke('soft-delete-equipment', id),
  updateEquipment: (id: string, data: any) => ipcRenderer.invoke('update-equipment', id, data),
  reactivateEquipment: (id: string) => ipcRenderer.invoke('reactivate-equipment', id),

  //Failures
  createFailure: (data: any) => ipcRenderer.invoke('create-failure', data),
  getCausasRaiz: () => ipcRenderer.invoke('get-causas-raiz'),
  getFailures: () => ipcRenderer.invoke('get-failures'),
});