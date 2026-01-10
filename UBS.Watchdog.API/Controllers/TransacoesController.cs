using Microsoft.AspNetCore.Mvc;
using UBS.Watchdog.Application.Services;
using UBS.Watchdog.Application.DTOs.Transacao;

namespace UBS.Watchdog.API.Controllers;

[ApiController]
[Route("api/transacoes")]
public class TransacoesController : ControllerBase
{
    private readonly ITransacaoService _transacaoService;

    public TransacoesController(ITransacaoService transacaoService)
    {
        _transacaoService = transacaoService;
    }

    #region HttpPost

    [HttpPost]
    public async Task<IActionResult> Registrar([FromBody] TransacaoRequest request)
    {
        var transacao = await _transacaoService.RegistrarAsync(request);
        return CreatedAtAction(nameof(ObterPorId),
            new { transacaoId = transacao.Id },
            transacao);
    }

    #endregion

    #region HttpGet

    [HttpGet]
    public async Task<IActionResult> ListarTodas()
    {
        var transacoes = await _transacaoService.ListarTodasAsync();
        return Ok(transacoes);
    }

    [HttpGet("{transacaoId:guid}")]
    public async Task<IActionResult> ObterPorId([FromRoute] Guid transacaoId)
    {
        var transacao = await _transacaoService.ObterPorIdAsync(transacaoId);

        if (transacao == null) { return NotFound(); }

        return Ok(transacao);
    }

    [HttpGet("clientes/{clienteId:guid}")]
    public async Task<IActionResult> ListarPorCliente(
        [FromRoute] Guid clienteId,
        [FromQuery] DateTime? dataInicio,
        [FromQuery] DateTime? dataFim)
    {
        var transacoes = await _transacaoService.ListarPorClienteIdAsync(clienteId, dataInicio, dataFim);

        return Ok(transacoes);
    }

    #endregion
}