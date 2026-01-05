using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UBS.Watchdog.Domain.Entities;

namespace UBS.Watchdog.Infrastructure.Repositories.Transações
{
    public interface ITransacaoRepository
    {
        Task<List<Transacao>> GetAllAsync();

        Task<Transacao?> GetByIdAsync(Guid id);

        Task<List<Transacao>> GetByPeriodoAsync(DateTime dataInicio, DateTime dataFim);

        Task<List<Transacao>> GetByClienteEPeriodoAsync(Guid clienteId, DateTime dataInicio, DateTime dataFim);

        Task<Transacao> AddAsync(Transacao transacao);

        Task UpdateAsync(Transacao transacao);

        Task DeleteAsync(Guid id);

        Task<List<Transacao>> GetByClienteIdAsync(Guid clienteId);

        //Task<List<Transacao>> GetTransacoesDoDiaAsync(Guid clienteId, DateTime data);
    }
}
