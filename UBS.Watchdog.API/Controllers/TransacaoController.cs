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

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] TransacaoRequest request)
    { 
        return null;
    }

    [HttpGet("cliente/{clienteId:guid}")]
    public async Task<IActionResult> GetByCliente(Guid clienteId)
    {
        return null;
    }
}