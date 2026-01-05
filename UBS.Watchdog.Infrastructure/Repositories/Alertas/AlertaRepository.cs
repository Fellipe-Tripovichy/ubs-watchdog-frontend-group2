using Microsoft.EntityFrameworkCore;
using UBS.Watchdog.Domain.Entities;
using UBS.Watchdog.Domain.Enums;
using UBS.Watchdog.Infrastructure.Data;

namespace UBS.Watchdog.Infrastructure.Repositories.Alertas
{
    public class AlertaRepository(AppDbContext context) : IAlertaRepository
    {
        public async Task<List<Alerta>> GetAllAsync()
        {
            return await context.Alertas
                .Include(a => a.Cliente)
                .Include(a => a.Transacao)
                .OrderByDescending(a => a.DataCriacao)
                .ToListAsync();
        }

        public async Task<Alerta?> GetByIdAsync(Guid id)
        {
            return await context.Alertas
                .Include(a => a.Cliente)
                .Include(a => a.Transacao)
                .FirstOrDefaultAsync(a => a.Id == id);
        }

        public async Task<Alerta> AddAsync(Alerta alerta)
        {
            await context.Alertas.AddAsync(alerta);
            await context.SaveChangesAsync();
            return alerta;
        }

        public async Task UpdateAsync(Alerta alerta)
        {
            context.Alertas.Update(alerta);
            await context.SaveChangesAsync();
        }

        public async Task DeleteAsync(Guid id)
        {
            var alerta = await context.Alertas.FindAsync(id);
            if (alerta != null)
            {
                context.Alertas.Remove(alerta);
                await context.SaveChangesAsync();
            }
        }

        public async Task<List<Alerta>> GetByClienteIdAsync(Guid clienteId)
        {
            return await context.Alertas
                .Where(a => a.ClienteId == clienteId)
                .Include(a => a.Transacao)
                .OrderByDescending(a => a.DataCriacao)
                .ToListAsync();
        }

        public async Task<List<Alerta>> GetByStatusAsync(StatusAlerta status)
        {
            return await context.Alertas
                .Where(a => a.Status == status)
                .Include(a => a.Cliente)
                .Include(a => a.Transacao)
                .OrderByDescending(a => a.DataCriacao)
                .ToListAsync();
        }

        public async Task<List<Alerta>> GetBySeveridadeAsync(SeveridadeAlerta severidade)
        {
            return await context.Alertas
                .Where(a => a.Severidade == severidade)
                .Include(a => a.Cliente)
                .Include(a => a.Transacao)
                .OrderByDescending(a => a.DataCriacao)
                .ToListAsync();
        }

        public async Task<List<Alerta>> GetByFiltrosAsync(
            StatusAlerta? status,
            SeveridadeAlerta? severidade,
            Guid? clienteId)
        {
            var query = context.Alertas
                .Include(a => a.Cliente)
                .Include(a => a.Transacao)
                .AsQueryable();

            if (status.HasValue)
                query = query.Where(a => a.Status == status.Value);

            if (severidade.HasValue)
                query = query.Where(a => a.Severidade == severidade.Value);

            if (clienteId.HasValue)
                query = query.Where(a => a.ClienteId == clienteId.Value);

            return await query
                .OrderByDescending(a => a.DataCriacao)
                .ToListAsync();
        }

        public async Task<List<Alerta>> GetByTransacaoIdAsync(Guid transacaoId)
        {
            return await context.Alertas
                .Where(a => a.TransacaoId == transacaoId)
                .Include(a => a.Cliente)
                .OrderByDescending(a => a.DataCriacao)
                .ToListAsync();
        }
    }
}
