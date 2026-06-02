import { Handle, Position } from '@xyflow/react';

export const UniversalHandles = () => (
  <>
    <Handle type="target" position={Position.Top} id="t-top" style={{ background: '#34495e' }} />
    <Handle type="source" position={Position.Right} id="s-right" style={{ background: '#34495e' }} />
    <Handle type="source" position={Position.Bottom} id="s-bottom" style={{ background: '#34495e' }} />
    <Handle type="target" position={Position.Left} id="t-left" style={{ background: '#34495e' }} />
  </>
);

export const Label = ({ text }: { text: string }) => (
  <div style={{ fontSize: 10, marginTop: 4, fontWeight: 'bold', background: 'rgba(255,255,255,0.9)', padding: '2px 4px', borderRadius: '4px', textAlign: 'center', maxWidth: '80px' }}>
    {text}
  </div>
);