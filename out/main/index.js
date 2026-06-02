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
let _prisma_client = require("@prisma/client");
//#region src/main/database/prisma.ts
var prisma$6 = new _prisma_client.PrismaClient();
async function connectDb() {
	try {
		await prisma$6.$connect();
		console.log("✅ Banco de dados conectado com sucesso!");
	} catch (error) {
		console.error("❌ Erro ao conectar no banco:", error);
	}
}
//#endregion
//#region src/main/repositories/Equipment/EquipmentRepository.ts
var EquipmentRepository = class {
	async create(data) {
		return await prisma$6.equipamento.create({ data: {
			nome: data.nome,
			tipo: data.tipo,
			tag: data.tag,
			fabricante: data.fabricante,
			modelo: data.modelo,
			setorId: data.setorId,
			data_instalacao: data.data_instalacao,
			status: "OPERANDO",
			abc_idcriticidade: data.idcriticidade,
			xyz_idxyz: data.idxyz
		} });
	}
	async findByTag(tag) {
		return await prisma$6.equipamento.findUnique({ where: { tag } });
	}
	async findAll() {
		return await prisma$6.equipamento.findMany({ include: {
			abc: true,
			xyz: true,
			setor: true
		} });
	}
	async softDelete(id) {
		return await prisma$6.equipamento.update({
			where: { idequipamentos: id },
			data: { isActive: false }
		});
	}
	async update(id, data) {
		return await prisma$6.equipamento.update({
			where: { idequipamentos: id },
			data: {
				nome: data.nome,
				tipo: data.tipo,
				tag: data.tag,
				fabricante: data.fabricante,
				modelo: data.modelo,
				setorId: data.setorId,
				abc_idcriticidade: data.idcriticidade,
				xyz_idxyz: data.idxyz
			}
		});
	}
	async reactivate(id) {
		return await prisma$6.equipamento.update({
			where: { idequipamentos: id },
			data: { isActive: true }
		});
	}
};
//#endregion
//#region src/main/useCases/Equipment/CreateEquipmentUseCase.ts
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
//#region src/main/useCases/Equipment/SelectAllEquipmentUseCase.ts
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
//#region src/main/useCases/Equipment/SoftDeleteEquipmentUseCase.ts
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
//#region src/main/useCases/Equipment/UpdateEquipmentUseCase.ts
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
//#region src/main/useCases/Equipment/ReactivateEquipmentUseCase.ts
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
//#region src/main/repositories/Failure/FailureRepository.ts
var FailureRepository = class {
	async create(data) {
		return await prisma$6.falha.create({ data: {
			descricao: data.descricao,
			data_hora_falha: data.data_hora_falha,
			data_hora_reparo: data.data_hora_reparo || null,
			tempo_parada_horas: data.tempo_parada_horas,
			equipamento: { connect: { idequipamentos: data.equipamento_id } },
			...data.causa_raiz_nome && data.causa_raiz_nome.trim() !== "" ? { causa_raiz: { connectOrCreate: {
				where: { nome: data.causa_raiz_nome.trim() },
				create: { nome: data.causa_raiz_nome.trim() }
			} } } : {}
		} });
	}
	async findAll(onlyActive = true) {
		return await prisma$6.falha.findMany({
			where: onlyActive ? { isActive: true } : void 0,
			include: {
				equipamento: true,
				causa_raiz: true
			},
			orderBy: { data_hora_falha: "desc" }
		});
	}
	async findByEquipment(equipamentoId) {
		return await prisma$6.falha.findMany({
			where: {
				equipamento_id: equipamentoId,
				isActive: true
			},
			include: { causa_raiz: true },
			orderBy: { data_hora_falha: "desc" }
		});
	}
	async update(id, data) {
		return await prisma$6.falha.update({
			where: { idfalhas: id },
			data: {
				descricao: data.descricao,
				data_hora_falha: data.data_hora_falha,
				data_hora_reparo: data.data_hora_reparo,
				tempo_parada_horas: data.tempo_parada_horas,
				equipamento_id: data.equipamento_id,
				causa_raiz_id: data.causa_raiz_id || null
			}
		});
	}
	async softDelete(id) {
		return await prisma$6.falha.update({
			where: { idfalhas: id },
			data: { isActive: false }
		});
	}
	async reactivate(id) {
		return await prisma$6.falha.update({
			where: { idfalhas: id },
			data: { isActive: true }
		});
	}
};
//#endregion
//#region src/main/useCases/Failure/CreateFailureUseCase.ts
var CreateFailureUseCase = class {
	repository;
	constructor(repository) {
		this.repository = repository;
	}
	async execute(data) {
		if (!data.equipamento_id) throw new Error("O equipamento afetado é obrigatório.");
		if (!data.descricao) throw new Error("A descrição do problema é obrigatória.");
		return await this.repository.create(data);
	}
};
//#endregion
//#region src/main/ipc/Failure/failureHandlers.ts
function registerFailureHandlers() {
	electron.ipcMain.handle("create-failure", async (_, data) => {
		try {
			return {
				success: true,
				data: await new CreateFailureUseCase(new FailureRepository()).execute(data)
			};
		} catch (error) {
			return {
				success: false,
				error: error.message
			};
		}
	});
	electron.ipcMain.handle("get-failures", async () => {
		try {
			return {
				success: true,
				data: await new FailureRepository().findAll()
			};
		} catch (error) {
			return {
				success: false,
				error: error.message
			};
		}
	});
}
//#endregion
//#region src/main/repositories/RootCause/RootCauseRepository.ts
var RootCauseRepository = class {
	async findAll() {
		return await prisma$6.causaRaiz.findMany({ orderBy: { nome: "asc" } });
	}
};
//#endregion
//#region src/main/useCases/RootCause/RootCauseUseCaste.ts
var GetCausasRaizUseCase = class {
	repository;
	constructor(repository) {
		this.repository = repository;
	}
	async execute() {
		return await this.repository.findAll();
	}
};
//#endregion
//#region src/main/ipc/RootCause/rootCauseHandlers.ts
function registerRootCauseHandlers() {
	electron.ipcMain.handle("get-causas-raiz", async () => {
		try {
			return {
				success: true,
				data: await new GetCausasRaizUseCase(new RootCauseRepository()).execute()
			};
		} catch (error) {
			return {
				success: false,
				error: error.message
			};
		}
	});
}
//#endregion
//#region src/main/repositories/Plan/PlanRepository.ts
var prisma$5 = new _prisma_client.PrismaClient();
var PlanRepository = class {
	async create(data) {
		return await prisma$5.plano.create({
			data: {
				tipo_manutencao: data.tipo_manutencao,
				periocidade_dias: data.periocidade_dias,
				tarefas: { create: data.tarefas }
			},
			include: { tarefas: { orderBy: { ordem: "asc" } } }
		});
	}
	async findAll() {
		return await prisma$5.plano.findMany({
			where: { isActive: true },
			include: {
				tarefas: {
					where: { isActive: true },
					orderBy: { ordem: "asc" }
				},
				_count: { select: { equipamentos: true } }
			},
			orderBy: { createdAt: "desc" }
		});
	}
	async findById(id) {
		return await prisma$5.plano.findUnique({
			where: { idplanos: id },
			include: { tarefas: { orderBy: { ordem: "asc" } } }
		});
	}
	async delete(id) {
		return await prisma$5.plano.update({
			where: { idplanos: id },
			data: { isActive: false }
		});
	}
};
//#endregion
//#region src/main/useCases/Plan/CreatePlanUseCase.ts
var CreatePlanUseCase = class {
	planRepository;
	constructor(planRepository) {
		this.planRepository = planRepository;
	}
	async execute(data) {
		if (!data.tipo_manutencao) throw new Error("O tipo de manutenção é obrigatório.");
		if (data.periocidade_dias <= 0) throw new Error("A periocidade deve ser maior que zero.");
		if (!data.tarefas || data.tarefas.length === 0) throw new Error("Um plano precisa ter pelo menos uma tarefa.");
		return await this.planRepository.create(data);
	}
};
//#endregion
//#region src/main/useCases/Plan/GetAllPlansUseCase.ts
var GetAllPlansUseCase = class {
	planRepository;
	constructor(planRepository) {
		this.planRepository = planRepository;
	}
	async execute() {
		return await this.planRepository.findAll();
	}
};
//#endregion
//#region src/main/ipc/Plan/planHandlers.ts
function registerPlanHandlers() {
	const repository = new PlanRepository();
	electron.ipcMain.handle("create-plan", async (_, data) => {
		try {
			return {
				success: true,
				data: await new CreatePlanUseCase(repository).execute(data)
			};
		} catch (error) {
			return {
				success: false,
				error: error.message
			};
		}
	});
	electron.ipcMain.handle("get-plans", async () => {
		try {
			return {
				success: true,
				data: await new GetAllPlansUseCase(repository).execute()
			};
		} catch (error) {
			return {
				success: false,
				error: error.message
			};
		}
	});
}
//#endregion
//#region src/main/repositories/EquipmentHasPlan/EquipmentHasPlanRepository.ts
var prisma$4 = new _prisma_client.PrismaClient();
var EquipmentHasPlanRepository = class {
	async link(equipamentoId, planoId) {
		return await prisma$4.equipamentoTemPlano.create({ data: {
			equipamentos_idequipamentos: equipamentoId,
			planos_idplanos: planoId
		} });
	}
	async findByEquipamento(equipamentoId) {
		return await prisma$4.equipamentoTemPlano.findMany({
			where: { equipamentos_idequipamentos: equipamentoId },
			include: { plano: { include: { tarefas: {
				where: { isActive: true },
				orderBy: { ordem: "asc" }
			} } } }
		});
	}
	async registerExecution(idVinculo, dataExecucao, periocidadeDias) {
		const dataProxima = new Date(dataExecucao);
		dataProxima.setDate(dataProxima.getDate() + periocidadeDias);
		return await prisma$4.equipamentoTemPlano.update({
			where: { idequipamentos_tem_planos: idVinculo },
			data: {
				ultima_execucao: dataExecucao,
				proxima_execucao: dataProxima
			}
		});
	}
};
//#endregion
//#region src/main/useCases/EquipmentHasPlan/LinkPlanUseCase.ts
var LinkPlanUseCase = class {
	repository;
	constructor(repository) {
		this.repository = repository;
	}
	async execute(equipamentoId, planoId) {
		if (!equipamentoId || !planoId) throw new Error("Os IDs do equipamento e do plano são obrigatórios.");
		return await this.repository.link(equipamentoId, planoId);
	}
};
//#endregion
//#region src/main/useCases/EquipmentHasPlan/RegisterExecutionUseCase.ts
var RegisterExecutionUseCase = class {
	repository;
	constructor(repository) {
		this.repository = repository;
	}
	async execute(idVinculo, dataExecucao, periocidadeDias) {
		if (!idVinculo || !dataExecucao || !periocidadeDias) throw new Error("Dados insuficientes para registar a execução do plano.");
		return await this.repository.registerExecution(idVinculo, new Date(dataExecucao), periocidadeDias);
	}
};
//#endregion
//#region src/main/ipc/EquipmentHasPlan/equipmentHasPlanHandlers.ts
function registerEquipmentHasPlanHandlers() {
	const repository = new EquipmentHasPlanRepository();
	electron.ipcMain.handle("link-plan-to-equipment", async (_, { equipamentoId, planoId }) => {
		try {
			return {
				success: true,
				data: await new LinkPlanUseCase(repository).execute(equipamentoId, planoId)
			};
		} catch (error) {
			return {
				success: false,
				error: error.message
			};
		}
	});
	electron.ipcMain.handle("get-equipment-plans", async (_, equipamentoId) => {
		try {
			return {
				success: true,
				data: await repository.findByEquipamento(equipamentoId)
			};
		} catch (error) {
			return {
				success: false,
				error: error.message
			};
		}
	});
	electron.ipcMain.handle("register-plan-execution", async (_, { idVinculo, dataExecucao, periocidadeDias }) => {
		try {
			return {
				success: true,
				data: await new RegisterExecutionUseCase(repository).execute(idVinculo, dataExecucao, periocidadeDias)
			};
		} catch (error) {
			return {
				success: false,
				error: error.message
			};
		}
	});
}
//#endregion
//#region src/main/repositories/Task/TaskRepository.ts
var prisma$3 = new _prisma_client.PrismaClient();
var TaskRepository = class {
	async update(id, data) {
		return await prisma$3.tarefa.update({
			where: { idtarefas: id },
			data
		});
	}
	async softDelete(id) {
		return await prisma$3.tarefa.update({
			where: { idtarefas: id },
			data: { isActive: false }
		});
	}
};
//#endregion
//#region src/main/useCases/Task/UpdateTaskUseCase.ts
var UpdateTaskUseCase = class {
	repository;
	constructor(repository) {
		this.repository = repository;
	}
	async execute(id, data) {
		if (!id) throw new Error("ID da tarefa é obrigatório para edição.");
		return await this.repository.update(id, data);
	}
};
//#endregion
//#region src/main/useCases/Task/DeleteTaskUseCase.ts
var DeleteTaskUseCase = class {
	repository;
	constructor(repository) {
		this.repository = repository;
	}
	async execute(id) {
		if (!id) throw new Error("ID da tarefa é obrigatório para exclusão.");
		return await this.repository.softDelete(id);
	}
};
//#endregion
//#region src/main/ipc/Task/taskHandlers.ts
function registerTaskHandlers() {
	const repository = new TaskRepository();
	electron.ipcMain.handle("update-task", async (_, { id, data }) => {
		try {
			return {
				success: true,
				data: await new UpdateTaskUseCase(repository).execute(id, data)
			};
		} catch (error) {
			return {
				success: false,
				error: error.message
			};
		}
	});
	electron.ipcMain.handle("delete-task", async (_, id) => {
		try {
			return {
				success: true,
				data: await new DeleteTaskUseCase(repository).execute(id)
			};
		} catch (error) {
			return {
				success: false,
				error: error.message
			};
		}
	});
}
//#endregion
//#region src/utils/topologyAnalyzer.ts
/**
* Analisa o grafo e classifica conexões como SERIE ou PARALELO puramente com base nas regras de engenharia.
*/
function classificarTopologia(blocks, connections) {
	const mapaGrafos = /* @__PURE__ */ new Map();
	blocks.forEach((b) => {
		mapaGrafos.set(b.id_bloco, {
			id: b.id_bloco,
			tipo: b.tipo_bloco,
			origens: /* @__PURE__ */ new Set(),
			destinos: /* @__PURE__ */ new Set()
		});
	});
	connections.forEach((c) => {
		if (mapaGrafos.has(c.blocoDestinoId)) mapaGrafos.get(c.blocoDestinoId).origens.add(c.blocoOrigemId);
		if (mapaGrafos.has(c.blocoOrigemId)) mapaGrafos.get(c.blocoOrigemId).destinos.add(c.blocoDestinoId);
	});
	const blocosEmParalelo = /* @__PURE__ */ new Set();
	const arrayBlocos = Array.from(mapaGrafos.values());
	for (let i = 0; i < arrayBlocos.length; i++) for (let j = i + 1; j < arrayBlocos.length; j++) {
		const blocoA = arrayBlocos[i];
		const blocoB = arrayBlocos[j];
		if (blocoA.tipo === blocoB.tipo) {
			const compartilhaOrigem = [...blocoA.origens].some((o) => blocoB.origens.has(o));
			const compartilhaDestino = [...blocoA.destinos].some((d) => blocoB.destinos.has(d));
			let isParallel = false;
			switch (blocoA.tipo) {
				case "bomba":
				case "compressor":
				case "motor":
				case "valvula":
				case "valvula_controle":
				case "tanque":
				case "permutador":
					isParallel = compartilhaOrigem && compartilhaDestino;
					break;
				default: isParallel = false;
			}
			if (isParallel) {
				blocosEmParalelo.add(blocoA.id);
				blocosEmParalelo.add(blocoB.id);
			}
		}
	}
	return connections.map((c) => {
		const ehMalhaParalela = blocosEmParalelo.has(c.blocoOrigemId) || blocosEmParalelo.has(c.blocoDestinoId);
		return {
			id_conexao: c.id_conexao,
			blocoOrigemId: c.blocoOrigemId,
			blocoDestinoId: c.blocoDestinoId,
			tipo_ligacao: ehMalhaParalela ? "PARALELO" : "SERIE"
		};
	});
}
//#endregion
//#region src/main/repositories/DigitalTwin/DigitalTwinRepository.ts
var prisma$2 = new _prisma_client.PrismaClient();
var DigitalTwinRepository = class {
	async findBySetor(setorId) {
		return {
			blocks: await prisma$2.diagramaBloco.findMany({
				where: { setorId },
				include: { equipamento: true }
			}),
			connections: await prisma$2.diagramaConexao.findMany({ where: { setorId } })
		};
	}
	async saveDiagram(setorId, blocks, connections) {
		return await prisma$2.$transaction(async (tx) => {
			await tx.diagramaConexao.deleteMany({ where: { setorId } });
			await tx.diagramaBloco.deleteMany({ where: { setorId } });
			if (blocks.length > 0) await tx.diagramaBloco.createMany({ data: blocks.map((b) => ({
				id_bloco: b.id_bloco,
				tipo_bloco: b.tipo_bloco,
				posicao_x: b.posicao_x,
				posicao_y: b.posicao_y,
				setorId,
				equipamentoId: b.equipamentoId && b.equipamentoId !== "" ? b.equipamentoId : null
			})) });
			if (connections.length > 0) {
				const processedConnections = classificarTopologia(blocks, connections);
				await tx.diagramaConexao.createMany({ data: processedConnections.map((c) => ({
					id_conexao: c.id_conexao,
					tipo_ligacao: c.tipo_ligacao,
					setorId,
					blocoOrigemId: c.blocoOrigemId,
					blocoDestinoId: c.blocoDestinoId
				})) });
			}
			return { success: true };
		});
	}
};
//#endregion
//#region src/main/useCases/DigitalTwin/GetDiagramUseCase.ts
var GetDiagramUseCase = class {
	repository;
	constructor(repository) {
		this.repository = repository;
	}
	async execute(setorId) {
		if (!setorId) throw new Error("O ID do setor é obrigatório para carregar o diagrama.");
		return await this.repository.findBySetor(setorId);
	}
};
//#endregion
//#region src/main/useCases/DigitalTwin/SaveDiagramUseCase.ts
var SaveDiagramUseCase = class {
	repository;
	constructor(repository) {
		this.repository = repository;
	}
	async execute(setorId, blocks, connections) {
		if (!setorId) throw new Error("O ID do setor é obrigatório para salvar o diagrama.");
		return await this.repository.saveDiagram(setorId, blocks, connections);
	}
};
//#endregion
//#region src/main/ipc/DigitalTwin/digitalTwinHandlers.ts
function registerDigitalTwinHandlers() {
	const repository = new DigitalTwinRepository();
	electron.ipcMain.handle("get-digital-twin", async (_, setorId) => {
		try {
			return {
				success: true,
				data: await new GetDiagramUseCase(repository).execute(setorId)
			};
		} catch (error) {
			return {
				success: false,
				error: error.message
			};
		}
	});
	electron.ipcMain.handle("save-digital-twin", async (_, { setorId, blocks, connections }) => {
		try {
			return {
				success: true,
				data: await new SaveDiagramUseCase(repository).execute(setorId, blocks, connections)
			};
		} catch (error) {
			return {
				success: false,
				error: error.message
			};
		}
	});
}
//#endregion
//#region src/main/repositories/Facility/FacilityRepository.ts
var prisma$1 = new _prisma_client.PrismaClient();
var FacilityRepository = class {
	async createPlanta(nome) {
		return await prisma$1.planta.create({ data: { nome } });
	}
	async createSetor(nome, plantaId) {
		return await prisma$1.setor.create({ data: {
			nome,
			plantaId
		} });
	}
	async getPlantas() {
		return await prisma$1.planta.findMany({
			where: { isActive: true },
			include: { setores: {
				where: { isActive: true },
				orderBy: { nome: "asc" }
			} },
			orderBy: { nome: "asc" }
		});
	}
	async updatePlanta(id, nome) {
		return await prisma$1.planta.update({
			where: { idplanta: id },
			data: { nome }
		});
	}
	async updateSetor(id, nome) {
		return await prisma$1.setor.update({
			where: { idsetor: id },
			data: { nome }
		});
	}
	async deletePlanta(id) {
		await prisma$1.setor.updateMany({
			where: { plantaId: id },
			data: { isActive: false }
		});
		return await prisma$1.planta.update({
			where: { idplanta: id },
			data: { isActive: false }
		});
	}
	async deleteSetor(id) {
		return await prisma$1.setor.update({
			where: { idsetor: id },
			data: { isActive: false }
		});
	}
};
//#endregion
//#region src/main/ipc/Facility/facilityHandlers.ts
function registerFacilityHandlers() {
	const repository = new FacilityRepository();
	electron.ipcMain.handle("get-plantas", async () => {
		try {
			return {
				success: true,
				data: await repository.getPlantas()
			};
		} catch (error) {
			return {
				success: false,
				error: error.message
			};
		}
	});
	electron.ipcMain.handle("create-planta", async (_, nome) => {
		try {
			return {
				success: true,
				data: await repository.createPlanta(nome)
			};
		} catch (error) {
			return {
				success: false,
				error: error.message
			};
		}
	});
	electron.ipcMain.handle("create-setor", async (_, { nome, plantaId }) => {
		try {
			return {
				success: true,
				data: await repository.createSetor(nome, plantaId)
			};
		} catch (error) {
			return {
				success: false,
				error: error.message
			};
		}
	});
	electron.ipcMain.handle("update-planta", async (_, { id, nome }) => {
		try {
			return {
				success: true,
				data: await repository.updatePlanta(id, nome)
			};
		} catch (error) {
			return {
				success: false,
				error: error.message
			};
		}
	});
	electron.ipcMain.handle("update-setor", async (_, { id, nome }) => {
		try {
			return {
				success: true,
				data: await repository.updateSetor(id, nome)
			};
		} catch (error) {
			return {
				success: false,
				error: error.message
			};
		}
	});
	electron.ipcMain.handle("delete-planta", async (_, id) => {
		try {
			return {
				success: true,
				data: await repository.deletePlanta(id)
			};
		} catch (error) {
			return {
				success: false,
				error: error.message
			};
		}
	});
	electron.ipcMain.handle("delete-setor", async (_, id) => {
		try {
			return {
				success: true,
				data: await repository.deleteSetor(id)
			};
		} catch (error) {
			return {
				success: false,
				error: error.message
			};
		}
	});
}
//#endregion
//#region src/main/repositories/Dashboard/DashboardRepository.ts
var prisma = new _prisma_client.PrismaClient();
var DashboardRepository = class {
	async getGlobalKPIs(filters) {
		try {
			const whereEquipamento = { isActive: true };
			if (filters?.equipamentoId) whereEquipamento.idequipamentos = filters.equipamentoId;
			else if (filters?.setorId) whereEquipamento.setorId = filters.setorId;
			else if (filters?.plantaId) whereEquipamento.setor = { plantaId: filters.plantaId };
			const equipamentos = await prisma.equipamento.findMany({
				where: whereEquipamento,
				select: {
					idequipamentos: true,
					data_instalacao: true
				}
			});
			if (equipamentos.length === 0) return {
				success: true,
				data: {
					mtbf: 0,
					mttr: 0,
					disponibilidade: "0.00",
					totalFalhas: 0,
					equipamentosAtivos: 0
				}
			};
			const eqIds = equipamentos.map((eq) => eq.idequipamentos);
			const falhas = await prisma.falha.findMany({
				where: { equipamento_id: { in: eqIds } },
				select: {
					data_hora_falha: true,
					data_hora_reparo: true
				}
			});
			const agora = /* @__PURE__ */ new Date();
			let tempoTotalHoras = 0;
			equipamentos.forEach((eq) => {
				const instalacao = eq.data_instalacao || agora;
				const diffMs = agora.getTime() - instalacao.getTime();
				tempoTotalHoras += diffMs / (1e3 * 60 * 60);
			});
			let downtimeTotalHoras = 0;
			falhas.forEach((falha) => {
				if (falha.data_hora_reparo && falha.data_hora_falha) {
					const diffMs = falha.data_hora_reparo.getTime() - falha.data_hora_falha.getTime();
					downtimeTotalHoras += diffMs / (1e3 * 60 * 60);
				}
			});
			const totalFalhas = falhas.length;
			const uptimeTotalHoras = Math.max(0, tempoTotalHoras - downtimeTotalHoras);
			const mtbf = totalFalhas > 0 ? uptimeTotalHoras / totalFalhas : uptimeTotalHoras;
			const mttr = totalFalhas > 0 ? downtimeTotalHoras / totalFalhas : 0;
			const disponibilidade = mtbf + mttr > 0 ? mtbf / (mtbf + mttr) * 100 : 100;
			return {
				success: true,
				data: {
					mtbf: Math.round(mtbf),
					mttr: Math.round(mttr),
					disponibilidade: disponibilidade.toFixed(2),
					totalFalhas,
					equipamentosAtivos: equipamentos.length
				}
			};
		} catch (error) {
			console.error("❌ Erro no cálculo de KPIs:", error);
			return {
				success: false,
				error: error.message
			};
		}
	}
	async getParetoData(filters) {
		try {
			const whereEquipamento = { isActive: true };
			if (filters?.equipamentoId) whereEquipamento.idequipamentos = filters.equipamentoId;
			else if (filters?.setorId) whereEquipamento.setorId = filters.setorId;
			else if (filters?.plantaId) whereEquipamento.setor = { plantaId: filters.plantaId };
			const equipamentos = await prisma.equipamento.findMany({
				where: whereEquipamento,
				select: { idequipamentos: true }
			});
			if (equipamentos.length === 0) return {
				success: true,
				data: []
			};
			const targetEquipmentIds = equipamentos.map((eq) => eq.idequipamentos);
			const falhas = await prisma.falha.findMany({
				where: { equipamento_id: { in: targetEquipmentIds } },
				include: { causa_raiz: true }
			});
			const totalFalhas = falhas.length;
			if (totalFalhas === 0) return {
				success: true,
				data: []
			};
			const contagem = {};
			falhas.forEach((f) => {
				const nomeCausa = f.causa_raiz?.nome || "Desconhecida";
				contagem[nomeCausa] = (contagem[nomeCausa] || 0) + 1;
			});
			let dadosPareto = Object.entries(contagem).map(([nome, quantidade]) => ({
				nome,
				quantidade
			})).sort((a, b) => b.quantidade - a.quantidade);
			let someAcumulada = 0;
			dadosPareto = dadosPareto.map((item) => {
				someAcumulada += item.quantidade;
				return {
					...item,
					percentualAcumulado: Number((someAcumulada / totalFalhas * 100).toFixed(1))
				};
			});
			return {
				success: true,
				data: dadosPareto
			};
		} catch (error) {
			return {
				success: false,
				error: error.message
			};
		}
	}
	async findAllPlantas() {
		return {
			success: true,
			data: await prisma.planta.findMany()
		};
	}
	async findSetoresByPlanta(plantaId) {
		return {
			success: true,
			data: await prisma.setor.findMany({ where: { plantaId } })
		};
	}
	async findEquipamentosBySetor(setorId) {
		return {
			success: true,
			data: await prisma.equipamento.findMany({ where: { setorId } })
		};
	}
};
//#endregion
//#region src/main/ipc/Dashboard/dashboardHandlers.ts
function registerDashboardHandlers() {
	const dashboardRepo = new DashboardRepository();
	electron.ipcMain.handle("getGlobalKPIs", async (_event, filters) => {
		return await dashboardRepo.getGlobalKPIs(filters);
	});
	electron.ipcMain.handle("getParetoData", async (_event, filters) => {
		return await dashboardRepo.getParetoData(filters);
	});
	electron.ipcMain.handle("getPlantas", async () => await dashboardRepo.findAllPlantas());
	electron.ipcMain.handle("getSetores", async (_event, plantaId) => await dashboardRepo.findSetoresByPlanta(plantaId));
	electron.ipcMain.handle("getEquipamentos", async (_event, setorId) => await dashboardRepo.findEquipamentosBySetor(setorId));
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
	registerFailureHandlers();
	registerRootCauseHandlers();
	registerPlanHandlers();
	registerEquipmentHasPlanHandlers();
	registerTaskHandlers();
	registerDigitalTwinHandlers();
	registerFacilityHandlers();
	registerDashboardHandlers();
	electron.app.on("activate", function() {
		if (electron.BrowserWindow.getAllWindows().length === 0) createWindow();
	});
});
electron.app.on("window-all-closed", () => {
	if (process.platform !== "darwin") electron.app.quit();
});
//#endregion
