using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UBS.Watchdog.Domain.Entities;
using UBS.Watchdog.Domain.Enums;

namespace UBS.Watchdog.Infrastructure.Repositories.Alertas
{
    public interface IAlertaRepository
    {
        Task<List<Alerta>> GetAllAsync();
        Task<Alerta?> GetByIdAsync(Guid id);
        Task<Alerta> AddAsync(Alerta alerta);
        Task UpdateAsync(Alerta alerta);
        Task DeleteAsync(Guid id);

        #region Consultas    
        Task<List<Alerta>> GetByClienteIdAsync(Guid clienteId);
        Task<List<Alerta>> GetByTransacaoIdAsync(Guid transacaoId);
        Task<List<Alerta>> GetByStatusAsync(StatusAlerta status);
        Task<List<Alerta>> GetBySeveridadeAsync(SeveridadeAlerta severidade);
        Task<List<Alerta>> GetByFiltrosAsync(StatusAlerta? status, SeveridadeAlerta? severidade, Guid? clienteId);
        #endregion
    }
}
