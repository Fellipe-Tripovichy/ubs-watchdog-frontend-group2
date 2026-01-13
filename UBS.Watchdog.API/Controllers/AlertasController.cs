using Microsoft.AspNetCore.Mvc;
using UBS.Watchdog.Application.Services;
using UBS.Watchdog.Application.DTOs.Alerta;
using UBS.Watchdog.Domain.Enums;

namespace UBS.Watchdog.API.Controllers;

[ApiController]
[Route("api/alertas")]
public class AlertasController(IAlertaService alertaService, ILogger<AlertasController> logger) : ControllerBase
{
    #region HttpGet

    [HttpGet]
    public async Task<ActionResult<List<AlertaResponse>>> ListarTodos()
    {
        logger.LogInformation("GET /api/alertas - Listando todos os alertas");

        var alertas = await alertaService.ListarTodosAsync();
        return Ok(alertas);
    }
    
    [HttpGet("{id:guid}")]
    public async Task<ActionResult<AlertaResponse>> ObterPorId(Guid id)
    {
        logger.LogInformation("GET /api/alertas/{Id}", id);
        var alerta = await alertaService.ObterPorIdAsync(id);

        if (alerta == null)
        {
            logger.LogWarning("Alerta {Id} não encontrado", id);
            return NotFound(new { message = $"Alerta {id} não encontrado" });
        }

        return Ok(alerta);
    }

    [HttpGet("cliente/{clienteId:guid}")]
    public async Task<ActionResult<List<AlertaResponse>>> ListarPorCliente(Guid clienteId)
    {
        logger.LogInformation("GET /api/alertas/cliente/{ClienteId}", clienteId);

        var alertas = await alertaService.ListarPorClienteAsync(clienteId);

        return Ok(alertas);
    }

    [HttpGet ("status/{status}")]
    public async Task<ActionResult<List<AlertaResponse>>> ListarPorStatus(StatusAlerta status)
    {
        logger.LogInformation("GET /api/alertas/status/{Status}", status);

        var alertas = await alertaService.ListarPorStatusAsync(status);
        return Ok(alertas);
    }

    [HttpGet("filtrar")]
    public async Task<ActionResult<List<AlertaResponse>>> ListarComFiltros(
        [FromQuery] StatusAlerta? status = null,
        [FromQuery] SeveridadeAlerta? severidade = null,
        [FromQuery] Guid? clienteId = null,
        [FromQuery] DateTime? dataCriacaoInicio = null,
        [FromQuery] DateTime? dataCriacaoFim = null)
    {
        logger.LogInformation(
            "GET /api/alertas/filtrar?status={Status}&severidade={Severidade}&clienteId={ClienteId}&dataCriacaoInicio={dataCriacaoInicio}&dataCriacaoFim={dataCriacaoFim}",
            status,
            severidade,
            clienteId,
            dataCriacaoInicio,
            dataCriacaoFim);

        var alertas = await alertaService.ListarComFiltrosAsync(status, severidade, clienteId, dataCriacaoInicio, dataCriacaoFim);

        return Ok(alertas);
    }

    #endregion

    #region HttpPatch

    [HttpPatch("{id:guid}/iniciar-analise")]
    public async Task<IActionResult> IniciarAnalise(Guid id)
    {
        logger.LogInformation("PATCH /api/alertas/{Id}/iniciar-analise", id);

        try
        {
            var alerta = await alertaService.IniciarAnaliseAsync(id);
            logger.LogInformation("Alerta {Id} movido para Em Análise", id);

            return Ok(alerta);
        }
        catch (KeyNotFoundException ex)
        {
            logger.LogWarning(ex, "Alerta não encontrado: {Id}", id);
            return NotFound(new { message = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            logger.LogWarning(ex, "Erro ao iniciar análise do alerta {Id}", id);
            return BadRequest(new { message = ex.Message });
        }
    }
    
    [HttpPatch("{id:guid}/resolver")]
    public async Task<IActionResult> Resolver(Guid id, [FromBody] ResolverAlertaRequest request)
    {
        logger.LogInformation("PATCH /api/alertas/{Id}/resolver", id);

        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        try
        {
            var alerta = await alertaService.ResolverAsync(id, request);

            logger.LogInformation(
                "Alerta {Id} resolvido por {ResolvidoPor}",
                id,
                request.ResolvidoPor);

            return Ok(alerta);
        }
        catch (KeyNotFoundException ex)
        {
            logger.LogWarning(ex, "Alerta não encontrado: {Id}", id);
            return NotFound(new { message = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            logger.LogWarning(ex, "Erro ao resolver alerta {Id}", id);
            return BadRequest(new { message = ex.Message });
        }
        catch (ArgumentException ex)
        {
            logger.LogWarning(ex, "Dados inválidos ao resolver alerta {Id}", id);
            return BadRequest(new { message = ex.Message });
        }
    }
    #endregion
}