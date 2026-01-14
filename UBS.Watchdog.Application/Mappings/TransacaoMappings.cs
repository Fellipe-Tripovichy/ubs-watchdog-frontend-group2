using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UBS.Watchdog.Application.DTOs.Transacao;
using UBS.Watchdog.Domain.Entities;

namespace UBS.Watchdog.Application.Mappings
{
    public static class TransacaoMappings
    {
        public static TransacaoResponse toResponse(Transacao transacao)
        {
            return new TransacaoResponse
            {
                Id = transacao.Id,
                ClienteId = transacao.ClienteId,
                Tipo = transacao.Tipo,
                Valor = transacao.Valor,
                Moeda = transacao.Moeda,
                ContraparteId = transacao.ContraparteId,
                DataHora = transacao.DataHora,
                QuantidadeAlertas = transacao.Alertas?.Count ?? 0
            };
        }

        public static List<TransacaoResponse> toResponseList(List<Transacao> transacoes)
        {
            return transacoes.Select(toResponse).ToList();
        }
    }
}