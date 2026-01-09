using Microsoft.AspNetCore.Mvc;
using UBS.Watchdog.Application.DTOs.Alerta;

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

    [HttpGet("cliente/{clienteId:guid}")]
    public async Task<IActionResult> GetByCliente(Guid clienteId)
    {
        return null;
    }

    [HttpPatch("{id:guid}/status")]
    public async Task<IActionResult> ResolveAlerta(Guid id, [FromBody] ResolverAlertaRequest request)
    { 
        return null;
    }
}