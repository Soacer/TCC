import React from 'react';

export const Sidebar = () => {
  const onDragStart = (event: React.DragEvent, nodeType: string, label: string) => {
    event.dataTransfer.setData('application/reactflow/type', nodeType);
    event.dataTransfer.setData('application/reactflow/label', label);
    event.dataTransfer.effectAllowed = 'move';
  };

  // Componente auxiliar para não repetir código
  const ToolItem = ({ type, label, icon }: { type: string, label: string, icon: string }) => (
    <div 
      onDragStart={(event) => onDragStart(event, type, label)} 
      draggable 
      style={{ 
        padding: '10px', 
        border: '1px solid #bdc3c7', 
        marginBottom: '8px', 
        cursor: 'grab', 
        background: 'white', 
        borderRadius: '4px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        fontSize: '14px'
      }}
    >
      <span>{icon}</span> {label}
    </div>
  );

  return (
    <aside style={{ width: '250px', borderRight: '1px solid #eee', padding: '15px', background: '#f8f9fa' }}>
      <h3 style={{ marginTop: 0 }}>Equipamentos</h3>
      
      <ToolItem type="bomba" label="Bomba" icon="⚙️" />
      <ToolItem type="compressor" label="Compressor" icon="🌪️" />
      <ToolItem type="tanque" label="Tanque" icon="🛢️" />
      <ToolItem type="permutador" label="Permutador" icon="♨️" />
      <ToolItem type="motor" label="Motor" icon="⚡" />
      <ToolItem type="valvula" label="Válvula" icon="🚰" />
      <ToolItem type="valvula_controle" label="V. Controle" icon="🎛️" />
      
      <h3 style={{ marginTop: '20px' }}>Instrumentação</h3>
      <ToolItem type="instrumento" label="Instrumento" icon="⏱️" />
      <ToolItem type="dcs" label="DCS" icon="🖥️" />
      <ToolItem type="clp" label="CLP" icon="🧠" />
    </aside>
  );
};