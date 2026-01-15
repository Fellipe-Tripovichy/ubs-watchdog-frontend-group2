using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using UBS.Watchdog.Domain.Enums;

namespace UBS.Watchdog.Application.DTOs.Transacao
{
    public class TransacaoResponse
    {
        public Guid Id { get; set; }
        public Guid ClienteId { get; set; }
        [JsonConverter(typeof(JsonStringEnumConverter))]
        public TipoTransacao Tipo { get; set; }
        public decimal Valor { get; set; }
        [JsonConverter(typeof(JsonStringEnumConverter))]
        public Moeda Moeda { get; set; }
        public Guid? ContraparteId { get; set; }
        public DateTime DataHora { get; set; }
        public int QuantidadeAlertas { get; set; }
    }
}