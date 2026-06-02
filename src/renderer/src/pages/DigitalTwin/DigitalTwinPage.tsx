import React, { useState, useCallback, useRef, useEffect } from "react";
import {
  ReactFlow,
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  Connection,
  Edge,
  Node,
} from "@xyflow/react";

// Importação dos subcomponentes (A sua "Orquestra")
import { nodeTypes } from "./components/ISANodes";
import { Sidebar } from "./components/Sidebar";
import { PropertiesModal } from "./components/PropertiesModal";

import "@xyflow/react/dist/style.css";

export function DigitalTwinPage() {
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);

  // Estados de Negócio
  const [equipamentos, setEquipamentos] = useState<any[]>([]);
  const [plantas, setPlantas] = useState<any[]>([]);
  const [setoresDaPlanta, setSetoresDaPlanta] = useState<any[]>([]);
  const [plantaSelecionadaId, setPlantaSelecionadaId] = useState("");
  const [setorSelecionadoId, setSetorSelecionadoId] = useState("");

  // Estado do Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [nodeEditando, setNodeEditando] = useState<Node | null>(null);
  const [equipamentoSelecionadoId, setEquipamentoSelecionadoId] = useState("");

  // Carregamento Inicial
  useEffect(() => {
    const carregarDados = async () => {
      // @ts-ignore
      const resEq = await window.api.getEquipments();
      if (resEq?.success) setEquipamentos(resEq.data);
      // @ts-ignore
      const resPl = await window.api.getPlantas();
      if (resPl?.success) setPlantas(resPl.data);
    };
    carregarDados();
  }, []);

  // Seleção de Setor
  useEffect(() => {
    const planta = plantas.find((p) => p.idplanta === plantaSelecionadaId);
    setSetoresDaPlanta(planta ? planta.setores : []);
    setSetorSelecionadoId("");
  }, [plantaSelecionadaId, plantas]);

  // Carregar Layout do Gêmeo
  useEffect(() => {
    if (!setorSelecionadoId) {
      setNodes([]);
      setEdges([]);
      return;
    }

    const carregarLayout = async () => {
      // @ts-ignore
      const res = await window.api.getDigitalTwin(setorSelecionadoId);
      if (res?.success) {
        const { blocks, connections } = res.data;
        setNodes(
          blocks.map((b: any) => ({
            id: b.id_bloco,
            type: b.tipo_bloco,
            position: { x: b.posicao_x, y: b.posicao_y },
            data: {
              label: b.equipamento ? b.equipamento.tag : b.tipo_bloco,
              equipamentoId: b.equipamentoId,
            },
          })),
        );
        setEdges(
          connections.map((c: any) => ({
            id: c.id_conexao,
            source: c.blocoOrigemId,
            target: c.blocoDestinoId,
            type: "smoothstep",
          })),
        );
      }
    };
    carregarLayout();
  }, [setorSelecionadoId]);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      if (!setorSelecionadoId) {
        alert("Selecione um Setor!");
        return;
      }

      const type = event.dataTransfer.getData("application/reactflow/type");
      const label = event.dataTransfer.getData("application/reactflow/label");
      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      setNodes((nds) =>
        nds.concat({
          id: crypto.randomUUID(),
          type,
          position,
          data: { label },
        }),
      );
    },
    [reactFlowInstance, setorSelecionadoId],
  );

  const onNodeDoubleClick = useCallback((_: any, node: Node) => {
    setNodeEditando(node);
    setEquipamentoSelecionadoId((node.data.equipamentoId as string) || "");
    setIsModalOpen(true);
  }, []);

  const handleSalvarPropriedades = () => {
    setNodes((nds) =>
      nds.map((n) =>
        n.id === nodeEditando?.id
          ? {
              ...n,
              data: { ...n.data, equipamentoId: equipamentoSelecionadoId },
            }
          : n,
      ),
    );
    setIsModalOpen(false);
  };

  const handleSaveLayout = async () => {
    // @ts-ignore
    const blocksToSave = nodes.map((node) => ({
      id_bloco: node.id,
      tipo_bloco: node.type || "default",
      posicao_x: node.position.x,
      posicao_y: node.position.y,
      equipamentoId: node.data?.equipamentoId || null,
    }));

    const connectionsToSave = edges.map((edge) => ({
      id_conexao: edge.id,
      blocoOrigemId: edge.source,
      blocoDestinoId: edge.target,
    }));

    // @ts-ignore
    await window.api.saveDigitalTwin({
      setorId: setorSelecionadoId,
      blocks: blocksToSave,
      connections: connectionsToSave,
    });
    alert("💾 Layout salvo!");
  };

  const onConnect = useCallback(
    (params: Connection | Edge) => {
      const newEdge = { 
        ...params, 
        type: "smoothstep",
        data: { tipo_ligacao: "SERIE" } };
      setEdges((eds) => addEdge(newEdge, eds));
    },
    [setEdges],
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      {/* Header/Toolbar */}
      <div
        style={{
          padding: "15px",
          background: "#fff",
          borderBottom: "1px solid #eee",
        }}
      >
        <select onChange={(e) => setPlantaSelecionadaId(e.target.value)}>
          <option value="">Planta</option>
          {plantas.map((p) => (
            <option key={p.idplanta} value={p.idplanta}>
              {p.nome}
            </option>
          ))}
        </select>
        <select onChange={(e) => setSetorSelecionadoId(e.target.value)}>
          <option value="">Setor</option>
          {setoresDaPlanta.map((s) => (
            <option key={s.idsetor} value={s.idsetor}>
              {s.nome}
            </option>
          ))}
        </select>
        <button onClick={handleSaveLayout}>Salvar</button>
      </div>

      {/* Container Principal */}
      <div style={{ display: "flex", flexGrow: 1, height: "100%" }}>
        <Sidebar />

        {/* Container do ReactFlow com altura definida */}
        <div
          style={{ flexGrow: 1, height: "100%", position: "relative" }}
          ref={reactFlowWrapper}
        >
          <ReactFlowProvider>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              nodeTypes={nodeTypes}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onInit={setReactFlowInstance}
              onDrop={onDrop}
              onDragOver={(e) => e.preventDefault()}
              onNodeDoubleClick={onNodeDoubleClick}
              deleteKeyCode={["Delete", "Backspace"]}
              onNodesDelete={(nodes) => console.log("Nodes deletados:", nodes)}
              onEdgesDelete={(edges) => console.log("Edges deletados:", edges)}
              defaultEdgeOptions={{ type: 'smoothstep' }}
              fitView
            >
              <Controls />
              <Background />
            </ReactFlow>
          </ReactFlowProvider>
        </div>
      </div>

      <PropertiesModal
        isOpen={isModalOpen}
        equipamentos={equipamentos}
        equipamentoId={equipamentoSelecionadoId}
        setEquipamentoId={setEquipamentoSelecionadoId}
        onSave={handleSalvarPropriedades}
        onClose={() => setIsModalOpen(false)}
        onDelete={() => setIsModalOpen(false)}
      />
    </div>
  );
}
