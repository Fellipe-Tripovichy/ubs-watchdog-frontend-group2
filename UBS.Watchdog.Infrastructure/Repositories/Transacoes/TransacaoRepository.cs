using Microsoft.EntityFrameworkCore;
using UBS.Watchdog.Domain.Entities;
using UBS.Watchdog.Infrastructure.Data;

namespace UBS.Watchdog.Infrastructure.Repositories.Transacoes
{
    public class TransacaoRepository(AppDbContext context) : ITransacaoRepository
    {
        public async Task<Transacao> AddAsync(Transacao transacao)
        {
            await context.Transacoes.AddAsync(transacao);
            await context.SaveChangesAsync();
            return transacao;
        }

        public async Task DeleteAsync(Guid id)
        {
            var transacao = await GetByIdAsync(id);
            context.Transacoes.Remove(transacao);
            await context.SaveChangesAsync();
        }

        public async Task<List<Transacao>> GetAllAsync()
        {
            return await context.Transacoes.ToListAsync();
        }

        public async Task<List<Transacao>> GetByClienteIdAsync(Guid clienteId)
        {
            return await context.Transacoes
                .Where(t => t.ClienteId == clienteId)
                .OrderBy(t => t.DataHora)
                .ToListAsync();
        }

        public async Task<Transacao?> GetByIdAsync(Guid id)
        {
            return await context.Transacoes.FindAsync(id);
        }

        public async Task<List<Transacao>> GetByPeriodoAsync(DateTime dataInicio, DateTime dataFim)
        {
            return await context.Transacoes
                .Include(t => t.Cliente)
                .Where(t => t.DataHora >= dataInicio && t.DataHora <= dataFim)
                .OrderBy(t => t.DataHora)
                .ToListAsync();
        }

        public async Task<List<Transacao>> GetByClienteEPeriodoAsync(Guid clienteId, DateTime dataInicio, DateTime dataFim)
        {
            return await context.Transacoes
                .Where(t => t.ClienteId == clienteId
                    && t.DataHora >= dataInicio
                    && t.DataHora <= dataFim)
                .OrderBy(t => t.DataHora)
                .ToListAsync();
        }

        public async Task UpdateAsync(Transacao transacao)
        {
            context.Transacoes.Update(transacao);
            await context.SaveChangesAsync();
        }

        public async Task<decimal> GetSomaDiariaAsync(Guid clienteId, DateTime data)
        {
            var inicioDia = data.Date;
            var fimDia = inicioDia.AddDays(1);

            return await context.Transacoes
                .Where(t => t.ClienteId == clienteId
                         && t.DataHora >= inicioDia
                         && t.DataHora < fimDia)
                .SumAsync(t => t.Valor);
        }

        public async Task<List<Transacao>> GetTransacoesDoDiaAsync(Guid clienteId, DateTime data)
        {
            var inicioDia = data.Date;
            var fimDia = inicioDia.AddDays(1);

            return await context.Transacoes
                .Where(t => t.ClienteId == clienteId
                         && t.DataHora >= inicioDia
                         && t.DataHora < fimDia)
                .ToListAsync();
        }
    }
}
