using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UBS.Watchdog.Application.DTOs.Cliente;
using UBS.Watchdog.Domain.Enums;
using UBS.Watchdog.Infrastructure.Repositories;
using UBS.Watchdog.Infrastructure.Repositories.Alertas;
using UBS.Watchdog.Infrastructure.Repositories.Clientes;
using UBS.Watchdog.Infrastructure.Repositories.Transacoes;

namespace UBS.Watchdog.Application.Services
{
    public interface IReportService
    {
        Task<RelatorioClienteResponse> GerarRelatorioClienteAsync(Guid clienteId, DateTime? dataInicio = null, DateTime? dataFim = null);
    }

    public class ReportService : IReportService
    {
        private readonly IClienteRepository _clienteRepository;
        private readonly ITransacaoRepository _transacaoRepository;
        private readonly IAlertaRepository _alertaRepository;
        private readonly ILogger<ReportService> _logger;

        public ReportService(
            IClienteRepository clienteRepository,
            ITransacaoRepository transacaoRepository,
            IAlertaRepository alertaRepository,
            ILogger<ReportService> logger)
        {
            _clienteRepository = clienteRepository;
            _transacaoRepository = transacaoRepository;
            _alertaRepository = alertaRepository;
            _logger = logger;
        }

        public async Task<RelatorioClienteResponse> GerarRelatorioClienteAsync(
            Guid clienteId,
            DateTime? dataInicio = null,
            DateTime? dataFim = null)
        {
            _logger.LogInformation(
                "Gerando relatório para cliente {ClienteId}. Período: {DataInicio} a {DataFim}",
                clienteId,
                dataInicio,
                dataFim);

            var cliente = await _clienteRepository.GetByIdAsync(clienteId);
            if (cliente == null)
            {
                _logger.LogWarning("Cliente não encontrado: {ClienteId}", clienteId);
                throw new KeyNotFoundException($"Cliente {clienteId} não encontrado");
            }

            var transacoes = dataInicio.HasValue && dataFim.HasValue
                ? await _transacaoRepository.GetByClienteEPeriodoAsync(clienteId, dataInicio.Value, dataFim.Value)
                : await _transacaoRepository.GetByClienteIdAsync(clienteId);

            var alertas = await _alertaRepository.GetByClienteIdAsync(clienteId);

            // filtra por periodo
            if (dataInicio.HasValue && dataFim.HasValue)
            {
                alertas = alertas
                    .Where(a => a.DataCriacao >= dataInicio.Value && a.DataCriacao <= dataFim.Value)
                    .ToList();
            }

            // Calcular estatísticas
            var totalTransacoes = transacoes.Count;
            var totalMovimentado = transacoes.Sum(t => t.Valor);
            var mediaTransacao = totalTransacoes > 0 ? totalMovimentado / totalTransacoes : 0;
            var dataUltimaTransacao = transacoes.Any()
                ? transacoes.Max(t => t.DataHora)
                : (DateTime?)null;

            var totalAlertas = alertas.Count;
            var alertasNovos = alertas.Count(a => a.Status == StatusAlerta.Novo);
            var alertasEmAnalise = alertas.Count(a => a.Status == StatusAlerta.EmAnalise);
            var alertasResolvidos = alertas.Count(a => a.Status == StatusAlerta.Resolvido);
            var alertasCriticos = alertas.Count(a => a.Severidade == SeveridadeAlerta.Critica);

            var relatorio = new RelatorioClienteResponse
            {
                ClienteId = cliente.Id,
                NomeCliente = cliente.Nome,
                Pais = cliente.Pais,
                NivelRisco = cliente.NivelRisco.ToString(),
                StatusKyc = cliente.StatusKyc.ToString(),
                DataCriacao = cliente.DataCriacao,

                // Estatísticas de Transações
                TotalTransacoes = totalTransacoes,
                TotalMovimentado = totalMovimentado,
                MediaTransacao = mediaTransacao,
                DataUltimaTransacao = dataUltimaTransacao,

                // Estatísticas de Alertas
                TotalAlertas = totalAlertas,
                AlertasNovos = alertasNovos,
                AlertasEmAnalise = alertasEmAnalise,
                AlertasResolvidos = alertasResolvidos,
                AlertasCriticos = alertasCriticos,

                // Período
                PeriodoInicio = dataInicio,
                PeriodoFim = dataFim
            };

            _logger.LogInformation(
                "Relatório gerado para cliente {ClienteId}: {TotalTransacoes} transações, {TotalAlertas} alertas",
                clienteId,
                totalTransacoes,
                totalAlertas);

            return relatorio;
        }
    }
}
