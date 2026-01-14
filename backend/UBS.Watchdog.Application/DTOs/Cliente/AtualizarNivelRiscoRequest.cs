using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UBS.Watchdog.Domain.Enums;

namespace UBS.Watchdog.Application.DTOs.Cliente
{
    public class AtualizarNivelRiscoRequest
    {
        [Required(ErrorMessage = "Novo Nivel Risco é obrigatório")]
        public NivelRisco NovoNivel { get; set; }
    }
}
