using Microsoft.AspNetCore.Mvc;
using UBS.Watchdog.Application.DTOs.Cliente;
using UBS.Watchdog.Domain.Enums;


namespace UBS.Watchdog.API.Controllers;

[ApiController]
[Route("api/{controller}")]
public class ClienteController : ControllerBase
{
    private readonly ClienteService _clienteService;

    //TODO: passar o service quando estiver pronto
    public ClienteController(ClienteService clienteService)
    {
        _clienteService = clienteService;
    }

    [HttpPost (Name = "CriarCliente")]
    public async Task<IActionResult> Create([FromBody] ClienteRequest request)
    {
        return Created("", await _clienteService.CriarAsync(request));
    }

    [HttpGet("{id:guid}", Name = "ObterCliente")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var cliente = await _clienteService.ObterPorIdAsync(id);
        if (cliente == null) return NotFound($"Cliente com ID '{id}' não existe.");
        return Ok(cliente);
    }

    [HttpGet(Name = "ObterTodosClientes")]
    public async Task<IActionResult> GetAll()
    {
        return Ok(await _clienteService.ListarTodosAsync());
    }

    [HttpGet("pais/{pais:string}", Name = "ObterClientesDeUmPaís")]
    public async Task<IActionResult> GetByPais(string pais)
    {
        return Ok(await _clienteService.ListarPorPaisAsync(pais));
    }

    [HttpGet("risco/{nivelRisco:NivelRisco}", Name =  "ObterTodosPorNivelRisco")]
    public async Task<IActionResult> GetByNivelRisco(NivelRisco nivelRisco)
    {
        return Ok(await _clienteService.ListarPorNivelRiscoAsync(nivelRisco));
    }

    [HttpDelete("{id:guid}", Name = "RemoverCliente")]
    public async Task<IActionResult> DeleteById(Guid id)
    {
        if (_clienteService.ObterPorIdAsync(id) == null) return NotFound($"Cliente com ID '{id}' não existe.");
        await _clienteService.DeletarAsync(id);
        return NoContent();
    }
}