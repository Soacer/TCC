import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('api', {

  //Equipaments
  createEquipment: (data: any) => ipcRenderer.invoke('create-equipment', data),
  getEquipments: () => ipcRenderer.invoke('get-equipments'), 
  softDeleteEquipment: (id: string) => ipcRenderer.invoke('soft-delete-equipment', id)
});