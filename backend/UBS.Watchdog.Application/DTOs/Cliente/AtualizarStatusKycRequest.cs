using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UBS.Watchdog.Domain.Enums;

namespace UBS.Watchdog.Application.DTOs.Cliente
{
    public class AtualizarStatusKycRequest
    {
        [Required(ErrorMessage = "Novo status KYC é obrigatório")]
        public StatusKyc NovoStatus { get; set; }
    }
}
