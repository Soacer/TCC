export const PropertiesModal = ({ isOpen, node, onSave, onDelete, onClose, equipamentos, equipamentoId, setEquipamentoId }: any) => {
  if (!isOpen) return null;
  return (
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
       <div style={{ background: 'white', padding: '20px', borderRadius: '8px', width: '400px' }}>
          <h3>Vincular Equipamento</h3>
          <select value={equipamentoId} onChange={(e) => setEquipamentoId(e.target.value)}>
            <option value="">-- Nenhum --</option>
            {equipamentos.map((eq: any) => <option key={eq.idequipamentos} value={eq.idequipamentos}>{eq.tag}</option>)}
          </select>
          <button onClick={onDelete}>🗑️ Deletar</button>
          <button onClick={onSave}>Confirmar</button>
       </div>
    </div>
  );
};