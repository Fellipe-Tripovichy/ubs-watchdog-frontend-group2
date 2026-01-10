using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UBS.Watchdog.Domain.Entities;
using UBS.Watchdog.Domain.Enums;
using UBS.Watchdog.Infrastructure.Repositories;

namespace UBS.Watchdog.Application.Compliance
{
    public class RegraPaisAltoRisco : IRegraCompliance
    {
        private readonly IClienteRepository _clienteRepository;
        private readonly IConfiguration _configuration;
        private readonly ILogger<RegraPaisAltoRisco> _logger;

        public string NomeRegra => "Transferência para País de Alto Risco";

        public RegraPaisAltoRisco(
        IClienteRepository clienteRepository,
        IConfiguration configuration,
        ILogger<RegraPaisAltoRisco> logger)
        {
            _clienteRepository = clienteRepository;
            _configuration = configuration;
            _logger = logger;
        }

        public async Task<Alerta?> ValidarAsync(Transacao transacao)
        {
            // Só valida se for uma transferência
            if (transacao.Tipo != TipoTransacao.Transferencia)
            {
                _logger.LogDebug("Transação {TransacaoId} não é transferência, pulando regra", transacao.Id);
                return null;
            }
            
            // Buscar lista de países de alto risco do appsettings.json
            var paisesAltoRisco = _configuration
                .GetSection("Compliance:PaisesAltoRisco")
                .Get<List<string>>() ?? new List<string>();

            _logger.LogInformation(
                "Validando transferência para possível país de alto risco. Contraparte: {Contraparte}",
                transacao.Contraparte);

            // Verificar se a contraparte contém algum país de alto risco
            if (!string.IsNullOrEmpty(transacao.Contraparte))
            {
                foreach (var pais in paisesAltoRisco)
                {
                    if (transacao.Contraparte.Contains(pais, StringComparison.OrdinalIgnoreCase))
                    {
                        _logger.LogWarning(
                            "Transferência para país de alto risco detectada! Cliente {ClienteId} -> {Pais}",
                            transacao.ClienteId,
                            pais);

                        // Buscar dados do cliente para enriquecer o alerta
                        var cliente = await _clienteRepository.GetByIdAsync(transacao.ClienteId);

                        var alerta = new Alerta(
                            clienteId: transacao.ClienteId,
                            transacaoId: transacao.Id,
                            nomeRegra: NomeRegra,
                            descricao: $"Transferência de {transacao.Valor:C} para '{transacao.Contraparte}' " +
                                       $"(país de alto risco: {pais}). Cliente: {cliente?.Nome ?? "N/A"}",
                            severidade: SeveridadeAlerta.Critica
                        );

                        return alerta;
                    }
                }
            }

            _logger.LogInformation("País ok para transação {TransacaoId}", transacao.Id);
            return null;
        }
    }
}

