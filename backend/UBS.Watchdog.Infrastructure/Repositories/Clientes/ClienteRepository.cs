using Microsoft.EntityFrameworkCore;
using UBS.Watchdog.Domain.Entities;
using UBS.Watchdog.Domain.Enums;
using UBS.Watchdog.Infrastructure.Data;

namespace UBS.Watchdog.Infrastructure.Repositories.Clientes;

public class ClienteRepository(AppDbContext context) : IClienteRepository
{
    public async Task<List<Cliente>> GetAllAsync()
    {
        return await context.Clientes
            .Include(c => c.Transacoes)
            .Include(c => c.Alertas)
            .OrderBy(c => c.Nome)
            .ToListAsync();
    }

    public async Task<Cliente?> GetByIdAsync(Guid id)
    {
        return await context.Clientes
            .Include(c => c.Transacoes)
            .Include(c => c.Alertas)
            .FirstOrDefaultAsync(c => c.Id == id);
    }

    public async Task<Cliente> AddAsync(Cliente cliente)
    {
        await context.Clientes.AddAsync(cliente);
        await context.SaveChangesAsync();
        return cliente;
    }

    public async Task UpdateAsync(Cliente cliente)
    {
        context.Clientes.Update(cliente);
        await context.SaveChangesAsync();
    }

    public async Task DeleteAsync(Guid id)
    {
        var cliente = await GetByIdAsync(id);
        context.Clientes.Remove(cliente);
        await context.SaveChangesAsync();
    }

    public async Task<List<Cliente>> GetByPaisAsync(string pais)
    {
        pais = pais.ToLower();

        return await context.Clientes
            .Where(c => c.Pais == pais)
            .Include(c => c.Transacoes)
            .Include(c => c.Alertas)
            .ToListAsync();
    }

    public async Task<List<Cliente>> GetByNivelRiscoAsync(NivelRisco nivelRisco)
    {
        return await context.Clientes
            .Where(c => c.NivelRisco == nivelRisco)
            .Include(c => c.Transacoes)
            .Include(c => c.Alertas)
            .ToListAsync();
    }
}
