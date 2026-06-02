export type CreatePlanDTO = {
  tipo_manutencao: string;
  periocidade_dias: number;
  tarefas: {
    ordem: number;
    tarefa: string;
    tempo_execucao?: number | null;
    descricao?: string | null;
  }[];
};