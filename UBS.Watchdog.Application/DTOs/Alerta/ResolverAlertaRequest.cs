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
        public required string ResolvidoPor { get; set; }
    }
}
