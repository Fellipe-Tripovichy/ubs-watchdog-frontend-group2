using Microsoft.AspNetCore.Mvc;
using UBS.Watchdog.Application.DTOs.Transacao;

namespace UBS.Watchdog.API.Controllers;

[ApiController]
[Route("api/{controller}")]
public class TransacaoController : ControllerBase
{
    //TODO: passar TransacaoService
    private readonly TransacaoService _transacaoService;

    public TransacaoController(TransacaoService transacaoService)
    {
        _transacaoService = transacaoService;
    }

    [HttpPost (Name = "CriarTransacao")]
    public async Task<IActionResult> Create([FromBody] TransacaoRequest request)
    { 
        return Created("", await _transacaoService.RegistrarAsync(request));
    }

    [HttpGet ("{id:guid}", Name = "ObterTransacaoPorID")]
    public async Task<IActionResult> GetByID(Guid id)
    {
        var transacao = _transacaoService.ObterPorIdAsync(id);
        if (transacao == null) return NotFound($"Transação com ID '{id}' não existe.");
        return Ok(transacao);
    }

    [HttpGet (Name = "ObterTodasTransacoes")]
    public async Task<IActionResult> GetAll()
    {
        return Ok(_transacaoService.ListarTodasAsync());
    }
    
    [HttpGet("cliente/{clienteId:guid}", Name = "ObterTodasTransacoesPorCliente")]
    public async Task<IActionResult> GetByCliente(Guid clienteId)
    {
        return Ok(_transacaoService.ListarPorClienteIdAsync(clienteId));
    }
}