using System.Net.Http.Json;
using FluentAssertions;
using UBS.Watchdog.Application.DTOs.Alerta;
using UBS.Watchdog.Application.DTOs.Cliente;
using UBS.Watchdog.Application.DTOs.Transacao;
using UBS.Watchdog.Domain.Entities;
using UBS.Watchdog.Domain.Enums;

namespace UBS.Watchdog.Tests;

public class Utils
{
    private readonly ApiFactory _factory;
    private readonly HttpClient _client;
    
    public Utils()
    {
        _factory = new ApiFactory();
        _client = _factory.CreateClient();
    }
    
    public async Task<ClienteResponse> CriarCliente()
    {
        var novoCliente = new ClienteRequest()
        {
            Nome = "Tester",
            Pais = "Brasil",
            NivelRisco = "Baixo"
        };
        
        var response = await _client.PostAsJsonAsync("/api/clientes", novoCliente);
        response.EnsureSuccessStatusCode();
        
        var cliente = await response.Content.ReadFromJsonAsync<ClienteResponse>();
        cliente.Should().NotBeNull();
        
        return cliente;
    }
    
    public async Task<AlertaResponse> ObterUmAlerta()
    {
        var response = await _client.GetAsync("/api/alertas");
        response.EnsureSuccessStatusCode();

        List<AlertaResponse>? content = await response.Content.ReadFromJsonAsync<List<AlertaResponse>>();
        content.Should().NotBeNull();
        
        return content[0];
    }

    public async Task<TransacaoResponse> ObterTransacao()
    {
        ClienteResponse cliente = await CriarCliente();
        ClienteResponse contraparte = await CriarCliente();
        TransacaoRequest request = new TransacaoRequest()
        {
            ClienteId =  cliente.Id,
            Tipo = TipoTransacao.Transferencia,
            Valor = 10,
            Moeda = Moeda.USD,
            ContraparteId = contraparte.Id
        };

        var response = await _client.PostAsJsonAsync("api/transacoes", request);
        response.EnsureSuccessStatusCode();
        
        var content = await response.Content.ReadFromJsonAsync<TransacaoResponse>();
        content.Should().NotBeNull();
        
        return content;
    }
}
