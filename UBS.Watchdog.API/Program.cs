using Serilog;
using Serilog.Sinks;
using Serilog.AspNetCore;
using UBS.Watchdog.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

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
		Description = "API para sistema de compliance financeiro - Detecção de transações suspeitas",
		Contact = new()
		{
			Name = "Grupo 2",
		}
	});
});
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
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
