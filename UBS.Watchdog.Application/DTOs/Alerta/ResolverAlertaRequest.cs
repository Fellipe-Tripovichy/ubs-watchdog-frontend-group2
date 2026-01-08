using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace UBS.Watchdog.Application.DTOs.Alerta
{
    public class ResolverAlertaRequest
    {
        public Guid AlertaId { get; set; }
        [Required(ErrorMessage = "Nome de quem resolveu é obrigatório")]
        public required string ResolvidoPor { get; set; }
    }
}
