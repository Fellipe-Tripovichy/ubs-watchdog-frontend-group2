using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UBS.Watchdog.Application.DTOs.Cliente;
using UBS.Watchdog.Domain.Entities;

namespace UBS.Watchdog.Application.Mappings
{
    public static class ClienteMappings
    {
        public static ClienteResponse ToResponse(Cliente cliente) 
        {
            return new ClienteResponse
            {
                Id = cliente.Id,
                Nome = cliente.Nome,
                Pais = cliente.Pais,
                NivelRisco = cliente.NivelRisco,
                StatusKyc = cliente.StatusKyc,
                DataCriacao = cliente.DataCriacao
            };
        }

        public static List<ClienteResponse> ToResponseList(IEnumerable<Cliente> clientes)
        {
            return clientes.Select(ToResponse).ToList();
        }

    }
}
