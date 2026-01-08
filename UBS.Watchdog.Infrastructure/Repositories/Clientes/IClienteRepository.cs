using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UBS.Watchdog.Domain.Entities;
using UBS.Watchdog.Domain.Enums;

namespace UBS.Watchdog.Infrastructure.Repositories;

public interface IClienteRepository
{
    Task<List<Cliente>> GetAllAsync();

    Task<Cliente?> GetByIdAsync(Guid id);

    Task<Cliente> AddAsync(Cliente cliente);

    Task UpdateAsync(Cliente cliente);

    Task DeleteAsync(Guid id);

    Task<List<Cliente>> GetByPaisAsync(string pais);
    Task<List<Cliente>> GetByNivelRiscoAsync(NivelRisco nivelRisco);

}
