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

        if (!context.Clientes.Any())
        {
            var clientes = new List<Cliente>
            {
                Cliente.Criar("João Augusto de Andrade Malta Rudge", "Brasil", "Alto"),
                Cliente.Criar("Thales Nogueira", "Brasil", "Medio"),
                Cliente.Criar("Gabriel Candido Santana", "Brasil", "Baixo"),
                Cliente.Criar("Maria Eduarda Ribeiro Facio", "Brasil", "Medio"),
                Cliente.Criar("Fellipe Tripovichy Andrade", "Brasil", "Alto")
            };

            context.Clientes.AddRange(clientes);
            await context.SaveChangesAsync();
        }

        var allClients = context.Clientes.ToList();

        if (!context.Transacoes.Any())
        {
            var transacoes = new List<Transacao>
            {
                Transacao.Criar(allClients[0].Id, "Transferencia", 75000, "BRL", "Offshore Ltd"),
                Transacao.Criar(allClients[1].Id, "Deposito", 12000, "BRL", null),
                Transacao.Criar(allClients[2].Id, "Saque", 2000, "BRL", null),
                Transacao.Criar(allClients[3].Id, "Transferencia", 500000, "USD", "Broker XPTO"),
                Transacao.Criar(allClients[4].Id, "Deposito", 300000, "BRL", null)
            };

            context.Transacoes.AddRange(transacoes);
            await context.SaveChangesAsync();
        }

        var allTransactions = context.Transacoes.ToList();

        if (!context.Alertas.Any())
        {
            var alertas = new List<Alerta>
            {
                new Alerta(
                    allClients[0].Id,
                    allTransactions[0].Id,
                    "Transferência Internacional Alta",
                    "Valor acima do limite para perfil de risco",
                    SeveridadeAlerta.Alta),

                new Alerta(
                    allClients[3].Id,
                    allTransactions[3].Id,
                    "Volume Elevado em Moeda Estrangeira",
                    "Movimentação atípica detectada",
                    SeveridadeAlerta.Critica),

                new Alerta(
                    allClients[4].Id,
                    allTransactions[4].Id,
                    "Depósito Elevado",
                    "Depósito muito acima da média histórica",
                    SeveridadeAlerta.Media)
            };

            context.Alertas.AddRange(alertas);
            await context.SaveChangesAsync();
        }
    }
}
