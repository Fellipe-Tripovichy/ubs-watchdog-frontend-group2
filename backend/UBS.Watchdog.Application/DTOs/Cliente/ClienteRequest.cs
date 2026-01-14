using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace UBS.Watchdog.Application.DTOs.Cliente
{
    public class ClienteRequest
    {
        [Required(ErrorMessage = "Nome é obrigatório")]
        public string Nome { get; set; } = null!;
        [Required(ErrorMessage = "País é obrigatório")]
        public string Pais { get; set; } = null!;
        [Required(ErrorMessage = "Nível de risco é obrigatório")]
        public string NivelRisco { get; set; } = null!;
    }
}
