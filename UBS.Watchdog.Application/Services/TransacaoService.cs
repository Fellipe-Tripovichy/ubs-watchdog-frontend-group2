using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UBS.Watchdog.Application.DTOs.Transacao;
using UBS.Watchdog.Domain.Entities;
using UBS.Watchdog.Domain.Enums;
using UBS.Watchdog.Infrastructure.Repositories;
using UBS.Watchdog.Infrastructure.Repositories.Transações;

namespace UBS.Watchdog.Application.Services
{

    public interface ITransacaoService
    {
        Task<Transacao> RegistrarAsync(TransacaoRequest request);
        Task<Transacao?> ObterPorIdAsync(Guid transacaoId);
        Task<List<Transacao>> ListarTodasAsync();
        Task<List<Transacao>> ListarPorClienteIdAsync(Guid clienteId);
    }
    public class TransacaoService(ITransacaoRepository transacaoRepository) : ITransacaoService
    {
        public Task<List<Transacao>> ListarPorClienteIdAsync(Guid clienteId)
        {
            return transacaoRepository.GetByClienteIdAsync(clienteId);
        }

        public Task<List<Transacao>> ListarTodasAsync()
        {
            return transacaoRepository.GetAllAsync();
        }

        public Task<Transacao?> ObterPorIdAsync(Guid transacaoId)
        {
            return transacaoRepository.GetByIdAsync(transacaoId);
        }

        public Task<Transacao> RegistrarAsync(TransacaoRequest request)
        {
            var transacao = Transacao.Criar(
                request.ClienteId,
                request.Tipo,
                request.Valor,
                request.Moeda,
                request.Contraparte);

            return transacaoRepository.AddAsync(transacao);
        }
    }
}
