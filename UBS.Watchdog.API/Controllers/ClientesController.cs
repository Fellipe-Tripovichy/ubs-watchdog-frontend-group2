using Microsoft.AspNetCore.Mvc;
using UBS.Watchdog.Application.Services;
using UBS.Watchdog.Application.DTOs.Cliente;
using UBS.Watchdog.Domain.Enums;
using System.Runtime.CompilerServices;

namespace UBS.Watchdog.API.Controllers;

[ApiController]
[Route("api/clientes")]
public class ClientesController : ControllerBase
{
    private readonly IClienteService _clienteService;

    public ClientesController(IClienteService clienteService)
    {
        _clienteService = clienteService;
    }
    
    #region API HttpPost

    [HttpPost]
    public async Task<IActionResult> Criar([FromBody] ClienteRequest request)
    {
        var cliente = await _clienteService.CriarAsync(request);
        return CreatedAtAction(nameof(ObterPorId), new { id = cliente.Id }, cliente);
    }

    #endregion

    #region API HttpGet

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> ObterPorId(Guid id)
    {
        var cliente = await _clienteService.ObterPorIdAsync(id);

        if (cliente is null) { return NotFound(); }

        return Ok(cliente);
    }

    [HttpGet]
    public async Task<IActionResult> ListarTodos()
    {
        var clientes = await _clienteService.ListarTodosAsync();
        return Ok(clientes);
    }

    [HttpGet("pais/{pais}")]
    public async Task<IActionResult> ListarPorPais(string pais)
    {
        var clientes = await _clienteService.ListarPorPaisAsync(pais);
        return Ok(clientes);
    }

    [HttpGet("nivel-risco/{nivel}")]
    public async Task<IActionResult> ListarPorNivelRisco(NivelRisco nivel)
    {
        var clientes = await _clienteService.ListarPorNivelRiscoAsync(nivel);
        return Ok(clientes);
    }

    #endregion

    #region HttpPatch

    // [HttpPatch("{id:guid}/kyc")]
    // public async Task<IActionResult> AtualizarKyc(Guid id, AtualizarKycRequest request)
    // {
    //     return null;
    // }

    // [HttpPatch("{id:guid}/nivel-risco")] 
    // public async Task<IActionResult> AtualizarNivelRisco(Guid id, AtualizarNivelRisco nivel)
    // {
    //     return null;
    // }

    #endregion

    #region API HttpDelete

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Deletar(Guid id)
    {
        await _clienteService.DeletarAsync(id);
        return NoContent();
    }

    #endregion
}