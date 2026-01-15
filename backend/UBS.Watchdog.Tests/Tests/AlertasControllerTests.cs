using System.Net;
using System.Net.Http.Json;
using FluentAssertions;
using UBS.Watchdog.Application.DTOs.Alerta;
using UBS.Watchdog.Application.DTOs.Cliente;
using UBS.Watchdog.Domain.Enums;
using Xunit;

namespace UBS.Watchdog.Tests.Tests;

public class AlertasControllerTests
{
    private readonly ApiFactory _factory;
    private readonly HttpClient _client;
    private readonly Utils _utils;
    
    public AlertasControllerTests()
    {
        _factory = new ApiFactory();
        _client = _factory.CreateClient();
        _utils = new Utils();
    }

    [Fact]
    public async Task ListarTodosTeste()
    {
        var response = await _client.GetAsync("/api/alertas");
        response.EnsureSuccessStatusCode();

        var content = await response.Content.ReadFromJsonAsync<List<AlertaResponse>>();
        content.Should().NotBeNull();
    }

    [Fact]
    public async Task ObterPorIdTeste()
    {
        AlertaResponse alerta = await _utils.ObterUmAlerta();
        
        var response = await _client.GetAsync($"/api/alertas/{alerta.Id}");
        response.EnsureSuccessStatusCode();

        var content = await response.Content.ReadFromJsonAsync<AlertaResponse>();
        content.Should().NotBeNull();
        Assert.Equal(alerta.Id, content.Id);
    }

    [Fact]
    public async Task ObterPorIdNotFound()
    {
        Guid id = Guid.NewGuid();
        
        var response = await _client.GetAsync($"/api/alertas/{id}");
        Assert.Equal(response.StatusCode, HttpStatusCode.NotFound);
    }
    
    [Fact]
    public async Task ListarPorClienteTeste()
    {
        ClienteResponse cliente = await _utils.CriarCliente();
        
        var response = await _client.GetAsync($"/api/alertas/cliente/{cliente.Id}");
        response.EnsureSuccessStatusCode();

        var content = await response.Content.ReadFromJsonAsync<List<AlertaResponse>>();
        content.Should().NotBeNull();
    }
    
    [Fact]
    public async Task ListarPorStatusTeste()
    {
        StatusAlerta status = StatusAlerta.Novo;
        
        var response = await _client.GetAsync($"/api/alertas/status/{status}");
        response.EnsureSuccessStatusCode();

        var content = await response.Content.ReadFromJsonAsync<List<AlertaResponse>>();
        content.Should().NotBeNull();
    }

    [Fact]
    public async Task ListarComFiltros()
    {
        StatusAlerta status =  StatusAlerta.Novo;
        SeveridadeAlerta severidade = SeveridadeAlerta.Alta;
        
        var response = await _client.GetAsync($"/api/alertas/filtrar?status={status}&severidade={severidade}");
        response.EnsureSuccessStatusCode();
        
        var content = await response.Content.ReadFromJsonAsync<List<AlertaResponse>>();
        content.Should().NotBeNull();
    }

    [Fact]
    public async Task IniciarAnaliseTeste()
    {
        AlertaResponse alerta = await _utils.ObterUmAlerta();
        
        var response = await _client.PatchAsJsonAsync($"/api/alertas/{alerta.Id}/iniciar-analise", alerta.Id);
        response.EnsureSuccessStatusCode();

        var content = await response.Content.ReadFromJsonAsync<AlertaResponse>();
        content.Should().NotBeNull();
    }

    [Fact]
    public async Task IniciarAnaliseErrorTeste()
    {
        Guid id = Guid.NewGuid();
        
        var response = await _client.PatchAsJsonAsync($"/api/alertas/{id}/iniciar-analise", id);
        Assert.Equal(response.StatusCode, HttpStatusCode.NotFound);
    }
    
    [Fact]
    public async Task ResolverTeste()
    {
        AlertaResponse alerta = await _utils.ObterUmAlerta();
        ResolverAlertaRequest request = new ResolverAlertaRequest()
        {
            ResolvidoPor = "Thales",
            Resolucao = "Força de vontade"
        };
        
        var response = await _client.PatchAsJsonAsync($"/api/alertas/{alerta.Id}/resolver", request);
        response.EnsureSuccessStatusCode();

        var content =  await response.Content.ReadFromJsonAsync<AlertaResponse>();
        content.Should().NotBeNull();
    }

    [Fact]
    public async Task ResolverErrorTeste()
    {
        Guid id = Guid.NewGuid();
        ResolverAlertaRequest request = new ResolverAlertaRequest()
        {
            ResolvidoPor = "",
            Resolucao = ""
        };
        
        var response = await _client.PatchAsJsonAsync($"/api/alertas/{id}/resolver", request);
        Assert.Equal(response.StatusCode, HttpStatusCode.BadRequest);

        request.ResolvidoPor = "Thales";
        request.Resolucao = "Análise de cliente.";
        
        response = await _client.PatchAsJsonAsync($"/api/alertas/{id}/resolver", request);
        Assert.Equal(response.StatusCode, HttpStatusCode.NotFound);
    }
    
}