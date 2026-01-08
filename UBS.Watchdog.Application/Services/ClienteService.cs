using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UBS.Watchdog.Application.DTOs.Cliente;
using UBS.Watchdog.Domain.Entities;
using UBS.Watchdog.Domain.Enums;
using UBS.Watchdog.Infrastructure.Repositories;

namespace UBS.Watchdog.Application.Services
{
    public interface IClienteService
    {
        Task<ClienteResponse> CriarAsync(ClienteRequest request);
        Task<Cliente?> ObterPorIdAsync(Guid clienteId);
        Task<List<Cliente>> ListarTodosAsync();
        Task<List<Cliente>> ListarPorPaisAsync(string pais);
        Task<List<Cliente>> ListarPorNivelRiscoAsync(NivelRisco nivelRisco);
        //Task<ClienteResponse> AtualizarStatusKycAsync(Guid id, AtualizarStatusKycRequest request);
        //Task<ClienteResponse> AtualizarNivelRiscoAsync(Guid id, AtualizarNivelRiscoRequest request);
        Task DeletarAsync(Guid id);
    }


    public class ClienteService(IClienteRepository clienteRepository) : IClienteService
    {
        public async Task<ClienteResponse> CriarAsync(ClienteRequest request) 
        {
            //TODO:LOG
            var cliente = Cliente.Criar(
                request.Nome,
                request.Pais,
                request.NivelRisco);

            await clienteRepository.AddAsync(cliente);

            //TODO:LOG

            return cliente.ToResponse();
        }

        public async Task<Cliente?> ObterPorIdAsync(Guid clienteId) 
        {
            //TODO:LOG
            var cliente = await clienteRepository.GetByIdAsync(clienteId);

            if (cliente == null) 
            {
                //TODO:LOG
                return null;
            }

            return cliente;
        }

        public async Task<List<Cliente>> ListarTodosAsync() 
        {
            return await clienteRepository.GetAllAsync();
        }

        public async Task<List<Cliente>> ListarPorPaisAsync(string pais)
        {
            var clientes = await clienteRepository.GetAllAsync();
            return clientes.Where(c => c.Pais.Equals(pais, StringComparison.OrdinalIgnoreCase)).ToList();
        }

        public async Task<List<Cliente>> ListarPorNivelRiscoAsync(NivelRisco nivelRisco)
        {
            var clientes = await clienteRepository.GetAllAsync();
            return clientes.Where(c => c.NivelRisco == nivelRisco).ToList();
        }

        public async Task DeletarAsync(Guid id)
        {
            await clienteRepository.DeleteAsync(id);
        }
    }
}
