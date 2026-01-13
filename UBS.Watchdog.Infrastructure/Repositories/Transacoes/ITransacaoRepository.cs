using UBS.Watchdog.Domain.Entities;

namespace UBS.Watchdog.Infrastructure.Repositories.Transacoes
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
        Task<decimal> GetSomaDiariaAsync(Guid clienteId, DateTime date);
        Task<List<Transacao>> GetTransacoesDoDiaAsync(Guid clienteId, DateTime data);
    }
}
