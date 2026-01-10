using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UBS.Watchdog.Application.DTOs.Alerta;
using UBS.Watchdog.Application.Mappings;
using UBS.Watchdog.Domain.Enums;
using UBS.Watchdog.Infrastructure.Repositories.Alertas;

namespace UBS.Watchdog.Application.Services
{
    public interface IAlertaService
    {
        Task<List<AlertaResponse>> ListarTodosAsync();
        Task<AlertaResponse?> ObterPorIdAsync(Guid id);
        Task<List<AlertaResponse>> ListarPorClienteAsync(Guid clienteId);
        Task<List<AlertaResponse>> ListarPorStatusAsync(StatusAlerta status);
        Task<List<AlertaResponse>> ListarComFiltrosAsync(StatusAlerta? status, SeveridadeAlerta? severidade, Guid? clienteId);
        Task<AlertaResponse> IniciarAnaliseAsync(Guid id);
        Task<AlertaResponse> ResolverAsync(Guid id, ResolverAlertaRequest request);
    }
    public class AlertaService : IAlertaService
    {
        private readonly IAlertaRepository _alertaRepository;
        private readonly ILogger<AlertaService> _logger;

        public AlertaService(IAlertaRepository alertaRepository, ILogger<AlertaService> logger)
        {
            _alertaRepository = alertaRepository;
            _logger = logger;
        }
        public async Task<List<AlertaResponse>> ListarTodosAsync()
        {
            _logger.LogInformation("Listando todos os alertas");

            var alertas = await _alertaRepository.GetAllAsync();

            return AlertaMappings.ToResponseList(alertas);
        }

        public async Task<AlertaResponse?> ObterPorIdAsync(Guid id)
        {
            _logger.LogInformation("Buscando alerta: {AlertaId}", id);

            var alerta = await _alertaRepository.GetByIdAsync(id);

            if (alerta == null)
            {
                _logger.LogWarning("Alerta não encontrado: {AlertaId}", id);
                return null;
            }

            return AlertaMappings.ToResponse(alerta);
        }

        public async Task<List<AlertaResponse>> ListarPorClienteAsync(Guid clienteId)
        {
            _logger.LogInformation("Listando alertas do cliente: {ClienteId}", clienteId);

            var alertas = await _alertaRepository.GetByClienteIdAsync(clienteId);

            return AlertaMappings.ToResponseList(alertas);
        }

        public async Task<List<AlertaResponse>> ListarPorStatusAsync(StatusAlerta status)
        {
            _logger.LogInformation("Listando alertas por status: {Status}", status);

            var alertas = await _alertaRepository.GetByStatusAsync(status);

            return AlertaMappings.ToResponseList(alertas);
        }

        public async Task<List<AlertaResponse>> ListarComFiltrosAsync(
                StatusAlerta? status,
                SeveridadeAlerta? severidade,
                Guid? clienteId)
        {
            _logger.LogInformation(
                "Listando alertas com filtros: Status={Status}, Severidade={Severidade}, ClienteId={ClienteId}",
                status,
                severidade,
                clienteId);

            var alertas = await _alertaRepository.GetByFiltrosAsync(status, severidade, clienteId);

            return AlertaMappings.ToResponseList(alertas);
        }

        public async Task<AlertaResponse> IniciarAnaliseAsync(Guid id)
        {
            _logger.LogInformation("Iniciando análise do alerta: {AlertaId}", id);

            var alerta = await _alertaRepository.GetByIdAsync(id);

            if (alerta == null)
            {
                _logger.LogWarning("Alerta não encontrado: {AlertaId}", id);
                throw new KeyNotFoundException($"Alerta {id} não encontrado");
            }

            // Usar método do domain
            alerta.IniciarAnalise();

            await _alertaRepository.UpdateAsync(alerta);

            _logger.LogInformation("Alerta {AlertaId} movido para Em Análise", id);

            return AlertaMappings.ToResponse(alerta);
        }

        public async Task<AlertaResponse> ResolverAsync(Guid id, ResolverAlertaRequest request)
        {
            _logger.LogInformation("Resolvendo alerta: {AlertaId}", id);

            var alerta = await _alertaRepository.GetByIdAsync(id);

            if (alerta == null)
            {
                _logger.LogWarning("Alerta não encontrado: {AlertaId}", id);
                throw new KeyNotFoundException($"Alerta {id} não encontrado");
            }

            if (string.IsNullOrWhiteSpace(request.ResolvidoPor))
            {
                _logger.LogWarning("Tentativa de resolver alerta sem informar quem resolveu");
                throw new ArgumentException("ResolvidoPor é obrigatório");
            }

            alerta.Resolver(request.ResolvidoPor);

            await _alertaRepository.UpdateAsync(alerta);

            _logger.LogInformation(
                "Alerta {AlertaId} resolvido por {ResolvidoPor}",
                id,
                request.ResolvidoPor);

            return AlertaMappings.ToResponse(alerta); 
        }
    }
}
