using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UBS.Watchdog.Domain.Enums;

namespace UBS.Watchdog.Application.DTOs.Transacao
{
    public class TransacaoRequest
    {
        [Required(ErrorMessage = "ClienteId é obrigatório")]
        public Guid ClienteId { get; set; }
        [Required(ErrorMessage = "Tipo de transação é obrigatório")]
        public TipoTransacao Tipo { get; set; }
        [Required(ErrorMessage = "Valor é obrigatório")]
        [Range(0.01, double.MaxValue, ErrorMessage = "Valor deve ser maior que zero")]
        public decimal Valor { get; set; }
        [Required(ErrorMessage = "Moeda é obrigatória")]
        public Moeda Moeda { get; set; }
        [Required(ErrorMessage = "Contraparte é obrigatório")]
        public string? Contraparte { get; set; }
    }
}
