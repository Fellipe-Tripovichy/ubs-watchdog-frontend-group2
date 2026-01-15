
using System.Net;
using System.Net.Http.Json;
using FluentAssertions;
using UBS.Watchdog.Application.DTOs.Cliente;
using UBS.Watchdog.Domain.Enums;
using Xunit;

namespace UBS.Watchdog.Tests.Tests;

public class ClientesControllerTests
{
    private readonly ApiFactory _factory;
    private readonly HttpClient _client;
    private readonly Utils _utils;
    
    public ClientesControllerTests()
    {
        _factory = new ApiFactory();
        _client = _factory.CreateClient();
        _utils = new Utils();
    }

    [Fact]
    public async Task CriarTeste()
    {
        ClienteRequest novoCliente = new ClienteRequest()
        {
            Nome = "Tester",
            Pais = "Brasil",
            NivelRisco = "Baixo"
        };
        var response = await _client.PostAsJsonAsync("/api/clientes", novoCliente);
        response.EnsureSuccessStatusCode();
        
        var content = await response.Content.ReadFromJsonAsync<ClienteResponse>();
        content.Should().NotBeNull();
    }
    
    [Fact]
    public async Task CriarModeloInvalidoTeste()
    {
        ClienteRequest novoCliente = new ClienteRequest()
        {
            Nome = "",
            Pais = "",
            NivelRisco = ""
        };
        var response = await _client.PostAsJsonAsync("/api/clientes", novoCliente);
        Assert.Equal(response.StatusCode, HttpStatusCode.BadRequest);
    }
    
    [Fact]
    public async Task ObterPorIdTeste()
    {
        ClienteResponse cliente = await _utils.CriarCliente();
        
        var response = await _client.GetAsync($"/api/clientes/{cliente.Id}");
        response.EnsureSuccessStatusCode();

        var content = await response.Content.ReadFromJsonAsync<ClienteResponse>();
        content.Should().NotBeNull();
        Assert.Equal(cliente.Id, content.Id);
    }

    [Fact]
    public async Task ObterPorIdNotFoundTeste()
    {
        Guid id = Guid.NewGuid();
        
        var response = await _client.GetAsync($"/api/clientes/{id}");
        Assert.Equal(response.StatusCode, HttpStatusCode.NotFound);
    }
    
    [Fact]
    public async Task ListarTodosTeste()
    {
        var response = await _client.GetAsync("/api/clientes");
        response.EnsureSuccessStatusCode();

        var content = await response.Content.ReadFromJsonAsync<List<ClienteResponse>>();
        content.Should().NotBeNull();
    }
    
    [Fact]
    public async Task ObterPorPaisTeste()
    {
        string pais = "Brasil";
        var response = await _client.GetAsync($"/api/clientes/pais/{pais}");
        response.EnsureSuccessStatusCode();
        var content = await response.Content.ReadFromJsonAsync<List<ClienteResponse>>();
        content.Should().NotBeNull();
    }

    [Fact]
    public async Task ListarPorNivelRiscoTeste()
    {
        string risco = "Baixo";
        var response = await _client.GetAsync($"/api/clientes/nivel-risco/{risco}");
        response.EnsureSuccessStatusCode();
        var content = await response.Content.ReadFromJsonAsync<List<ClienteResponse>>();
        content.Should().NotBeNull();
    }

    [Fact]
    public async Task AtualizarStatusKycTeste()
    {
        ClienteResponse cliente = await _utils.CriarCliente();
        var requestData = new AtualizarStatusKycRequest()
        {
            NovoStatus = StatusKyc.Aprovado
        };
        
        var response = await _client.PatchAsJsonAsync($"/api/clientes/{cliente.Id}/kyc", requestData);
        response.EnsureSuccessStatusCode();
        
        var content = await response.Content.ReadFromJsonAsync<ClienteResponse>();
        content.Should().NotBeNull();
    }

    [Fact]
    public async Task AtualizarStatusKycErrorTeste()
    {
        Guid id = new Guid();
        
        var request_status = new AtualizarStatusKycRequest()
        {
            NovoStatus = StatusKyc.Aprovado
        };
        
        var response = await _client.PatchAsJsonAsync($"/api/clientes/{id}/kyc", request_status);
        Assert.Equal(response.StatusCode, HttpStatusCode.NotFound);
        
        response = await _client.PatchAsJsonAsync($"/api/clientes/{id}/kyc", id);
        Assert.Equal(response.StatusCode, HttpStatusCode.BadRequest);
    }
    
    [Fact]
    public async Task AtualizarNivelRiscoTeste()
    {
        ClienteResponse cliente = await _utils.CriarCliente();
        var requestData = new AtualizarNivelRiscoRequest()
        {
            NovoNivel = NivelRisco.Alto
        };
        
        var response = await _client.PatchAsJsonAsync(
            $"/api/clientes/{cliente.Id}/nivel-risco", requestData);
        response.EnsureSuccessStatusCode();
        
        var content = await response.Content.ReadFromJsonAsync<ClienteResponse>();
        content.Should().NotBeNull();
    }

    [Fact]
    public async Task AtualizarNivelRiscoErrorTeste()
    {
        Guid id = Guid.NewGuid();
        var requestData = new AtualizarNivelRiscoRequest()
        {
            NovoNivel = NivelRisco.Alto
        };
        
        var response = await _client.PatchAsJsonAsync($"/api/clientes/{id}/nivel-risco", requestData);
        Assert.Equal(response.StatusCode, HttpStatusCode.NotFound);
        
        response = await _client.PatchAsJsonAsync($"/api/clientes/{id}/nivel-risco", id);
        Assert.Equal(response.StatusCode, HttpStatusCode.BadRequest);
    }
    
    [Fact]
    public async Task DeletarTeste()
    {
        ClienteResponse cliente = await _utils.CriarCliente();
        
        var response = await _client.DeleteAsync($"/api/clientes/{cliente.Id}");
        response.EnsureSuccessStatusCode();
        
        var content = await response.Content.ReadAsStringAsync();
        content.Should().BeNullOrWhiteSpace();
    }
    
}