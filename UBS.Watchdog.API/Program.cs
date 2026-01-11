using Microsoft.EntityFrameworkCore;
using Serilog;
using Serilog.AspNetCore;
using Serilog.Sinks;
using UBS.Watchdog.Application.Compliance;
using UBS.Watchdog.Application.Services;
using UBS.Watchdog.Infrastructure.Data;
using UBS.Watchdog.Infrastructure.Repositories;
using UBS.Watchdog.Infrastructure.Repositories.Alertas;
using UBS.Watchdog.Infrastructure.Repositories.Clientes;
using UBS.Watchdog.Infrastructure.Repositories.Transacoes;

var builder = WebApplication.CreateBuilder(args);

// TODO: CONFIGURAR SERILOG
//Log.Logger = new LoggerConfiguration()
//	.MinimumLevel.Information()
//	.MinimumLevel.Override("Microsoft.EntityFrameworkCore", Serilog.Events.LogEventLevel.Warning)
//	.Enrich.FromLogContext()
//	.WriteTo.Console()
//	.WriteTo.File("logs/financial-compliance-.log", rollingInterval: RollingInterval.Day)
//	.CreateLogger();

//builder.Host.UseSerilog();

// Add services to the container.
#region Services
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
	c.SwaggerDoc("v1", new()
	{
		Title = "UBS Watchdog API - Grupo 2",
		Version = "v1",
		Description = "API para sistema de compliance financeiro - Detec��o de transa��es suspeitas",
		Contact = new()
		{
			Name = "Grupo 2",
		}
	});
});

builder.Services.AddScoped<IClienteRepository, ClienteRepository>();
builder.Services.AddScoped<ITransacaoRepository, TransacaoRepository>();
builder.Services.AddScoped<IAlertaRepository, AlertaRepository>();

builder.Services.AddScoped<IClienteService, ClienteService>();
builder.Services.AddScoped<ITransacaoService, TransacaoService>();
builder.Services.AddScoped<IAlertaService, AlertaService>();
builder.Services.AddScoped<IReportService, ReportService>();
builder.Services.AddScoped<IComplianceService, ComplianceService>();

builder.Services.AddScoped<IRegraCompliance, RegraLimiteDiario>();
builder.Services.AddScoped<IRegraCompliance, RegraPaisAltoRisco>();
#endregion

#region DbContext
builder.Services.AddDbContext<AppDbContext>(options =>
{
    options.UseNpgsql(
        builder.Configuration.GetConnectionString("DefaultConnection"),
        npgsqlOptions =>
        {
            npgsqlOptions.EnableRetryOnFailure(
                maxRetryCount: 5,
                maxRetryDelay: TimeSpan.FromSeconds(30),
                errorCodesToAdd: null);

            npgsqlOptions.CommandTimeout(60);
        });

    if (builder.Environment.IsDevelopment())
    {
        options.EnableSensitiveDataLogging();
        options.EnableDetailedErrors();
    }
});
#endregion


var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
	app.UseSwagger();
	app.UseSwaggerUI();
	// Executando migração automaticamente
	//using var scope =  app.Services.CreateScope();
	//var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
	//dbContext.Database.Migrate();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
