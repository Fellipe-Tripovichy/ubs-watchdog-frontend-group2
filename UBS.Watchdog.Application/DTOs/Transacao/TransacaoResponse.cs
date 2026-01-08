using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UBS.Watchdog.Domain.Enums;

namespace UBS.Watchdog.Application.DTOs.Transacao
{
    public class TransacaoResponse
    {
        public Guid Id { get; set; }
        public Guid ClienteId { get; set; }
        public TipoTransacao Tipo { get; set; }
        public decimal Valor { get; set; }
        public Moeda Moeda { get; set; }
        public string? Contraparte { get; set; }
        public DateTime DataHora { get; set; }
    }
}
