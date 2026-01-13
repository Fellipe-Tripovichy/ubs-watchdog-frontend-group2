using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UBS.Watchdog.Domain.Entities;
using UBS.Watchdog.Domain.Enums;
using UBS.Watchdog.Infrastructure.Repositories.Clientes;

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
            if (transacao.Tipo != TipoTransacao.Transferencia)
            {
                _logger.LogDebug("Transação {TransacaoId} não é transferência, pulando regra", transacao.Id);
                return null;
            }

            if (transacao.Contraparte == null)
            {
                _logger.LogWarning("Transferência {TransacaoId} sem contraparte definida", transacao.Id);
                return null;
            }

            var paisesAltoRisco = _configuration
                .GetSection("Compliance:PaisesAltoRisco")
                .Get<List<string>>() ?? new List<string>();

            if (!paisesAltoRisco.Any())
            {
                _logger.LogWarning("Lista de países de alto risco está vazia no appsettings.json");
                return null;
            }

            _logger.LogInformation(
                "Validando transferência para: {ContraparteNome} ({ContrapartePais})",
                transacao.Contraparte.Nome,
                transacao.Contraparte.Pais);

            // Normalizar o país da contraparte para comparação (remover acentos)
            var paisContraparteNormalizado = RemoverAcentos(transacao.Contraparte.Pais.ToLowerInvariant());

            _logger.LogDebug("País da contraparte normalizado: {PaisNormalizado}", paisContraparteNormalizado);

            foreach (var pais in paisesAltoRisco)
            {
                var paisRiscoNormalizado = RemoverAcentos(pais.ToLowerInvariant());

                _logger.LogDebug("Verificando país de risco: '{Pais}' (normalizado: '{PaisNormalizado}')", pais, paisRiscoNormalizado);

                if (paisContraparteNormalizado == paisRiscoNormalizado ||
                    paisContraparteNormalizado.Contains(paisRiscoNormalizado))
                {
                    _logger.LogWarning(
                        "⚠️ Transferência para país de alto risco detectada! Cliente {ClienteId} -> {Pais}",
                        transacao.ClienteId,
                        transacao.Contraparte.Pais);

                    var cliente = await _clienteRepository.GetByIdAsync(transacao.ClienteId);

                    var alerta = Alerta.Criar(
                        clienteId: transacao.ClienteId,
                        transacaoId: transacao.Id,
                        nomeRegra: NomeRegra,
                        descricao: $"Transferência de {transacao.Valor:C} {transacao.Moeda} para '{transacao.Contraparte.Nome}' " +
                                   $"em {transacao.Contraparte.Pais} (país de alto risco). Cliente: {cliente?.Nome ?? "N/A"}",
                        severidade: SeveridadeAlerta.Critica
                    );

                    return alerta;
                }
            }

            _logger.LogInformation("✅ País seguro para transação {TransacaoId}", transacao.Id);
            return null;
        }

        /// <summary>
        /// Remove acentos de uma string para facilitar comparação
        /// </summary>
        private static string RemoverAcentos(string texto)
        {
            if (string.IsNullOrWhiteSpace(texto))
                return texto;

            var textoNormalizado = texto.Normalize(NormalizationForm.FormD);
            var stringBuilder = new StringBuilder();

            foreach (var c in textoNormalizado)
            {
                var categoriaUnicode = CharUnicodeInfo.GetUnicodeCategory(c);
                if (categoriaUnicode != UnicodeCategory.NonSpacingMark)
                {
                    stringBuilder.Append(c);
                }
            }

            return stringBuilder.ToString().Normalize(NormalizationForm.FormC);
        }
    }
}
