using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UBS.Watchdog.Application.DTOs.Cliente;
using UBS.Watchdog.Application.Mappings;
using UBS.Watchdog.Domain.Entities;
using UBS.Watchdog.Domain.Enums;
using UBS.Watchdog.Infrastructure.Repositories.Clientes;

namespace UBS.Watchdog.Application.Services
{
    public interface IClienteService
    {
        Task<ClienteResponse> CriarAsync(ClienteRequest request);
        Task<ClienteResponse?> ObterPorIdAsync(Guid clienteId);
        Task<List<ClienteResponse>> ListarTodosAsync();
        Task<List<ClienteResponse>> ListarPorPaisAsync(string pais);
        Task<List<ClienteResponse>> ListarPorNivelRiscoAsync(NivelRisco nivelRisco);
        Task<ClienteResponse> AtualizarStatusKycAsync(Guid id, AtualizarStatusKycRequest request);
        Task<ClienteResponse> AtualizarNivelRiscoAsync(Guid id, AtualizarNivelRiscoRequest request);
        Task DeletarAsync(Guid id);
    }


    public class ClienteService(IClienteRepository clienteRepository, ILogger<ClienteService> _logger) : IClienteService
    {
        public async Task<ClienteResponse> CriarAsync(ClienteRequest request) 
        {
            _logger.LogInformation(
                "Criando cliente: Nome={Nome}, Pais={Pais}, NivelRisco={NivelRisco}",
                request.Nome,
                request.Pais,
                request.NivelRisco);

            var cliente = Cliente.Criar(request.Nome,request.Pais,request.NivelRisco);
            await clienteRepository.AddAsync(cliente);

            _logger.LogInformation("Cliente criado com sucesso: ClienteId={ClienteId}", cliente.Id);

            return ClienteMappings.ToResponse(cliente);
        }

        public async Task<ClienteResponse?> ObterPorIdAsync(Guid clienteId) 
        {
            _logger.LogInformation("Buscando cliente por ID: ClienteID={ClienteId}", clienteId.ToString());

            var cliente = await clienteRepository.GetByIdAsync(clienteId);

            if (cliente == null) 
            {
                _logger.LogWarning("Cliente não encontrado: ClienteId={ClienteId}", clienteId.ToString());

                return null;
            }

            return ClienteMappings.ToResponse(cliente);
        }

        public async Task<List<ClienteResponse>> ListarTodosAsync() 
        {
            _logger.LogInformation("Listando todos os clientes");

            var clientes = await clienteRepository.GetAllAsync();
            return ClienteMappings.ToResponseList(clientes);
        }

        public async Task<List<ClienteResponse>> ListarPorPaisAsync(string pais)
        {
            _logger.LogInformation("Listando clientes por país: Pais={Pais}", pais);

            var clientes = await clienteRepository.GetByPaisAsync(pais);
            return ClienteMappings.ToResponseList(clientes);
        }
        public async Task<List<ClienteResponse>> ListarPorNivelRiscoAsync(NivelRisco nivelRisco)
        {
            _logger.LogInformation("Listando clientes por nível de risco: NivelRisco={NivelRisco}", nivelRisco);

            var clientes = await clienteRepository.GetByNivelRiscoAsync(nivelRisco);
            return ClienteMappings.ToResponseList(clientes);
        }

        public async Task DeletarAsync(Guid id)
        {
            await clienteRepository.DeleteAsync(id);

            _logger.LogInformation("Cliente removido com sucesso: ClienteId={ClienteId}", id);
        }

        public async Task<ClienteResponse> AtualizarStatusKycAsync(Guid id, AtualizarStatusKycRequest request)
        {
            _logger.LogInformation("Atualizando status KYC do cliente: {ClienteId}", id);

            var cliente = await clienteRepository.GetByIdAsync(id);

            if (cliente == null)
                throw new KeyNotFoundException($"Cliente {id} não encontrado");

            cliente.AtualizarStatusKyc(request.NovoStatus);

            await clienteRepository.UpdateAsync(cliente);

            _logger.LogInformation("Status KYC atualizado: {ClienteId} -> {NovoStatus}", id, request.NovoStatus);

            return Mappings.ClienteMappings.ToResponse(cliente);
        }

        public async Task<ClienteResponse> AtualizarNivelRiscoAsync(Guid id, AtualizarNivelRiscoRequest request)
        {
            _logger.LogInformation("Atualizando nível de risco do cliente: {ClienteId}", id);

            var cliente = await clienteRepository.GetByIdAsync(id);

            if (cliente == null)
                throw new KeyNotFoundException($"Cliente {id} não encontrado");

            cliente.AtualizarNivelRisco(request.NovoNivel);

            await clienteRepository.UpdateAsync(cliente);

            _logger.LogInformation("Nível de risco atualizado: {ClienteId} -> {NovoNivel}", id, request.NovoNivel);

            return Mappings.ClienteMappings.ToResponse(cliente);
        }
    }
}
