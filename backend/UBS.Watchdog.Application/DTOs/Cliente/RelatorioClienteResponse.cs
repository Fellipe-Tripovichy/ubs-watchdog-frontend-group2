using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace UBS.Watchdog.Application.DTOs.Cliente
{
    public class RelatorioClienteResponse
    {
        public Guid ClienteId { get; set; }
        public string NomeCliente { get; set; } = null!;
        public string Pais { get; set; } = null!;
        public string NivelRisco { get; set; } = null!;
        public string StatusKyc { get; set; } = null!;
        public DateTime DataCriacao { get; set; }
        public int TotalTransacoes { get; set; }
        public decimal TotalMovimentado { get; set; }
        public decimal MediaTransacao { get; set; }
        public DateTime? DataUltimaTransacao { get; set; }
        public int TotalAlertas { get; set; }
        public int AlertasNovos { get; set; }
        public int AlertasEmAnalise { get; set; }
        public int AlertasResolvidos { get; set; }
        public int AlertasCriticos { get; set; }
        public DateTime? PeriodoInicio { get; set; }
        public DateTime? PeriodoFim { get; set; }
    }
}
