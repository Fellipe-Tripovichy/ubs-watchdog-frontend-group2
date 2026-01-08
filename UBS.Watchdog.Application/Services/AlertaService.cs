using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UBS.Watchdog.Application.DTOs.Alerta;
using UBS.Watchdog.Domain.Enums;

namespace UBS.Watchdog.Application.Services
{
    public interface IAlertaService
    {
        Task<List<AlertaResponse>> ListarTodosAsync();
        Task<AlertaResponse?> ObterPorIdAsync(Guid id);
        Task<List<AlertaResponse>> ListarPorClienteAsync(Guid clienteId);
        Task<List<AlertaResponse>> ListarPorStatusAsync(StatusAlerta status);
        Task<List<AlertaResponse>> ListarComFiltrosAsync(StatusAlerta? status, SeveridadeAlerta? severidade, Guid? clienteId);
        Task<AlertaResponse> IniciarAnaliseAsync(Guid id);
        Task<AlertaResponse> ResolverAsync(Guid id, AtualizarStatusAlertaRequest request);
    }
    public class AlertaService
    {
    }
}
