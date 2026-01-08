using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UBS.Watchdog.Domain.Enums;

namespace UBS.Watchdog.Application.DTOs.Cliente
{
    public class ClienteResponse
    {
        public Guid Id { get; private set; }
        public string Nome { get; private set; }
        public string Pais { get; private set; }
        public NivelRisco NivelRisco { get; private set; }
        public StatusKyc StatusKyc { get; private set; }
        public DateTime DataCriacao { get; private set; }
    }
}
