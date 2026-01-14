using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using UBS.Watchdog.Domain.Enums;

namespace UBS.Watchdog.Application.DTOs.Alerta
{
    public class AlertaResponse
    {
        public Guid Id { get;  set; }
        public Guid ClienteId { get;  set; }
        public Guid TransacaoId { get;  set; }
        public string NomeRegra { get; set; }
        public string Descricao { get; set; }
        [JsonConverter(typeof(JsonStringEnumConverter))]
        public SeveridadeAlerta Severidade { get; set; }
        [JsonConverter(typeof(JsonStringEnumConverter))]
        public StatusAlerta Status { get; set; }
        public DateTime DataCriacao { get; set; }
        public DateTime? DataResolucao { get; set; }
        public string? Resolucao{ get; set; }
        public string? ResolvidoPor { get; set; }
    }
}
