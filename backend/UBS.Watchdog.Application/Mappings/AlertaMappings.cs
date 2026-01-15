using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UBS.Watchdog.Application.DTOs.Alerta;
using UBS.Watchdog.Application.DTOs.Cliente;
using UBS.Watchdog.Domain.Entities;

namespace UBS.Watchdog.Application.Mappings
{
    public class AlertaMappings
    {
        public static AlertaResponse ToResponse(Alerta alerta)
        {
            return new AlertaResponse
            {
                Id = alerta.Id,
                ClienteId = alerta.ClienteId,
                TransacaoId = alerta.TransacaoId,
                NomeRegra = alerta.NomeRegra,
                Descricao = alerta.Descricao,
                Severidade = alerta.Severidade,
                Status = alerta.Status,
                DataCriacao = alerta.DataCriacao,
                DataResolucao = alerta.DataResolucao,
                ResolvidoPor = alerta.ResolvidoPor,
                Resolucao = alerta.Resolucao
            };
        }

        public static List<AlertaResponse> ToResponseList(List<Alerta> alertas)
        {
            return alertas.Select(ToResponse).ToList();
        }
    }
}
