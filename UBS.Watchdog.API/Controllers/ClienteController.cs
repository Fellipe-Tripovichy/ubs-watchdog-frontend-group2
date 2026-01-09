using Microsoft.AspNetCore.Mvc;
using UBS.Watchdog.Application.DTOs.Cliente;


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

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] ClienteRequest request)
    {
        return null;
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        return null;
    }
}