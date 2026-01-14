using Microsoft.AspNetCore.Mvc;
using UBS.Watchdog.Application.DTOs.Cliente;
using UBS.Watchdog.Application.Services;
using UBS.Watchdog.Domain.Entities;
using UBS.Watchdog.Domain.Enums;

namespace UBS.Watchdog.API.Controllers;

[ApiController]
[Route("api/relatorios")]
public class RelatoriosController(IReportService _reportService, ILogger<RelatoriosController> _logger) : ControllerBase
{
    #region HttpGet

    [HttpGet("cliente/{id:guid}")]
    public async Task<ActionResult<RelatorioClienteResponse>> GerarPorCliente(
        [FromRoute] Guid id,
        [FromQuery] DateTime? dataInicio,
        [FromQuery] DateTime? dataFim)
    {
        _logger.LogInformation(
            "GET /api/relatorios/cliente/{Id}?dataInicio={DataInicio}&dataFim={DataFim}",
            id,
            dataInicio,
            dataFim);

        if (dataInicio.HasValue && dataFim.HasValue && dataInicio > dataFim)
        {
            _logger.LogWarning("Período inválido: Data inicial não pode ser maior que data final");
            return BadRequest(new { message = "Data inicial não pode ser maior que data final" });
        }

        try
        {
            var relatorio = await _reportService.GerarRelatorioClienteAsync(
                id,
                dataInicio,
                dataFim);

            _logger.LogInformation(
                "Relatório gerado para cliente {Id}: {TotalTransacoes} transações, {TotalAlertas} alertas",
                id,
                relatorio.TotalTransacoes,
                relatorio.TotalAlertas);

            return Ok(relatorio);
        }
        catch (KeyNotFoundException ex)
        {
            _logger.LogWarning(ex, "Cliente não encontrado: {Id}", id);
            return NotFound(new { message = ex.Message });
        }
    }

    [HttpGet ("filtrar")]
    public async Task<ActionResult<RelatorioClienteResponse>> Filtrar(
        [FromQuery] StatusAlerta? statusAlerta = null,
        [FromQuery] StatusKyc? statusKyc = null,
        [FromQuery] string? pais = null
        )
    {
        _logger.LogInformation("GET /api/relatorios/filtrar - Listando relatórios filtrados.");

        var relatorios = await _reportService.ListarFiltrados(statusAlerta, statusKyc, pais);
        return Ok(relatorios);
    }
    
    #endregion
}