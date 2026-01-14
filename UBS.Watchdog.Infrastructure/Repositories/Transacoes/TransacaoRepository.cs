using Microsoft.EntityFrameworkCore;
using UBS.Watchdog.Domain.Entities;
using UBS.Watchdog.Domain.Enums;
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
            return await context.Transacoes
                .Include(t => t.Cliente)
                .Include(t => t.Contraparte)
                .Include(t => t.Alertas)
                .OrderBy(t => t.DataHora)
                .ToListAsync();
        }

        public async Task<List<Transacao>> GetByClienteIdAsync(Guid clienteId)
        {
            return await context.Transacoes
                .Include(t => t.Cliente)
                .Include(t => t.Contraparte)
                .Include(t => t.Alertas)
                .Where(t => t.ClienteId == clienteId)
                .OrderBy(t => t.DataHora)
                .ToListAsync();
        }

        public async Task<Transacao?> GetByIdAsync(Guid id)
        {
            return await context.Transacoes
                .Include(t => t.Cliente)
                .Include(t => t.Contraparte)
                .Include(t => t.Alertas)
                .FirstOrDefaultAsync(t => t.Id == id);
        }

        public async Task<List<Transacao>> GetByPeriodoAsync(DateTime dataInicio, DateTime dataFim)
        {
            return await context.Transacoes
                .Include(t => t.Cliente)
                .Include(t => t.Contraparte)
                .Include(t => t.Alertas)
                .Where(t => t.DataHora >= dataInicio && t.DataHora <= dataFim)
                .OrderBy(t => t.DataHora)
                .ToListAsync();
        }

        public async Task<List<Transacao>> GetComFiltrosAsync(
            Guid? clienteId,
            DateTime? dataInicio,
            DateTime? dataFim,
            string? moeda,
            TipoTransacao? tipo)
        {
            var query = context.Transacoes
                .Include(t => t.Cliente)
                .Include(t => t.Contraparte)
                .Include(t => t.Alertas)
                .AsQueryable();

            if (clienteId.HasValue)
                query = query.Where(t => t.ClienteId == clienteId.Value);

            if (!string.IsNullOrWhiteSpace(moeda) && Enum.TryParse<Moeda>(moeda, true, out var moedaEnum))
            {
                query = query.Where(t => t.Moeda == moedaEnum);
            }

            if (tipo.HasValue)
                query = query.Where(t => t.Tipo == tipo.Value);

            if (dataInicio.HasValue)
            {
                var di = DateTime.SpecifyKind(dataInicio.Value, DateTimeKind.Utc);
                query = query.Where(t => t.DataHora >= di);
            }

            if (dataFim.HasValue)
            {
                var df = DateTime.SpecifyKind(dataFim.Value, DateTimeKind.Utc);
                query = query.Where(t => t.DataHora <= df);
            }

            return await query
                .OrderBy(t => t.DataHora)
                .ToListAsync();
        }

        public async Task<List<Transacao>> GetByClienteEPeriodoAsync(Guid clienteId, DateTime dataInicio, DateTime dataFim)
        {
            dataInicio = DateTime.SpecifyKind(dataInicio, DateTimeKind.Utc);
            dataFim = DateTime.SpecifyKind(dataFim, DateTimeKind.Utc);

            return await context.Transacoes
                .Include(t => t.Contraparte)
                .Include(t => t.Alertas)
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
                .Include(t => t.Contraparte)
                .Include(t => t.Alertas)
                .Where(t => t.ClienteId == clienteId
                         && t.DataHora >= inicioDia
                         && t.DataHora < fimDia)
                .ToListAsync();
        }
    }
}