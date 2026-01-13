using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Serilog.Core;
using System.Net.NetworkInformation;
using UBS.Watchdog.Application.DTOs.Transacao;
using UBS.Watchdog.Application.Services;
using UBS.Watchdog.Domain.Enums;

namespace UBS.Watchdog.API.Controllers;

[ApiController]
[Route("api/transacoes")]
public class TransacoesController(ITransacaoService _transacaoService, ILogger<TransacoesController> _logger) : ControllerBase
{

    #region HttpPost

    [HttpPost]
    public async Task<IActionResult> Registrar([FromBody] TransacaoRequest request)
    {
        _logger.LogInformation(
            "POST /api/transacoes - Registrando transação: Cliente {ClienteId}, Tipo {Tipo}, Valor {Valor}",
            request.ClienteId,
            request.Tipo,
            request.Valor);

        if (!ModelState.IsValid)
        {
            _logger.LogWarning("Dados inválidos ao registrar transação");
            return BadRequest(ModelState);
        }
        try
        {
            var transacao = await _transacaoService.RegistrarAsync(request);

            _logger.LogInformation(
                "Transação registrada: {Id}. Alertas gerados: {QuantidadeAlertas}",
                transacao.Id,
                transacao.QuantidadeAlertas);

            if (transacao.QuantidadeAlertas > 0)
            {
                _logger.LogWarning(
                    "Transação {Id} gerou {QuantidadeAlertas} alerta(s) de compliance",
                    transacao.Id,
                    transacao.QuantidadeAlertas);
            }

            return CreatedAtAction(
                nameof(ObterPorId),
                new { transacaoId = transacao.Id },
                transacao
            );
        }
        catch (KeyNotFoundException ex)
        {
            _logger.LogWarning(ex, "Cliente não encontrado ao registrar transação");
            return NotFound(new { message = ex.Message });
        }
        catch (ArgumentException ex)
        {
            _logger.LogWarning(ex, "Erro de validação ao registrar transação");
            return BadRequest(new { message = ex.Message });
        }
    }

    #endregion

    #region HttpGet

    [HttpGet]
    public async Task<IActionResult> ListarTodas()
    {
        _logger.LogInformation("GET /api/transacoes - Listando todas as transações");
        var transacoes = await _transacaoService.ListarTodasAsync();
        return Ok(transacoes);
    }

    [HttpGet("{transacaoId:guid}")]
    public async Task<IActionResult> ObterPorId([FromRoute] Guid transacaoId)
    {
        _logger.LogInformation("GET /api/transacoes/{Id}", transacaoId);
        var transacao = await _transacaoService.ObterPorIdAsync(transacaoId);

        if (transacao == null)
        {
            _logger.LogWarning("Transação {Id} não encontrada", transacaoId);
            return NotFound(new { message = $"Transação {transacaoId} não encontrada" });
        }

        return Ok(transacao);
    }

    [HttpGet]
    public async Task<IActionResult> ListarComFiltros(
        [FromQuery] Guid? clienteId = null,
        [FromQuery] DateTime? dataInicio = null,
        [FromQuery] DateTime? dataFim = null,
        [FromQuery] string? moeda = null,
        [FromQuery] TipoTransacao? tipo = null)
    {
        _logger.LogInformation(
            "GET /api/transacoes/filtrar?clienteID={clienteId}&dataInicio={dataInicio}&dataFim={dataFim}&moeda={moeda}&tipo={tipo}",
            clienteId,
            dataInicio,
            dataFim,
            moeda,
            tipo);

        var transacoes = await _transacaoService.ListarComFiltrosAsync(
            clienteId,
            dataInicio,
            dataFim,
            moeda,
            tipo);

        return Ok(transacoes);
    }

    [HttpGet("clientes/{clienteId:guid}")]
    public async Task<IActionResult> ListarPorCliente(
        [FromRoute] Guid clienteId,
        [FromQuery] DateTime? dataInicio,
        [FromQuery] DateTime? dataFim)
    {
        _logger.LogInformation(
            "GET /api/transacoes/cliente/{ClienteId}?dataInicio={DataInicio}&dataFim={DataFim}",
            clienteId,
            dataInicio,
            dataFim);
        try
        {
            var transacoes = await _transacaoService.ListarPorClienteIdAsync(
                        clienteId,
                        dataInicio,
                        dataFim);

            return Ok(transacoes);
        }
        catch (KeyNotFoundException ex)
        {
            _logger.LogWarning(ex, "Cliente não encontrado: {ClienteId}", clienteId);
            return NotFound(new { message = ex.Message });
        }

    }
    #endregion
}