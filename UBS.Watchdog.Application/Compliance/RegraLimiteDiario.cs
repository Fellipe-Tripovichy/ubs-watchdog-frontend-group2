using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UBS.Watchdog.Domain.Entities;
using UBS.Watchdog.Domain.Enums;
using UBS.Watchdog.Infrastructure.Repositories.Transações;

namespace UBS.Watchdog.Application.Compliance
{
    public class RegraLimiteDiario : IRegraCompliance
    {
        private readonly ITransacaoRepository _transacaoRepository;
        private readonly IConfiguration _configuration;
        private readonly ILogger<RegraLimiteDiario> _logger;

        public string NomeRegra => "Limite Diário Excedido";

        public RegraLimiteDiario(ITransacaoRepository transacaoRepository,IConfiguration configuration,ILogger<RegraLimiteDiario> logger)
        {
            _transacaoRepository = transacaoRepository;
            _configuration = configuration;
            _logger = logger;
        }

        public async Task<Alerta?> ValidarAsync(Transacao transacao)
        {
            // Lê seção Compliance
            var compliance = _configuration.GetSection("Compliance");

            // Limite diário com fallback padrão
            var limiteDiario = compliance.GetValue<decimal>("LimiteDiario", 50000m);

            _logger.LogInformation(
                "Validando limite diário para cliente {ClienteId}. Limite configurado: {Limite}",
                transacao.ClienteId,
                limiteDiario);

            // Soma das transações do dia (NO BANCO)
            var somaDia = await _transacaoRepository.GetSomaDiariaAsync(
                transacao.ClienteId,
                transacao.DataHora.Date);

            // inclui a transação atual, se GetSomaDiariaAsync não incluir
            var somaConsiderandoAtual = somaDia + transacao.Valor;

            _logger.LogInformation(
                "Total movimentado hoje pelo cliente {ClienteId}: {SomaDia} (incluindo atual: {SomaComAtual})",
                transacao.ClienteId,
                somaDia,
                somaConsiderandoAtual);

            // Regra — excedeu limite
            if (somaConsiderandoAtual > limiteDiario)
            {
                _logger.LogWarning(
                    "Limite diário excedido! Cliente {ClienteId}: {Soma} > {Limite}",
                    transacao.ClienteId,
                    somaConsiderandoAtual,
                    limiteDiario);

                var alerta = new Alerta(
                    clienteId: transacao.ClienteId,
                    transacaoId: transacao.Id,
                    nomeRegra: NomeRegra,
                    descricao: $"Cliente movimentou {somaConsiderandoAtual:C} em um dia, ultrapassando o limite de {limiteDiario:C}",
                    severidade: somaConsiderandoAtual > (limiteDiario * 2)
                        ? SeveridadeAlerta.Critica
                        : SeveridadeAlerta.Alta
                );

                return alerta;
            }

            _logger.LogInformation(
                "Limite diário OK para cliente {ClienteId}",
                transacao.ClienteId);

            return null;
        }
    }
}
