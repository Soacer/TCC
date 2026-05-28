//#region \0rolldown/runtime.js
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
	if (from && typeof from === "object" || typeof from === "function") for (var keys = __getOwnPropNames(from), i = 0, n = keys.length, key; i < n; i++) {
		key = keys[i];
		if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
			get: ((k) => from[k]).bind(null, key),
			enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
		});
	}
	return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", {
	value: mod,
	enumerable: true
}) : target, mod));
//#endregion
let electron = require("electron");
let node_path = require("node:path");
node_path = __toESM(node_path);
let node_url = require("node:url");
//#region src/main/database/prisma.ts
var prisma = new (require("@prisma/client")).PrismaClient();
async function connectDb() {
	try {
		await prisma.$connect();
		console.log("✅ Banco de dados conectado com sucesso!");
	} catch (error) {
		console.error("❌ Erro ao conectar no banco:", error);
	}
}
//#endregion
//#region src/main/repositories/Equipments/EquipmentRepository.ts
var EquipmentRepository = class {
	async create(data) {
		return await prisma.equipamento.create({ data: {
			nome: data.nome,
			tag: data.tag,
			fabricante: data.fabricante,
			modelo: data.modelo,
			setor: data.setor,
			data_instalacao: data.data_instalacao,
			status: "OPERANDO",
			abc_idcriticidade: data.idcriticidade,
			xyz_idxyz: data.idxyz
		} });
	}
	async findByTag(tag) {
		return await prisma.equipamento.findUnique({ where: { tag } });
	}
	async findAll() {
		return await prisma.equipamento.findMany({ include: {
			abc: true,
			xyz: true
		} });
	}
	async softDelete(id) {
		return await prisma.equipamento.update({
			where: { idequipamentos: id },
			data: { isActive: false }
		});
	}
	async update(id, data) {
		return await prisma.equipamento.update({
			where: { idequipamentos: id },
			data: {
				nome: data.nome,
				tag: data.tag,
				fabricante: data.fabricante,
				modelo: data.modelo,
				setor: data.setor,
				abc_idcriticidade: data.idcriticidade,
				xyz_idxyz: data.idxyz
			}
		});
	}
	async reactivate(id) {
		return await prisma.equipamento.update({
			where: { idequipamentos: id },
			data: { isActive: true }
		});
	}
};
//#endregion
//#region src/main/useCases/Equipments/CreateEquipmentUseCase.ts
var CreateEquipmentUseCase = class {
	equipmentRepository;
	constructor(equipmentRepository) {
		this.equipmentRepository = equipmentRepository;
	}
	/**
	* Executa a lógica de criação de um equipamento.
	*/
	async execute(data) {
		if (await this.equipmentRepository.findByTag(data.tag)) throw new Error(`O equipamento com a TAG ${data.tag} já está cadastrado.`);
		if (new Date(data.data_instalacao) > /* @__PURE__ */ new Date()) throw new Error("A data de instalação não pode ser uma data futura.");
		return await this.equipmentRepository.create(data);
	}
};
//#endregion
//#region src/main/useCases/Equipments/SelectAllEquipmentUseCase.ts
var SelectAllEquipmentUseCase = class {
	equipmentRepository;
	constructor(equipmentRepository) {
		this.equipmentRepository = equipmentRepository;
	}
	async execute() {
		return await this.equipmentRepository.findAll();
	}
};
//#endregion
//#region src/main/useCases/Equipments/SoftDeleteEquipmentUseCase.ts
var SoftDeleteEquipmentUseCase = class {
	repository;
	constructor(repository) {
		this.repository = repository;
	}
	async execute(id) {
		return await this.repository.softDelete(id);
	}
};
//#endregion
//#region src/main/useCases/Equipments/UpdateEquipmentUseCase.ts
var UpdateEquipmentUseCase = class {
	repository;
	constructor(repository) {
		this.repository = repository;
	}
	async execute(id, data) {
		return await this.repository.update(id, data);
	}
};
//#endregion
//#region src/main/useCases/Equipments/ReactivateEquipmentUseCase.ts
var ReactivateEquipmentUseCase = class {
	repository;
	constructor(repository) {
		this.repository = repository;
	}
	async execute(id) {
		return await this.repository.reactivate(id);
	}
};
//#endregion
//#region src/main/ipc/Equipment/equipmentHandlers.ts
function registerEquipmentHandlers() {
	electron.ipcMain.handle("create-equipment", async (_, data) => {
		try {
			return {
				success: true,
				data: await new CreateEquipmentUseCase(new EquipmentRepository()).execute(data)
			};
		} catch (error) {
			return {
				success: false,
				error: error.message
			};
		}
	});
	electron.ipcMain.handle("get-equipments", async (_) => {
		try {
			return {
				success: true,
				data: await new SelectAllEquipmentUseCase(new EquipmentRepository()).execute()
			};
		} catch (error) {
			return {
				success: false,
				error: error.message
			};
		}
	});
	electron.ipcMain.handle("soft-delete-equipment", async (_, id) => {
		try {
			await new SoftDeleteEquipmentUseCase(new EquipmentRepository()).execute(id);
			return { success: true };
		} catch (error) {
			return {
				success: false,
				error: error.message
			};
		}
	});
	electron.ipcMain.handle("update-equipment", async (_, id, data) => {
		try {
			return {
				success: true,
				data: await new UpdateEquipmentUseCase(new EquipmentRepository()).execute(id, data)
			};
		} catch (error) {
			return {
				success: false,
				error: error.message
			};
		}
	});
	electron.ipcMain.handle("reactivate-equipment", async (_, id) => {
		try {
			await new ReactivateEquipmentUseCase(new EquipmentRepository()).execute(id);
			return { success: true };
		} catch (error) {
			return {
				success: false,
				error: error.message
			};
		}
	});
}
//#endregion
//#region src/main/index.ts
var __filename$1 = (0, node_url.fileURLToPath)(require("url").pathToFileURL(__filename).href);
var __dirname$1 = node_path.default.dirname(__filename$1);
function createWindow() {
	const mainWindow = new electron.BrowserWindow({
		width: 1200,
		height: 800,
		show: false,
		autoHideMenuBar: true,
		...process.platform === "linux" ? { icon: node_path.default.join(__dirname$1, "../../resources/icon.png") } : {},
		webPreferences: {
			preload: node_path.default.join(__dirname$1, "../preload/index.js"),
			sandbox: false,
			contextIsolation: true
		}
	});
	mainWindow.on("ready-to-show", () => {
		mainWindow.show();
		mainWindow.webContents.openDevTools();
	});
	mainWindow.webContents.setWindowOpenHandler((details) => {
		electron.shell.openExternal(details.url);
		return { action: "deny" };
	});
	if (process.env["ELECTRON_RENDERER_URL"]) mainWindow.loadURL(process.env["ELECTRON_RENDERER_URL"]);
	else mainWindow.loadFile(node_path.default.join(__dirname$1, "../renderer/index.html"));
}
electron.app.whenReady().then(async () => {
	await connectDb();
	registerEquipmentHandlers();
	createWindow();
	electron.app.on("activate", function() {
		if (electron.BrowserWindow.getAllWindows().length === 0) createWindow();
	});
});
electron.app.on("window-all-closed", () => {
	if (process.platform !== "darwin") electron.app.quit();
});
//#endregion
