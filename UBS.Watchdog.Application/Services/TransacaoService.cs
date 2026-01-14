using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UBS.Watchdog.Application.DTOs.Transacao;
using UBS.Watchdog.Application.Mappings;
using UBS.Watchdog.Domain.Entities;
using UBS.Watchdog.Domain.Enums;
using UBS.Watchdog.Domain.ValueObjects;
using UBS.Watchdog.Infrastructure.Repositories;
using UBS.Watchdog.Infrastructure.Repositories.Clientes;
using UBS.Watchdog.Infrastructure.Repositories.Transacoes;

namespace UBS.Watchdog.Application.Services
{

    public interface ITransacaoService
    {
        Task<TransacaoResponse> RegistrarAsync(TransacaoRequest request);
        Task<TransacaoResponse?> ObterPorIdAsync(Guid transacaoId);
        Task<List<TransacaoResponse>> ListarTodasAsync();
        Task<List<TransacaoResponse>> ListarPorClienteIdAsync(
            Guid clienteId,
            DateTime? dataInicio = null,
            DateTime? dataFim = null);
        Task<List<TransacaoResponse>> ListarComFiltrosAsync(
            Guid? clienteId,
            DateTime? dataInicio,
            DateTime? dataFim,
            string? moeda,
            TipoTransacao? tipo);
    }
    public class TransacaoService : ITransacaoService
    {

        private readonly ITransacaoRepository _transacaoRepository;
        private readonly IClienteRepository _clienteRepository;
        private readonly IComplianceService _complianceService;
        private readonly ILogger<TransacaoService> _logger;

        public TransacaoService(
            ITransacaoRepository transacaoRepository,
            IClienteRepository clienteRepository,
            IComplianceService complianceService,
            ILogger<TransacaoService> logger)
        {
            _transacaoRepository = transacaoRepository;
            _clienteRepository = clienteRepository;
            _complianceService = complianceService;
            _logger = logger;
        }

        public async Task<TransacaoResponse> RegistrarAsync(TransacaoRequest request)
        {

            _logger.LogInformation(
                "Registrando transação: Cliente {ClienteId}, Tipo {Tipo}, Valor {Valor}",
                request.ClienteId,
                request.Tipo,
                request.Valor);

            var cliente = await _clienteRepository.GetByIdAsync(request.ClienteId);
            if (cliente == null)
            {
                _logger.LogWarning("Cliente não encontrado: {ClienteId}", request.ClienteId);
                throw new KeyNotFoundException($"Cliente {request.ClienteId} não encontrado");
            }

            Contraparte? contraparte = null;
            if (request.Contraparte != null)
            {
                contraparte = new Contraparte(
                    request.Contraparte.Nome,
                    request.Contraparte.Pais
                );
            }

            var transacao =  Transacao.Criar(
                request.ClienteId,
                request.Tipo,
                request.Valor,
                request.Moeda,
                request.Contraparte?.Nome,
                request.Contraparte?.Pais
            );

            await _transacaoRepository.AddAsync(transacao);

            _logger.LogInformation("Transação registrada: {TransacaoId}", transacao.Id);

            // Executar regras de compliance
            try
            {
                var alertas = await _complianceService.ValidarTransacaoAsync(transacao);

                if (alertas.Any())
                {
                    _logger.LogWarning(
                        "Transação {TransacaoId} gerou {TotalAlertas} alerta(s) de compliance",
                        transacao.Id,
                        alertas.Count);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(
                    ex,
                    "Erro ao validar compliance para transação {TransacaoId}",
                    transacao.Id);
            }

            // Buscar transação completa
            var transacaoCompleta = await _transacaoRepository.GetByIdAsync(transacao.Id);

            return Mappings.TransacaoMappings.toResponse(transacaoCompleta!);
        }

        public async Task<List<TransacaoResponse>> ListarPorClienteIdAsync(Guid clienteId, DateTime? dataInicio = null, DateTime? dataFim = null)
        {
            _logger.LogInformation(
                "Listando transações do cliente {ClienteId}. Período: {DataInicio} a {DataFim}",
                clienteId,
                dataInicio,
                dataFim);

            var cliente = await _clienteRepository.GetByIdAsync(clienteId);

            if (cliente == null)
            {
                _logger.LogWarning($"Cliente não encontrado: {clienteId}");
                throw new Exception("Cliente não encontrado");
            }
            List<Transacao> transacoes;

            if (dataInicio.HasValue && dataFim.HasValue)
            {
                transacoes = await _transacaoRepository.GetByClienteEPeriodoAsync(
                    clienteId,
                    dataInicio.Value,
                    dataFim.Value);
            }
            else
            {
                transacoes = await _transacaoRepository.GetByClienteIdAsync(clienteId);
            }
            return TransacaoMappings.toResponseList(transacoes);
        }

        public async Task<List<TransacaoResponse>> ListarTodasAsync()
        {
            _logger.LogInformation("Listando todas as transações");
            var transacoes = await _transacaoRepository.GetAllAsync();
            return TransacaoMappings.toResponseList(transacoes);
        }

        public async Task<TransacaoResponse?> ObterPorIdAsync(Guid transacaoId)
        {
            var transacao = await _transacaoRepository.GetByIdAsync(transacaoId);
            if (transacao == null)
            {
                _logger.LogWarning($"Transação não encontrada: {transacaoId}");
                return null;
            }

            return TransacaoMappings.toResponse(transacao);
        }

        public async Task<List<TransacaoResponse>> ListarComFiltrosAsync(
            Guid? clienteId,
            DateTime? dataInicio,
            DateTime? dataFim,
            string? moeda,
            TipoTransacao? tipo)
        {
            _logger.LogInformation(
                "Listando transações com filtros: ClienteId={ClienteId}, DataInicio={DataInicio}, DataFim={DataFim}, Moeda={Moeda}, Tipo={Tipo}",
                clienteId,
                dataInicio,
                dataFim,
                moeda,
                tipo);

            var transacoes = await _transacaoRepository.GetComFiltrosAsync(
                clienteId,
                dataInicio,
                dataFim,
                moeda,
                tipo);

            _logger.LogInformation(
                "Total encontrado após filtros: {Total}",
                transacoes.Count);

            return TransacaoMappings.toResponseList(transacoes);
        }
    }
}
