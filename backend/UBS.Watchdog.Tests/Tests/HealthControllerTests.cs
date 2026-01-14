using FluentAssertions;
using Xunit;
using Xunit.Abstractions;

namespace UBS.Watchdog.Tests.Tests;

public class HealthControllerTests
{
    private readonly ApiFactory _factory;
    private readonly HttpClient _client;

    public HealthControllerTests()
    {
        _factory = new ApiFactory();
        _client = _factory.CreateClient();
    }

    [Fact]
    public async Task HealthTest()
    {
        var response = await _client.GetAsync("/api/health");
        response.EnsureSuccessStatusCode();
        
        var responseString = await response.Content.ReadAsStringAsync();
        responseString.Should().NotBeNullOrWhiteSpace();
    }
}