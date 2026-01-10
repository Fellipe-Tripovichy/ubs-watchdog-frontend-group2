using Microsoft.AspNetCore.Mvc;
using UBS.Watchdog.Application.DTOs.Alerta;
using UBS.Watchdog.Domain.Enums;

namespace UBS.Watchdog.API.Controllers;

[ApiController]
[Route("api/{controller}")]
public class AlertaController : ControllerBase
{
    //TODO: passar AlertaService
    private readonly AlertaService _alertaService;

    public AlertaController(AlertaService alertaService)
    {
        _alertaService = alertaService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        return Ok(await _alertaService.ListarTodosAsync());
    }
    
    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetByID(Guid id)
    {
        var alerta = await _alertaService.ObterPorIdAsync(id);
        if (alerta == null) return NotFound($"Transação com ID '{id}' não existe.");
        return Ok(alerta);
    }
    
    [HttpGet("cliente/{clienteId:guid}")]
    public async Task<IActionResult> GetByCliente(Guid clienteId)
    {
        return Ok(await _alertaService.ListarPorClienteAsync(clienteId));
    }

    [HttpGet ("status/{status:StatusAlerta}")]
    public async Task<IActionResult> GetAllByStatus(StatusAlerta status)
    {
        return Ok(await _alertaService.ListarPorStatusAsync(status));
    }

    [HttpGet("filtro")]
    public async Task<IActionResult> GetByFiltro(StatusAlerta? status, SeveridadeAlerta? severidade, Guid? clienteId)
    {
        return Ok(await _alertaService.ListarComFiltrosAsync(status, severidade, clienteId));
    }

    [HttpPatch("iniciar-analise/{id:guid}")]
    public async Task<IActionResult> StartAnalysis(Guid id)
    {
        return Ok(await _alertaService.IniciarAnaliseAsync(id));
    }
    
    [HttpPatch("{id:guid}/status")]
    public async Task<IActionResult> ResolveAlerta(Guid id, [FromBody] ResolverAlertaRequest request)
    { 
        return Ok(await _alertaService.ResolverAsync(id, request));
    }
}