using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UBS.Watchdog.Domain.Entities;
using UBS.Watchdog.Domain.Enums;

namespace UBS.Watchdog.Application.DTOs.Cliente
{
    public class ClienteResponse
    {
        public Guid Id { get;  set; }
        public string Nome { get;  set; }
        public string Pais { get;  set; }
        public NivelRisco NivelRisco { get;  set; }
        public StatusKyc StatusKyc { get;  set; }
        public DateTime DataCriacao { get;  set; }
    }
}
