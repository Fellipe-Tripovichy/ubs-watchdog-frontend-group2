using Microsoft.AspNetCore.Mvc;
using UBS.Watchdog.Application.Services;
using UBS.Watchdog.Application.DTOs.Cliente;
using UBS.Watchdog.Domain.Enums;
using System.Runtime.CompilerServices;

namespace UBS.Watchdog.API.Controllers;

[ApiController]
[Route("api/clientes")]
public class ClientesController(IClienteService clienteService, ILogger<ClientesController> logger) : ControllerBase
{
    #region API HttpPost
    [HttpPost]
    public async Task<ActionResult<ClienteResponse>> Criar([FromBody] ClienteRequest request)
    {
        logger.LogInformation("POST /api/clientes - Criando cliente: {Nome}", request.Nome);

        if (!ModelState.IsValid)
        {
            logger.LogWarning("Dados inválidos ao criar cliente");
            return BadRequest(ModelState);
        }
        try
        {
            var cliente = await clienteService.CriarAsync(request);

            logger.LogInformation("Cliente criado com sucesso: {Id}", cliente.Id);
            return CreatedAtAction(nameof(ObterPorId), new { id = cliente.Id }, cliente);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Erro ao criar cliente");
            return StatusCode(500, new { message = $"Erro ao criar cliente: {ex.Message}" });
        }
    }

    #endregion

    #region API HttpGet

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> ObterPorId(Guid id)
    {
        logger.LogInformation("GET /api/clientes/{Id} - Buscando cliente", id);
        var cliente = await clienteService.ObterPorIdAsync(id);

        if (cliente is null)
        {
            logger.LogWarning("Cliente {Id} não encontrado", id);
            return NotFound(new { message = $"Cliente {id} não encontrado" });
        }

        return Ok(cliente);
    }

    [HttpGet]
    public async Task<IActionResult> ListarTodos()
    {
        logger.LogInformation("GET /api/clientes - Listando todos os clientes");
        var clientes = await clienteService.ListarTodosAsync();
        return Ok(clientes);
    }

    [HttpGet("pais/{pais}")]
    public async Task<IActionResult> ListarPorPais(string pais)
    {
        logger.LogInformation("GET /api/clientes/pais/{Pais}", pais);
        var clientes = await clienteService.ListarPorPaisAsync(pais);
        return Ok(clientes);
    }

    [HttpGet("nivel-risco/{nivel}")]
    public async Task<IActionResult> ListarPorNivelRisco(NivelRisco nivel)
    {
        logger.LogInformation("GET /api/clientes/nivel-risco/{NivelRisco}", nivel);
        var clientes = await clienteService.ListarPorNivelRiscoAsync(nivel);
        return Ok(clientes);
    }

    #endregion

    #region HttpPatch

    [HttpPatch("{id:guid}/kyc")]
    public async Task<ActionResult<ClienteResponse>> AtualizarStatusKyc(
        Guid id,
        [FromBody] AtualizarStatusKycRequest request)
    {
        logger.LogInformation("PATCH /api/clientes/{Id}/kyc - Atualizando status KYC", id);

        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        try
        {
            var cliente = await clienteService.AtualizarStatusKycAsync(id, request);

            logger.LogInformation("Status KYC atualizado: {Id} -> {Status}", id, request.NovoStatus);

            return Ok(cliente);
        }
        catch (KeyNotFoundException ex)
        {
            logger.LogWarning(ex, "Cliente não encontrado ao atualizar KYC: {Id}", id);
            return NotFound(new { message = ex.Message });
        }
    }

    [HttpPatch("{id:guid}/nivel-risco")]
    public async Task<ActionResult<ClienteResponse>> AtualizarNivelRisco(
        Guid id,
        [FromBody] AtualizarNivelRiscoRequest request)
    {
        logger.LogInformation("PATCH /api/clientes/{Id}/nivel-risco", id);

        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        try
        {
            var cliente = await clienteService.AtualizarNivelRiscoAsync(id, request);

            logger.LogInformation("Nível de risco atualizado: {Id} -> {Nivel}", id, request.NovoNivel);

            return Ok(cliente);
        }
        catch (KeyNotFoundException ex)
        {
            logger.LogWarning(ex, "Cliente não encontrado ao atualizar nível de risco: {Id}", id);
            return NotFound(new { message = ex.Message });
        }
    }

    #endregion

    #region API HttpDelete

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Deletar(Guid id)
    {
        logger.LogInformation("DELETE /api/clientes/{Id}", id);

        try
        {
            await clienteService.DeletarAsync(id);
            logger.LogInformation("Cliente deletado: {Id}", id);
            return NoContent();
        }
        catch (Exception ex)
        {
            logger.LogWarning(ex, "Cliente não encontrado ao deletar: {Id}", id);
            return NotFound(new { message = ex.Message });
        }

    }
    #endregion
}