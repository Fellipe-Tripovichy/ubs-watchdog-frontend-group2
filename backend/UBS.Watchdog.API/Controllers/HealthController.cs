using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using UBS.Watchdog.Infrastructure.Data;

namespace UBS.Watchdog.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class HealthController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly ILogger<HealthController> _logger;

    public HealthController(AppDbContext context, ILogger<HealthController> logger)
    {
        _context = context;
        _logger = logger;
    }

    /// <summary>
    /// Verifica a saúde da aplicação e conexão com banco de dados
    /// </summary>
    /// <returns>Status da aplicação</returns>
    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status503ServiceUnavailable)]
    public async Task<IActionResult> Get()
    {
        try
        {
            var canConnect = await _context.Database.CanConnectAsync();
            var pendingMigrations = await _context.Database.GetPendingMigrationsAsync();

            var response = new
            {
                status = "healthy",
                database = canConnect ? "connected" : "disconnected",
                pendingMigrations = pendingMigrations.Count(),
                timestamp = DateTime.UtcNow
            };

            _logger.LogInformation("Health check executado com sucesso");

            return Ok(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Health check falhou");

            return StatusCode(503, new
            {
                status = "unhealthy",
                error = ex.Message,
                timestamp = DateTime.UtcNow
            });
        }
    }
}

