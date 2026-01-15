using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UBS.Watchdog.Application.Compliance;
using UBS.Watchdog.Domain.Entities;
using UBS.Watchdog.Infrastructure.Repositories.Alertas;

namespace UBS.Watchdog.Application.Services
{
    public interface IComplianceService
    {
        Task<List<Alerta>> ValidarTransacaoAsync(Transacao transacao);
    }

    public class ComplianceService : IComplianceService
    {
        private readonly IEnumerable<IRegraCompliance> _regras;
        private readonly IAlertaRepository _alertaRepository;
        private readonly ILogger<ComplianceService> _logger;

        public ComplianceService(
            IEnumerable<IRegraCompliance> regras,
            IAlertaRepository alertaRepository,
            ILogger<ComplianceService> logger)
        {
            _regras = regras;
            _alertaRepository = alertaRepository;
            _logger = logger;
        }

        public async Task<List<Alerta>> ValidarTransacaoAsync(Transacao transacao)
        {
            _logger.LogInformation(
                "Iniciando validação de compliance para transação {TransacaoId}. Total de regras: {TotalRegras}",
                transacao.Id,
                _regras.Count());

            var alertasGerados = new List<Alerta>();

            // Executar TODAS as regras de compliance
            foreach (var regra in _regras)
            {
                try
                {
                    _logger.LogDebug("Executando regra: {NomeRegra}", regra.NomeRegra);

                    var alerta = await regra.ValidarAsync(transacao);

                    if (alerta != null)
                    {
                        _logger.LogWarning(
                            "Regra violada: {NomeRegra}. Alerta gerado: {AlertaId}",
                            regra.NomeRegra,
                            alerta.Id);

                        // Salvar alerta no banco
                        await _alertaRepository.AddAsync(alerta);

                        alertasGerados.Add(alerta);
                    }
                    else
                    {
                        _logger.LogDebug("Regra {NomeRegra} passou sem violações", regra.NomeRegra);
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogError(
                        ex,
                        "Erro ao executar regra {NomeRegra} para transação {TransacaoId}",
                        regra.NomeRegra,
                        transacao.Id);

                    // Não quebra o fluxo se uma regra falhar, continua validando as outras
                }
            }

            if (alertasGerados.Any())
            {
                _logger.LogWarning(
                    "Transação {TransacaoId} gerou {TotalAlertas} alerta(s)",
                    transacao.Id,
                    alertasGerados.Count);
            }
            else
            {
                _logger.LogInformation(
                    "Transação {TransacaoId} passou em todas as regras de compliance",
                    transacao.Id);
            }

            return alertasGerados;
        }
    }
}
