using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UBS.Watchdog.Domain.Entities;
using UBS.Watchdog.Domain.Enums;

namespace UBS.Watchdog.Infrastructure.Data;

public static class DbSeeder
{
    public static async Task SeedAsync(AppDbContext context)
    {
        await context.Database.EnsureCreatedAsync();

        if (!await context.Clientes.AnyAsync())
        {
            var clientes = new List<Cliente>
            {
                Cliente.Criar("João Augusto de Andrade Malta Rudge", "Brasil", "Alto"),
                Cliente.Criar("Thales Nogueira", "Brasil", "Medio"),
                Cliente.Criar("Gabriel Candido Santana", "Brasil", "Baixo"),
                Cliente.Criar("Maria Eduarda Ribeiro Facio", "Brasil", "Medio"),
                Cliente.Criar("Fellipe Tripovichy Andrade", "Brasil", "Alto"),
                Cliente.Criar("Ana Silva", "Argentina", "Baixo"),
                Cliente.Criar("Carlos Mendes", "Brasil", "Alto"),
                Cliente.Criar("Lucia Santos", "Portugal", "Medio")
            };

            await context.Clientes.AddRangeAsync(clientes);
            await context.SaveChangesAsync();

            Console.WriteLine($"{clientes.Count} clientes criados");
        }

        var allClients = await context.Clientes.ToListAsync();

        if (!await context.Transacoes.AnyAsync())
        {
            var transacoes = new List<Transacao>
            {
                Transacao.Criar(
                    allClients[0].Id,
                    TipoTransacao.Transferencia,
                    75000,
                    Moeda.BRL,
                    "Banco da Coreia do Norte",
                    "Coreia do Norte"
                ),
                
                // Soma: 105k excede o limite diário
                Transacao.Criar(allClients[0].Id, TipoTransacao.Deposito, 30000, Moeda.BRL),

                Transacao.Criar(allClients[1].Id, TipoTransacao.Deposito, 12000, Moeda.BRL),
                Transacao.Criar(allClients[2].Id, TipoTransacao.Saque, 2000, Moeda.BRL),

                // Excede limite diário em USD
                Transacao.Criar(
                    allClients[3].Id,
                    TipoTransacao.Transferencia,
                    500000,
                    Moeda.USD,
                    "Broker XPTO",
                    "Estados Unidos"
                ),
                
                // Excede limite diário
                Transacao.Criar(allClients[4].Id, TipoTransacao.Deposito, 300000, Moeda.BRL),
                
                // País de risco - Transferência para Irã
                Transacao.Criar(
                    allClients[4].Id,
                    TipoTransacao.Transferencia,
                    25000,
                    Moeda.BRL,
                    "Iran Bank Ltd",
                    "Irã"
                ),

                Transacao.Criar(allClients[5].Id, TipoTransacao.Deposito, 5000, Moeda.BRL),
                Transacao.Criar(allClients[6].Id, TipoTransacao.Saque, 1500, Moeda.BRL),
                Transacao.Criar(
                    allClients[7].Id,
                    TipoTransacao.Transferencia,
                    8000,
                    Moeda.EUR,
                    "European Bank",
                    "Alemanha"
                )
            };

            await context.Transacoes.AddRangeAsync(transacoes);
            await context.SaveChangesAsync();

            Console.WriteLine($"✅ {transacoes.Count} transações criadas");
        }

        var allTransactions = await context.Transacoes.ToListAsync();

        if (!await context.Alertas.AnyAsync())
        {
            var alertas = new List<Alerta>
            {
                Alerta.Criar(
                    allClients[0].Id,
                    allTransactions[0].Id,
                    "Transferência para País de Alto Risco",
                    "Transferência de R$ 75.000 para 'Banco da Coreia do Norte' (país de alto risco: Coreia do Norte)",
                    SeveridadeAlerta.Critica),

                Alerta.Criar(
                    allClients[3].Id,
                    allTransactions[4].Id,
                    "Limite Diário Excedido",
                    "Cliente movimentou $ 500.000 em um dia, ultrapassando o limite de $ 50.000",
                    SeveridadeAlerta.Critica),

                Alerta.Criar(
                    allClients[4].Id,
                    allTransactions[5].Id,
                    "Limite Diário Excedido",
                    "Cliente movimentou R$ 300.000 em um dia, ultrapassando o limite de R$ 50.000",
                    SeveridadeAlerta.Alta)
            };

            await context.Alertas.AddRangeAsync(alertas);


            alertas[0].IniciarAnalise();

            alertas[1].IniciarAnalise();
            alertas[1].Resolver("João Analista", "A transferência era verídica");

            await context.SaveChangesAsync();

            Console.WriteLine($"✅ {alertas.Count} alertas criados (1 Novo, 1 EmAnalise, 1 Resolvido)");
        }

        Console.WriteLine("✅ Seed concluído com sucesso!");
    }
}
