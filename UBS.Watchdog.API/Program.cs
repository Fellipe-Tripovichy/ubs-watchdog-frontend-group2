using Microsoft.EntityFrameworkCore;
using Serilog;
using Serilog.AspNetCore;
using Serilog.Sinks;
using System.Text.Json.Serialization;
using UBS.Watchdog.Application.Compliance;
using UBS.Watchdog.Application.Services;
using UBS.Watchdog.Infrastructure.Data;
using UBS.Watchdog.Infrastructure.Repositories;
using UBS.Watchdog.Infrastructure.Repositories.Alertas;
using UBS.Watchdog.Infrastructure.Repositories.Clientes;
using UBS.Watchdog.Infrastructure.Repositories.Transacoes;

var builder = WebApplication.CreateBuilder(args);

#region SERILOG
Log.Logger = new LoggerConfiguration()
    .MinimumLevel.Information()
    .MinimumLevel.Override("Microsoft.EntityFrameworkCore", Serilog.Events.LogEventLevel.Warning)
    .Enrich.FromLogContext()
    .WriteTo.Console()
    .WriteTo.File("logs/financial-compliance-.log", rollingInterval: RollingInterval.Day)
    .CreateLogger();

builder.Host.UseSerilog();
#endregion

#region CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins(
                "http://localhost:3000",
                "http://localhost:5173",
                "http://localhost:5174"
            )
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});
#endregion

#region Services
builder.Services
    .AddControllers()
    .AddJsonOptions(o =>
    {
        o.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
    });
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
#endregion

#region DI
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

#region Auto Migration
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var context = services.GetRequiredService<AppDbContext>();
        Log.Information("Verificando migrations pendentes...");

        var pendingMigrations = context.Database.GetPendingMigrations();
        if (pendingMigrations.Any())
        {
            Log.Information("Aplicando {Count} migrations pendentes", pendingMigrations.Count());
            context.Database.Migrate();
            Log.Information("Migrations aplicadas com sucesso!");
        }
        else
        {
            Log.Information("Nenhuma migration pendente");
        }

        // TODO: Seed data
        await DbSeeder.SeedAsync(context);
    }
    catch (Exception ex)
    {
        Log.Error(ex, "Erro ao aplicar migrations");
        throw;
    }
}
#endregion

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "UBS Watchdog API V1");
        c.RoutePrefix = "swagger";
    });
}

app.UseSerilogRequestLogging();

app.UseHttpsRedirection();

app.UseCors("AllowFrontend");

app.UseAuthorization();

app.MapControllers();

Log.Information("Iniciando UBS Watchdog API...");
Log.Information("Environment: {Environment}", app.Environment.EnvironmentName);
Log.Information("Swagger: http://localhost:5433");

try
{
    app.Run();
}
catch (Exception ex)
{
    Log.Fatal(ex, "Aplicação falhou ao iniciar");
}
finally
{
    Log.CloseAndFlush();
}