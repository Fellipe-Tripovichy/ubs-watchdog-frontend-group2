using System.Net.Http.Json;
using FluentAssertions;
using UBS.Watchdog.Application.DTOs.Cliente;
using UBS.Watchdog.Domain.Enums;
using Xunit;

namespace UBS.Watchdog.Tests.Tests;

public class RelatoriosControllerTests
{
    private readonly ApiFactory _factory;
    private readonly HttpClient _client;
    private readonly Utils _utils;

    public RelatoriosControllerTests()
    {
        _factory = new ApiFactory();
        _client = _factory.CreateClient();
        _utils = new Utils();
    }

    [Fact]
    public async Task GerarPorClienteTeste()
    {
        ClienteResponse cliente = await _utils.CriarCliente();
        
        var response = await _client.GetAsync($"api/relatorios/cliente/{cliente.Id}");
        response.EnsureSuccessStatusCode();

        var content = await response.Content.ReadFromJsonAsync<RelatorioClienteResponse>();
        content.Should().NotBeNull();
    }

    [Fact]
    public async Task FiltrarTeste()
    {
        StatusKyc status = StatusKyc.Pendente;
        string pais = "Brasil";
        
        var response = await _client.GetAsync($"api/relatorios/filtrar?StatusKyc={status}&pais={pais}");
        response.EnsureSuccessStatusCode();

        var content = await response.Content.ReadFromJsonAsync<List<RelatorioClienteResponse>>();
        content.Should().NotBeNull();
        content.Should().HaveCountGreaterThan(0);
    }
}