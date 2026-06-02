export interface DashboardFilters {
  plantaId?: string;
  setorId?: string;
  equipamentoId?: string;
}

export interface IDashboardRepository {
  getGlobalKPIs(filters?: DashboardFilters): Promise<any>;
  getParetoData(filters?: DashboardFilters): Promise<any>;
}