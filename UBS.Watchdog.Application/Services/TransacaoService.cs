using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UBS.Watchdog.Application.DTOs.Transacao;
using UBS.Watchdog.Application.Mappings;
using UBS.Watchdog.Domain.Entities;
using UBS.Watchdog.Domain.Enums;
using UBS.Watchdog.Infrastructure.Repositories;
using UBS.Watchdog.Infrastructure.Repositories.Transações;

namespace UBS.Watchdog.Application.Services
{

    public interface ITransacaoService
    {
        Task<TransacaoResponse> RegistrarAsync(TransacaoRequest request);
        Task<TransacaoResponse?> ObterPorIdAsync(Guid transacaoId);
        Task<List<TransacaoResponse>> ListarTodasAsync();
        Task<List<TransacaoResponse>> ListarPorClienteIdAsync(Guid clienteId);
    }
    public class TransacaoService(ITransacaoRepository transacaoRepository) : ITransacaoService
    {
        public async Task<List<TransacaoResponse>> ListarPorClienteIdAsync(Guid clienteId)
        {
            var transacoes = await transacaoRepository.GetByClienteIdAsync(clienteId);
            return TransacaoMappings.toResponseList(transacoes);
        }

        public async Task<List<TransacaoResponse>> ListarTodasAsync()
        {
            var transacoes = await transacaoRepository.GetAllAsync();

            return TransacaoMappings.toResponseList(transacoes);
        }

        public async Task<TransacaoResponse?> ObterPorIdAsync(Guid transacaoId)
        {
            var transacao = await transacaoRepository.GetByIdAsync(transacaoId);
            if (transacao == null)
            {
                return null;
            }

            return TransacaoMappings.toResponse(transacao);
        }

        public async Task<TransacaoResponse> RegistrarAsync(TransacaoRequest request)
        {
            var transacao = Transacao.Criar(
                request.ClienteId,
                request.Tipo,
                request.Valor,
                request.Moeda,
                request.Contraparte);

            await transacaoRepository.AddAsync(transacao);
            return TransacaoMappings.toResponse(transacao);
        }
    }
}
