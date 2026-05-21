import React, { useState } from 'react';

export function CreateEquipmentForm() {
  const [formData, setFormData] = useState({
    nome: '',
    tag: '',
    fabricante: '',
    modelo: '',
    setor: '',
    data_instalacao: '',
    idcriticidade: 1, // Assumindo 1 = A, 2 = B, 3 = C (baseado nos nossos seeds)
    idxyz: 1          // Assumindo 1 = X, 2 = Y, 3 = Z
  });

  const [mensagem, setMensagem] = useState({ tipo: '', texto: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: name.includes('id') ? Number(value) : value 
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensagem({ tipo: 'loading', texto: 'Salvando equipamento...' });

    // Prepara os dados para envio (converte a data do HTML input para Date)
    const payload = {
      ...formData,
      data_instalacao: new Date(formData.data_instalacao)
    };

    // Chama a ponte do Electron
    // @ts-ignore - Ignorando tipagem do window.api por enquanto
    const response = await window.api.createEquipment(payload);

    if (response.success) {
      setMensagem({ tipo: 'success', texto: `Equipamento ${response.data.tag} cadastrado com sucesso!` });
      // Limpa o formulário
      setFormData({ ...formData, nome: '', tag: '', fabricante: '', modelo: '', setor: '', data_instalacao: '' });
    } else {
      setMensagem({ tipo: 'error', texto: response.error }); // Vai exibir os erros do UseCase
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <h2>Cadastrar Novo Equipamento</h2>
      
      {mensagem.texto && (
        <div style={{ 
          padding: '10px', 
          marginBottom: '15px', 
          backgroundColor: mensagem.tipo === 'error' ? '#ffebee' : '#e8f5e9',
          color: mensagem.tipo === 'error' ? '#c62828' : '#2e7d32'
        }}>
          {mensagem.texto}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <label>
          Nome do Equipamento:
          <input required type="text" name="nome" value={formData.nome} onChange={handleChange} style={{ width: '100%', padding: '8px' }} />
        </label>

        <label>
          TAG (Identificação Única):
          <input required type="text" name="tag" value={formData.tag} onChange={handleChange} style={{ width: '100%', padding: '8px' }} />
        </label>

        <div style={{ display: 'flex', gap: '15px' }}>
          <label style={{ flex: 1 }}>
            Fabricante:
            <input required type="text" name="fabricante" value={formData.fabricante} onChange={handleChange} style={{ width: '100%', padding: '8px' }} />
          </label>
          <label style={{ flex: 1 }}>
            Modelo:
            <input required type="text" name="modelo" value={formData.modelo} onChange={handleChange} style={{ width: '100%', padding: '8px' }} />
          </label>
        </div>

        <div style={{ display: 'flex', gap: '15px' }}>
          <label style={{ flex: 1 }}>
            Setor/Área:
            <input required type="text" name="setor" value={formData.setor} onChange={handleChange} style={{ width: '100%', padding: '8px' }} />
          </label>
          <label style={{ flex: 1 }}>
            Data de Instalação:
            <input required type="date" name="data_instalacao" value={formData.data_instalacao} onChange={handleChange} style={{ width: '100%', padding: '8px' }} />
          </label>
        </div>

        <div style={{ display: 'flex', gap: '15px' }}>
          <label style={{ flex: 1 }}>
            Criticidade (Curva ABC):
            <select name="idcriticidade" value={formData.idcriticidade} onChange={handleChange} style={{ width: '100%', padding: '8px' }}>
              <option value={1}>Classe A (Alta)</option>
              <option value={2}>Classe B (Média)</option>
              <option value={3}>Classe C (Baixa)</option>
            </select>
          </label>
          <label style={{ flex: 1 }}>
            Previsibilidade (Curva XYZ):
            <select name="idxyz" value={formData.idxyz} onChange={handleChange} style={{ width: '100%', padding: '8px' }}>
              <option value={1}>Classe X (Alta Previsão)</option>
              <option value={2}>Classe Y (Média Previsão)</option>
              <option value={3}>Classe Z (Baixa Previsão)</option>
            </select>
          </label>
        </div>

        <button type="submit" style={{ padding: '10px 15px', backgroundColor: '#0056b3', color: 'white', border: 'none', cursor: 'pointer', marginTop: '10px' }}>
          Salvar Equipamento
        </button>
      </form>
    </div>
  );
}