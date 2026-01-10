using Microsoft.AspNetCore.Mvc;
using UBS.Watchdog.Application.Services;
using UBS.Watchdog.Application.DTOs.Alerta;
using UBS.Watchdog.Domain.Enums;

namespace UBS.Watchdog.API.Controllers;

[ApiController]
[Route("api/alertas")]
public class AlertasController : ControllerBase
{

    private readonly IAlertaService _alertaService;

    public AlertasController(IAlertaService alertaService)
    {
        _alertaService = alertaService;
    }

    #region HttpGet

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        return Ok(await _alertaService.ListarTodosAsync());
    }
    
    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetByID(Guid id)
    {
        var alerta = await _alertaService.ObterPorIdAsync(id);
        if (alerta == null) { return NotFound($"Alerta com ID '{id}' não existe."); }
        return Ok(alerta);
    }
    
    [HttpGet("cliente/{clienteId:guid}")]
    public async Task<IActionResult> GetByCliente(Guid clienteId)
    {
        return Ok(await _alertaService.ListarPorClienteAsync(clienteId));
    }

    [HttpGet ("status/{status}")]
    public async Task<IActionResult> GetAllByStatus([FromRoute] StatusAlerta status)
    {
        return Ok(await _alertaService.ListarPorStatusAsync(status));
    }

    [HttpGet("filtro")]
    public async Task<IActionResult> GetByFiltro(
        [FromQuery] StatusAlerta? status,
        [FromQuery] SeveridadeAlerta? severidade,
        [FromQuery] Guid? clienteId)
    {
        return Ok(await _alertaService.ListarComFiltrosAsync(status, severidade, clienteId));
    }

    #endregion

    #region HttpPatch

    [HttpPatch("{id:guid}/iniciar-analise")]
    public async Task<IActionResult> StartAnalysis(Guid id)
    {
        return Ok(await _alertaService.IniciarAnaliseAsync(id));
    }
    
    [HttpPatch("{id:guid}/status")]
    public async Task<IActionResult> ResolveAlerta(Guid id, [FromBody] ResolverAlertaRequest request)
    { 
        return Ok(await _alertaService.ResolverAsync(id, request));
    }

    #endregion
}