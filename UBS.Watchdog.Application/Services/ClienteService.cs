using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UBS.Watchdog.Application.DTOs.Cliente;
using UBS.Watchdog.Application.Mappings;
using UBS.Watchdog.Domain.Entities;
using UBS.Watchdog.Domain.Enums;
using UBS.Watchdog.Infrastructure.Repositories;

namespace UBS.Watchdog.Application.Services
{
    public interface IClienteService
    {
        Task<ClienteResponse> CriarAsync(ClienteRequest request);
        Task<ClienteResponse?> ObterPorIdAsync(Guid clienteId);
        Task<List<ClienteResponse>> ListarTodosAsync();
        Task<List<ClienteResponse>> ListarPorPaisAsync(string pais);
        Task<List<ClienteResponse>> ListarPorNivelRiscoAsync(NivelRisco nivelRisco);
        //Task<ClienteResponse> AtualizarStatusKycAsync(Guid id, AtualizarStatusKycRequest request);
        //Task<ClienteResponse> AtualizarNivelRiscoAsync(Guid id, AtualizarNivelRiscoRequest request);
        Task DeletarAsync(Guid id);
    }


    public class ClienteService(IClienteRepository clienteRepository) : IClienteService
    {
        public async Task<ClienteResponse> CriarAsync(ClienteRequest request) 
        {
            //TODO:LOG
            var cliente = Cliente.Criar(request.Nome,request.Pais,request.NivelRisco);
            await clienteRepository.AddAsync(cliente);

            //TODO:LOG
            return ClienteMappings.ToResponse(cliente);
        }

        public async Task<ClienteResponse?> ObterPorIdAsync(Guid clienteId) 
        {
            //TODO:LOG
            var cliente = await clienteRepository.GetByIdAsync(clienteId);

            if (cliente == null) 
            {
                //TODO:LOG
                return null;
            }

            return ClienteMappings.ToResponse(cliente);
        }

        public async Task<List<ClienteResponse>> ListarTodosAsync() 
        {
            var clientes = await clienteRepository.GetAllAsync();
            return ClienteMappings.ToResponseList(clientes);
        }

        public async Task<List<ClienteResponse>> ListarPorPaisAsync(string pais)
        {
            var clientes = await clienteRepository.GetByPaisAsync(pais);
            return ClienteMappings.ToResponseList(clientes);
        }
        public async Task<List<ClienteResponse>> ListarPorNivelRiscoAsync(NivelRisco nivelRisco)
        {
            var clientes = await clienteRepository.GetByNivelRiscoAsync(nivelRisco);
            return ClienteMappings.ToResponseList(clientes);
        }

        public async Task DeletarAsync(Guid id)
        {
            await clienteRepository.DeleteAsync(id);
        }
    }
}
