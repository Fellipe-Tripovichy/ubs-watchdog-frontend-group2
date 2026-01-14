using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.AspNetCore.TestHost;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using UBS.Watchdog.Infrastructure.Data;
using Xunit;

[assembly: CollectionBehavior(DisableTestParallelization = true)]

namespace UBS.Watchdog.Tests;

internal class ApiFactory : WebApplicationFactory<Program>
{
    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.UseEnvironment("Test");
        
        builder.ConfigureTestServices(services =>
        {
            services.RemoveAll(typeof(DbContextOptions<AppDbContext>));
            var connString = GetConnectionString();
            services.AddDbContext<AppDbContext>(options =>
            {
                options.UseNpgsql(
                    connString,
                    npgsqlOptions =>
                    {
                        npgsqlOptions.EnableRetryOnFailure(
                            maxRetryCount: 5,
                            maxRetryDelay: TimeSpan.FromSeconds(30),
                            errorCodesToAdd: null);
                        npgsqlOptions.CommandTimeout(60);
                    });
            });
            
            var dbContext = CreateDbContext(services);
            dbContext.Database.EnsureDeleted();
        });
    }

    private static string? GetConnectionString()
    {
        return "Host=localhost;Port=6000;Database=ubs_watchdog_test;Username=docker_user;Password=docker_password";
    }

    private static AppDbContext CreateDbContext(IServiceCollection services)
    {
        var serviceProvider = services.BuildServiceProvider();
        var scope = serviceProvider.CreateScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        return dbContext;
    }
}