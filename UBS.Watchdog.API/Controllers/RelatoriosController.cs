using Microsoft.AspNetCore.Mvc;
using UBS.Watchdog.Application.Services;


[ApiController]
[Route("api/relatorios")]
public class RelatoriosController : ControllerBase
{
    private readonly IReportService _reportService;

    public RelatoriosController(IReportService relatorioService)
    {
        _reportService = relatorioService;
    }

    #region HttpGet

    [HttpGet("clientes/{id:guid}")]
    public async Task<IActionResult> GerarPorCliente(
        [FromRoute] Guid id,
        [FromQuery] DateTime? dataInicio,
        [FromQuery] DateTime? dataFim)
    {
        var relatorio = await _reportService.GerarRelatorioClienteAsync(id, dataInicio, dataFim);

        return Ok(relatorio);
    }

    #endregion
}
