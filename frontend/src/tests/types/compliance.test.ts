import type {
  Alert,
  Severidade,
  Status,
  GetAlertsParams,
  GetAlertByIdParams,
  GetClientAlertsParams,
  GetAlertsByStatusParams,
  StartAnalysisParams,
  ResolveAlertParams,
  ComplianceState,
} from '@/types/compliance';

const VALID_SEVERIDADES: Severidade[] = ['Baixa', 'Media', 'Alta', 'Critica'];
const VALID_STATUSES: Status[] = ['Novo', 'EmAnalise', 'Resolvido'];

function isValidSeveridade(value: unknown): value is Severidade {
  return typeof value === 'string' && VALID_SEVERIDADES.includes(value as Severidade);
}

function isValidStatus(value: unknown): value is Status {
  return typeof value === 'string' && VALID_STATUSES.includes(value as Status);
}

function isValidAlert(obj: unknown): obj is Alert {
  if (typeof obj !== 'object' || obj === null) return false;
  const alert = obj as Record<string, unknown>;
  return (
    typeof alert.id === 'string' &&
    typeof alert.clienteId === 'string' &&
    typeof alert.transacaoId === 'string' &&
    typeof alert.nomeRegra === 'string' &&
    typeof alert.descricao === 'string' &&
    isValidSeveridade(alert.severidade) &&
    isValidStatus(alert.status) &&
    typeof alert.dataCriacao === 'string' &&
    (alert.dataResolucao === null || typeof alert.dataResolucao === 'string') &&
    (alert.resolvidoPor === null || typeof alert.resolvidoPor === 'string') &&
    (alert.resolucao === null || typeof alert.resolucao === 'string')
  );
}

function isValidGetAlertsParams(obj: unknown): obj is GetAlertsParams {
  if (typeof obj !== 'object' || obj === null) return false;
  const params = obj as Record<string, unknown>;
  return (
    typeof params.token === 'string' &&
    (params.clienteId === undefined || typeof params.clienteId === 'string') &&
    (params.severidade === undefined || isValidSeveridade(params.severidade)) &&
    (params.status === undefined || isValidStatus(params.status)) &&
    (params.dataCriacaoInicio === undefined || typeof params.dataCriacaoInicio === 'string') &&
    (params.dataCriacaoFim === undefined || typeof params.dataCriacaoFim === 'string') &&
    (params.dataResolucao === undefined || typeof params.dataResolucao === 'string')
  );
}

function isValidGetAlertByIdParams(obj: unknown): obj is GetAlertByIdParams {
  if (typeof obj !== 'object' || obj === null) return false;
  const params = obj as Record<string, unknown>;
  return typeof params.alertId === 'string' && typeof params.token === 'string';
}

function isValidGetClientAlertsParams(obj: unknown): obj is GetClientAlertsParams {
  if (typeof obj !== 'object' || obj === null) return false;
  const params = obj as Record<string, unknown>;
  return typeof params.clientId === 'string' && typeof params.token === 'string';
}

function isValidGetAlertsByStatusParams(obj: unknown): obj is GetAlertsByStatusParams {
  if (typeof obj !== 'object' || obj === null) return false;
  const params = obj as Record<string, unknown>;
  return isValidStatus(params.status) && typeof params.token === 'string';
}

function isValidStartAnalysisParams(obj: unknown): obj is StartAnalysisParams {
  if (typeof obj !== 'object' || obj === null) return false;
  const params = obj as Record<string, unknown>;
  return typeof params.alertId === 'string' && typeof params.token === 'string';
}

function isValidResolveAlertParams(obj: unknown): obj is ResolveAlertParams {
  if (typeof obj !== 'object' || obj === null) return false;
  const params = obj as Record<string, unknown>;
  return (
    typeof params.alertId === 'string' &&
    typeof params.resolvidoPor === 'string' &&
    typeof params.resolucao === 'string' &&
    typeof params.token === 'string'
  );
}

function isValidComplianceState(obj: unknown): obj is ComplianceState {
  if (typeof obj !== 'object' || obj === null) return false;
  const state = obj as Record<string, unknown>;
  return (
    Array.isArray(state.alerts) &&
    state.alerts.every(isValidAlert) &&
    (state.currentAlert === null || isValidAlert(state.currentAlert)) &&
    Array.isArray(state.clientAlerts) &&
    state.clientAlerts.every(isValidAlert) &&
    Array.isArray(state.statusAlerts) &&
    state.statusAlerts.every(isValidAlert) &&
    typeof state.loading === 'boolean' &&
    typeof state.loadingAll === 'boolean' &&
    typeof state.loadingClient === 'boolean' &&
    typeof state.loadingStatus === 'boolean' &&
    typeof state.loadingCurrent === 'boolean' &&
    typeof state.updating === 'boolean' &&
    (state.error === null || typeof state.error === 'string')
  );
}

describe('compliance types', () => {
  describe('Severidade type', () => {
    it('should accept valid severidade values', () => {
      VALID_SEVERIDADES.forEach((severidade) => {
        expect(isValidSeveridade(severidade)).toBe(true);
      });
    });

    it('should reject invalid severidade values', () => {
      const invalidValues = ['baixa', 'MEDIA', 'Alto', 'Crítico', '', 123, null, undefined];
      invalidValues.forEach((value) => {
        expect(isValidSeveridade(value)).toBe(false);
      });
    });
  });

  describe('Status type', () => {
    it('should accept valid status values', () => {
      VALID_STATUSES.forEach((status) => {
        expect(isValidStatus(status)).toBe(true);
      });
    });

    it('should reject invalid status values', () => {
      const invalidValues = ['novo', 'EM_ANALISE', 'Resolvido!', '', 123, null, undefined];
      invalidValues.forEach((value) => {
        expect(isValidStatus(value)).toBe(false);
      });
    });
  });

  describe('Alert interface', () => {
    const validAlert: Alert = {
      id: 'alert-1',
      clienteId: 'client-1',
      transacaoId: 'trans-1',
      nomeRegra: 'Rule Name',
      descricao: 'Alert description',
      severidade: 'Alta',
      status: 'Novo',
      dataCriacao: '2025-01-01T00:00:00Z',
      dataResolucao: null,
      resolvidoPor: null,
      resolucao: null,
    };

    it('should accept valid Alert object', () => {
      expect(isValidAlert(validAlert)).toBe(true);
    });

    it('should accept Alert with resolved fields', () => {
      const resolvedAlert: Alert = {
        ...validAlert,
        dataResolucao: '2025-01-02T00:00:00Z',
        resolvidoPor: 'user-1',
        resolucao: 'Resolved',
        status: 'Resolvido',
      };
      expect(isValidAlert(resolvedAlert)).toBe(true);
    });

    it('should reject Alert with missing required fields', () => {
      const invalidAlerts = [
        { ...validAlert, id: undefined },
        { ...validAlert, clienteId: undefined },
        { ...validAlert, transacaoId: undefined },
        { ...validAlert, nomeRegra: undefined },
        { ...validAlert, descricao: undefined },
        { ...validAlert, severidade: undefined },
        { ...validAlert, status: undefined },
        { ...validAlert, dataCriacao: undefined },
      ];
      invalidAlerts.forEach((alert) => {
        expect(isValidAlert(alert)).toBe(false);
      });
    });

    it('should reject Alert with invalid severidade', () => {
      const invalidAlert = { ...validAlert, severidade: 'Invalid' as Severidade };
      expect(isValidAlert(invalidAlert)).toBe(false);
    });

    it('should reject Alert with invalid status', () => {
      const invalidAlert = { ...validAlert, status: 'Invalid' as Status };
      expect(isValidAlert(invalidAlert)).toBe(false);
    });

    it('should reject Alert with invalid dataResolucao type', () => {
      const invalidAlert = { ...validAlert, dataResolucao: 123 };
      expect(isValidAlert(invalidAlert)).toBe(false);
    });

    it('should reject Alert with invalid resolvidoPor type', () => {
      const invalidAlert = { ...validAlert, resolvidoPor: 123 };
      expect(isValidAlert(invalidAlert)).toBe(false);
    });

    it('should reject Alert with invalid resolucao type', () => {
      const invalidAlert = { ...validAlert, resolucao: 123 };
      expect(isValidAlert(invalidAlert)).toBe(false);
    });

    it('should reject non-object values', () => {
      const invalidValues = [null, undefined, 'string', 123, [], true];
      invalidValues.forEach((value) => {
        expect(isValidAlert(value)).toBe(false);
      });
    });
  });

  describe('GetAlertsParams interface', () => {
    const validParams: GetAlertsParams = {
      token: 'token-123',
    };

    it('should accept valid GetAlertsParams with only required fields', () => {
      expect(isValidGetAlertsParams(validParams)).toBe(true);
    });

    it('should accept GetAlertsParams with all optional fields', () => {
      const fullParams: GetAlertsParams = {
        token: 'token-123',
        clienteId: 'client-1',
        severidade: 'Alta',
        status: 'Novo',
        dataCriacaoInicio: '2025-01-01',
        dataCriacaoFim: '2025-01-31',
        dataResolucao: '2025-01-15',
      };
      expect(isValidGetAlertsParams(fullParams)).toBe(true);
    });

    it('should reject GetAlertsParams with missing token', () => {
      const invalidParams = { ...validParams, token: undefined };
      expect(isValidGetAlertsParams(invalidParams)).toBe(false);
    });

    it('should reject GetAlertsParams with invalid severidade', () => {
      const invalidParams = { ...validParams, severidade: 'Invalid' as Severidade };
      expect(isValidGetAlertsParams(invalidParams)).toBe(false);
    });

    it('should reject GetAlertsParams with invalid status', () => {
      const invalidParams = { ...validParams, status: 'Invalid' as Status };
      expect(isValidGetAlertsParams(invalidParams)).toBe(false);
    });

    it('should reject non-object values', () => {
      const invalidValues = [null, undefined, 'string', 123, [], true];
      invalidValues.forEach((value) => {
        expect(isValidGetAlertsParams(value)).toBe(false);
      });
    });
  });

  describe('GetAlertByIdParams interface', () => {
    const validParams: GetAlertByIdParams = {
      alertId: 'alert-1',
      token: 'token-123',
    };

    it('should accept valid GetAlertByIdParams', () => {
      expect(isValidGetAlertByIdParams(validParams)).toBe(true);
    });

    it('should reject GetAlertByIdParams with missing alertId', () => {
      const invalidParams = { ...validParams, alertId: undefined };
      expect(isValidGetAlertByIdParams(invalidParams)).toBe(false);
    });

    it('should reject GetAlertByIdParams with missing token', () => {
      const invalidParams = { ...validParams, token: undefined };
      expect(isValidGetAlertByIdParams(invalidParams)).toBe(false);
    });

    it('should reject non-object values', () => {
      const invalidValues = [null, undefined, 'string', 123, [], true];
      invalidValues.forEach((value) => {
        expect(isValidGetAlertByIdParams(value)).toBe(false);
      });
    });
  });

  describe('GetClientAlertsParams interface', () => {
    const validParams: GetClientAlertsParams = {
      clientId: 'client-1',
      token: 'token-123',
    };

    it('should accept valid GetClientAlertsParams', () => {
      expect(isValidGetClientAlertsParams(validParams)).toBe(true);
    });

    it('should reject GetClientAlertsParams with missing clientId', () => {
      const invalidParams = { ...validParams, clientId: undefined };
      expect(isValidGetClientAlertsParams(invalidParams)).toBe(false);
    });

    it('should reject GetClientAlertsParams with missing token', () => {
      const invalidParams = { ...validParams, token: undefined };
      expect(isValidGetClientAlertsParams(invalidParams)).toBe(false);
    });

    it('should reject non-object values', () => {
      const invalidValues = [null, undefined, 'string', 123, [], true];
      invalidValues.forEach((value) => {
        expect(isValidGetClientAlertsParams(value)).toBe(false);
      });
    });
  });

  describe('GetAlertsByStatusParams interface', () => {
    it('should accept valid GetAlertsByStatusParams with all status values', () => {
      VALID_STATUSES.forEach((status) => {
        const params: GetAlertsByStatusParams = {
          status,
          token: 'token-123',
        };
        expect(isValidGetAlertsByStatusParams(params)).toBe(true);
      });
    });

    it('should reject GetAlertsByStatusParams with invalid status', () => {
      const invalidParams = {
        status: 'Invalid' as Status,
        token: 'token-123',
      };
      expect(isValidGetAlertsByStatusParams(invalidParams)).toBe(false);
    });

    it('should reject GetAlertsByStatusParams with missing token', () => {
      const invalidParams = {
        status: 'Novo' as Status,
        token: undefined,
      };
      expect(isValidGetAlertsByStatusParams(invalidParams)).toBe(false);
    });

    it('should reject non-object values', () => {
      const invalidValues = [null, undefined, 'string', 123, [], true];
      invalidValues.forEach((value) => {
        expect(isValidGetAlertsByStatusParams(value)).toBe(false);
      });
    });
  });

  describe('StartAnalysisParams interface', () => {
    const validParams: StartAnalysisParams = {
      alertId: 'alert-1',
      token: 'token-123',
    };

    it('should accept valid StartAnalysisParams', () => {
      expect(isValidStartAnalysisParams(validParams)).toBe(true);
    });

    it('should reject StartAnalysisParams with missing alertId', () => {
      const invalidParams = { ...validParams, alertId: undefined };
      expect(isValidStartAnalysisParams(invalidParams)).toBe(false);
    });

    it('should reject StartAnalysisParams with missing token', () => {
      const invalidParams = { ...validParams, token: undefined };
      expect(isValidStartAnalysisParams(invalidParams)).toBe(false);
    });

    it('should reject non-object values', () => {
      const invalidValues = [null, undefined, 'string', 123, [], true];
      invalidValues.forEach((value) => {
        expect(isValidStartAnalysisParams(value)).toBe(false);
      });
    });
  });

  describe('ResolveAlertParams interface', () => {
    const validParams: ResolveAlertParams = {
      alertId: 'alert-1',
      resolvidoPor: 'user-1',
      resolucao: 'Resolved',
      token: 'token-123',
    };

    it('should accept valid ResolveAlertParams', () => {
      expect(isValidResolveAlertParams(validParams)).toBe(true);
    });

    it('should reject ResolveAlertParams with missing alertId', () => {
      const invalidParams = { ...validParams, alertId: undefined };
      expect(isValidResolveAlertParams(invalidParams)).toBe(false);
    });

    it('should reject ResolveAlertParams with missing resolvidoPor', () => {
      const invalidParams = { ...validParams, resolvidoPor: undefined };
      expect(isValidResolveAlertParams(invalidParams)).toBe(false);
    });

    it('should reject ResolveAlertParams with missing resolucao', () => {
      const invalidParams = { ...validParams, resolucao: undefined };
      expect(isValidResolveAlertParams(invalidParams)).toBe(false);
    });

    it('should reject ResolveAlertParams with missing token', () => {
      const invalidParams = { ...validParams, token: undefined };
      expect(isValidResolveAlertParams(invalidParams)).toBe(false);
    });

    it('should reject non-object values', () => {
      const invalidValues = [null, undefined, 'string', 123, [], true];
      invalidValues.forEach((value) => {
        expect(isValidResolveAlertParams(value)).toBe(false);
      });
    });
  });

  describe('ComplianceState interface', () => {
    const validAlert: Alert = {
      id: 'alert-1',
      clienteId: 'client-1',
      transacaoId: 'trans-1',
      nomeRegra: 'Rule Name',
      descricao: 'Alert description',
      severidade: 'Alta',
      status: 'Novo',
      dataCriacao: '2025-01-01T00:00:00Z',
      dataResolucao: null,
      resolvidoPor: null,
      resolucao: null,
    };

    const validState: ComplianceState = {
      alerts: [validAlert],
      currentAlert: null,
      clientAlerts: [],
      statusAlerts: [],
      loading: false,
      loadingAll: false,
      loadingClient: false,
      loadingStatus: false,
      loadingCurrent: false,
      updating: false,
      error: null,
    };

    it('should accept valid ComplianceState', () => {
      expect(isValidComplianceState(validState)).toBe(true);
    });

    it('should accept ComplianceState with currentAlert', () => {
      const stateWithCurrent: ComplianceState = {
        ...validState,
        currentAlert: validAlert,
      };
      expect(isValidComplianceState(stateWithCurrent)).toBe(true);
    });

    it('should accept ComplianceState with error message', () => {
      const stateWithError: ComplianceState = {
        ...validState,
        error: 'Error message',
      };
      expect(isValidComplianceState(stateWithError)).toBe(true);
    });

    it('should accept ComplianceState with multiple alerts', () => {
      const stateWithAlerts: ComplianceState = {
        ...validState,
        alerts: [validAlert, { ...validAlert, id: 'alert-2' }],
        clientAlerts: [validAlert],
        statusAlerts: [validAlert],
      };
      expect(isValidComplianceState(stateWithAlerts)).toBe(true);
    });

    it('should reject ComplianceState with invalid alerts array', () => {
      const invalidState = {
        ...validState,
        alerts: [{ ...validAlert, id: undefined }],
      };
      expect(isValidComplianceState(invalidState)).toBe(false);
    });

    it('should reject ComplianceState with invalid currentAlert', () => {
      const invalidState = {
        ...validState,
        currentAlert: { ...validAlert, id: undefined } as Alert,
      };
      expect(isValidComplianceState(invalidState)).toBe(false);
    });

    it('should reject ComplianceState with invalid loading flags', () => {
      const invalidStates = [
        { ...validState, loading: 'true' },
        { ...validState, loadingAll: 'true' },
        { ...validState, loadingClient: 'true' },
        { ...validState, loadingStatus: 'true' },
        { ...validState, loadingCurrent: 'true' },
        { ...validState, updating: 'true' },
      ];
      invalidStates.forEach((state) => {
        expect(isValidComplianceState(state)).toBe(false);
      });
    });

    it('should reject ComplianceState with invalid error type', () => {
      const invalidState = {
        ...validState,
        error: 123,
      };
      expect(isValidComplianceState(invalidState)).toBe(false);
    });

    it('should reject non-object values', () => {
      const invalidValues = [null, undefined, 'string', 123, [], true];
      invalidValues.forEach((value) => {
        expect(isValidComplianceState(value)).toBe(false);
      });
    });
  });
});
