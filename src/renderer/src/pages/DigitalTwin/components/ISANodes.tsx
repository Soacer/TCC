import { Handle, Position } from '@xyflow/react';

// ==========================================
// COMPONENTE: PONTOS DE CONEXÃO (TUBULAÇÃO)
// ==========================================
const UniversalHandles = () => (
  <>
    <Handle type="target" position={Position.Top} id="t-top" style={{ background: '#34495e' }} />
    <Handle type="source" position={Position.Right} id="s-right" style={{ background: '#34495e' }} />
    <Handle type="source" position={Position.Bottom} id="s-bottom" style={{ background: '#34495e' }} />
    <Handle type="target" position={Position.Left} id="t-left" style={{ background: '#34495e' }} />
  </>
);

const Label = ({ text }: { text: string }) => (
  <div style={{ fontSize: 10, marginTop: 4, fontWeight: 'bold', background: 'rgba(255,255,255,0.9)', padding: '2px 4px', borderRadius: '4px', textAlign: 'center', maxWidth: '80px' }}>{text}</div>
);

// ==========================================
// COMPONENTES SVG: SÍMBOLOS ISA 5.1 E P&ID
// ==========================================
const PumpNode = ({ data }: any) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
    <UniversalHandles />
    <svg width="50" height="50" viewBox="0 0 50 50">
      <circle cx="25" cy="25" r="22" fill="white" stroke="#2c3e50" strokeWidth="2" />
      <polygon points="12,35 38,35 25,12" fill="none" stroke="#2c3e50" strokeWidth="2" />
    </svg>
    <Label text={data.label} />
  </div>
);

const CompressorNode = ({ data }: any) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
    <UniversalHandles />
    <svg width="50" height="50" viewBox="0 0 50 50">
      <polygon points="10,10 40,20 40,30 10,40" fill="white" stroke="#2c3e50" strokeWidth="2" />
    </svg>
    <Label text={data.label} />
  </div>
);

const TankNode = ({ data }: any) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
    <UniversalHandles />
    <svg width="50" height="60" viewBox="0 0 50 60">
      <path d="M 5 10 C 5 0, 45 0, 45 10 L 45 50 C 45 60, 5 60, 5 50 Z" fill="white" stroke="#2c3e50" strokeWidth="2" />
      <path d="M 5 10 C 5 20, 45 20, 45 10" fill="none" stroke="#2c3e50" strokeWidth="2" />
    </svg>
    <Label text={data.label} />
  </div>
);

const HeatExchangerNode = ({ data }: any) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
    <UniversalHandles />
    <svg width="50" height="50" viewBox="0 0 50 50">
      <circle cx="25" cy="25" r="22" fill="white" stroke="#2c3e50" strokeWidth="2" />
      <polyline points="8,25 18,15 32,35 42,25" fill="none" stroke="#2c3e50" strokeWidth="2" />
    </svg>
    <Label text={data.label} />
  </div>
);

const ValveNode = ({ data }: any) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
    <UniversalHandles />
    <svg width="50" height="30" viewBox="0 0 50 30">
      <polygon points="5,5 5,25 45,5 45,25" fill="white" stroke="#2c3e50" strokeWidth="2" />
    </svg>
    <Label text={data.label} />
  </div>
);

const ControlValveNode = ({ data }: any) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
    <UniversalHandles />
    <svg width="50" height="50" viewBox="0 0 50 50">
      <polygon points="10,25 10,45 40,25 40,45" fill="white" stroke="#2c3e50" strokeWidth="2" />
      <line x1="25" y1="35" x2="25" y2="15" stroke="#2c3e50" strokeWidth="2" />
      <path d="M 10 15 Q 25 0 40 15 Z" fill="white" stroke="#2c3e50" strokeWidth="2" />
      <line x1="10" y1="15" x2="40" y2="15" stroke="#2c3e50" strokeWidth="2" />
    </svg>
    <Label text={data.label} />
  </div>
);

const MotorNode = ({ data }: any) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
    <UniversalHandles />
    <svg width="40" height="40" viewBox="0 0 40 40">
      <circle cx="20" cy="20" r="18" fill="white" stroke="#2c3e50" strokeWidth="2" />
      <text x="20" y="26" fontSize="16" fontWeight="bold" textAnchor="middle" fill="#2c3e50">M</text>
    </svg>
    <Label text={data.label} />
  </div>
);

const InstrumentNode = ({ data }: any) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
    <UniversalHandles />
    <svg width="40" height="40" viewBox="0 0 40 40">
      <circle cx="20" cy="20" r="18" fill="white" stroke="#2c3e50" strokeWidth="2" />
      <line x1="2" y1="20" x2="38" y2="20" stroke="#2c3e50" strokeWidth="2" />
    </svg>
    <Label text={data.label} />
  </div>
);

const DCSNode = ({ data }: any) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
    <UniversalHandles />
    <svg width="40" height="40" viewBox="0 0 40 40">
      <rect x="2" y="2" width="36" height="36" fill="white" stroke="#2c3e50" strokeWidth="2" />
      <circle cx="20" cy="20" r="14" fill="none" stroke="#2c3e50" strokeWidth="2" />
      <line x1="2" y1="20" x2="38" y2="20" stroke="#2c3e50" strokeWidth="2" />
    </svg>
    <Label text={data.label} />
  </div>
);

const PLCNode = ({ data }: any) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
    <UniversalHandles />
    <svg width="40" height="40" viewBox="0 0 40 40">
      <polygon points="20,2 38,10 38,30 20,38 2,30 2,10" fill="white" stroke="#2c3e50" strokeWidth="2" />
      <line x1="2" y1="20" x2="38" y2="20" stroke="#2c3e50" strokeWidth="2" />
    </svg>
    <Label text={data.label} />
  </div>
);

// 🟢 EXPORTAMOS O OBJETO PARA O MAESTRO LER
export const nodeTypes = {
  bomba: PumpNode,
  compressor: CompressorNode,
  tanque: TankNode,
  permutador: HeatExchangerNode,
  valvula: ValveNode,
  valvula_controle: ControlValveNode,
  motor: MotorNode,
  instrumento: InstrumentNode,
  dcs: DCSNode,
  clp: PLCNode
};