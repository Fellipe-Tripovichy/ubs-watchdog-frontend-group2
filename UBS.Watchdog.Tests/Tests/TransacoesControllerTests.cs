using System.Net;
using System.Net.Http.Json;
using FluentAssertions;
using UBS.Watchdog.Application.DTOs.Cliente;
using UBS.Watchdog.Application.DTOs.Transacao;
using UBS.Watchdog.Domain.Enums;
using Xunit;

namespace UBS.Watchdog.Tests.Tests;

public class TransacoesControllerTests
{
    private readonly ApiFactory _factory;
    private readonly HttpClient _client;
    private readonly Utils _utils;

    public TransacoesControllerTests()
    {
        _factory = new ApiFactory();
        _client = _factory.CreateClient();
        _utils = new Utils();
    }

    [Fact]
    public async Task RegistrarTeste()
    {
        ClienteResponse cliente = await _utils.CriarCliente();
        TransacaoRequest request = new TransacaoRequest()
        {
            ClienteId =  cliente.Id,
            Tipo = TipoTransacao.Saque,
            Valor = 10,
            Moeda = Moeda.USD,
            ContraparteId = null
        };

        var response = await _client.PostAsJsonAsync("api/transacoes", request);
        response.EnsureSuccessStatusCode();

        var content = await response.Content.ReadFromJsonAsync<TransacaoResponse>();
        content.Should().NotBeNull();
        Assert.Equal(request.ClienteId, content.ClienteId);
    }

    [Fact]
    public async Task RegistrarErrorTeste()
    {
        TransacaoRequest request = new TransacaoRequest()
        {
            ClienteId = new Guid(),
            Tipo = TipoTransacao.Transferencia,
            Valor = 10,
            Moeda = Moeda.USD,
            ContraparteId = new Guid()
        };
        
        var response = await _client.PostAsJsonAsync("api/transacoes", request);
        Assert.Equal(response.StatusCode, HttpStatusCode.NotFound);
        
        response = await _client.PostAsJsonAsync("api/transacoes", request.ContraparteId);
        Assert.Equal(response.StatusCode, HttpStatusCode.BadRequest);
    }
    
    [Fact]
    public async Task ListarTodasTeste()
    {
        var response =  await _client.GetAsync("api/transacoes");
        response.EnsureSuccessStatusCode();
        var content = await response.Content.ReadFromJsonAsync<List<TransacaoResponse>>();
        content.Should().NotBeNull();
        content.Count.Should().BeGreaterThan(0);
    }

    [Fact]
    public async Task ObterPorIdTeste()
    {
        TransacaoResponse transacao = await _utils.ObterTransacao();
        
        var response = await _client.GetAsync($"api/transacoes/{transacao.Id}");
        response.EnsureSuccessStatusCode();
        
        var content = await response.Content.ReadFromJsonAsync<TransacaoResponse>();
        content.Should().NotBeNull();
        Assert.Equal(transacao.Id, content.Id);
    }

    [Fact]
    public async Task ObterPorIdErrorTeste()
    {
        Guid id = Guid.NewGuid();
        
        var response = await _client.GetAsync($"api/transacoes/{id}");
        Assert.Equal(response.StatusCode, HttpStatusCode.NotFound);
    }
    
    [Fact]
    public async Task ListarComFiltrosTeste()
    {
        TipoTransacao tipo = TipoTransacao.Saque;
        
        var response = await _client.GetAsync($"api/transacoes/filtrar?tipo={tipo}");
        response.EnsureSuccessStatusCode();

        var content = await response.Content.ReadFromJsonAsync<List<TransacaoResponse>>();
        content.Should().NotBeNull();
    }

    [Fact]
    public async Task ListarPorClienteTeste()
    {
        ClienteResponse cliente = await _utils.CriarCliente();
        
        var response = await _client.GetAsync($"api/transacoes/clientes/{cliente.Id}");
        response.EnsureSuccessStatusCode();
        
        var content = await response.Content.ReadFromJsonAsync<List<TransacaoResponse>>();
        content.Should().NotBeNull();
    }
    
}