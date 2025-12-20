using UBS.Watchdog.Domain.Enums;
using System;

namespace UBS.Watchdog.Domain.Entities;

public class Transaction
{
    public Guid Id { get; private set; }
    public Guid ClientId { get; private set; }
    
    public TransactionType Type { get; private set; }
    public decimal Amount { get; private set; }
    public string Counterparty { get; private set; }
    public DateTime CreatedAt { get; private set; }

    public IReadOnlyColletion<Alert> Alerts => _alerts;
    public readonly List<Alert> _alerts = new List<Alert>();
    
    protected Transaction(){ }

    public Transaction(Guid clientId, TransactionType type, decimal amount, string counterparty)
    {
        if (amount <= 0)
        {
            throw new ArgumentException("Valor da transação inválido.");
        }
        Id = Guid.NewGuid();
        ClientId = clientId;
        Type = type;
        Amount = amount;
        Counterparty = counterparty;
        CreatedAt = DateTime.UtcNow;
    }

    public void AddAlert(Alert alert)
    {
        if (alert.TransacationId != Id)
        {
            throw new InvalidOperationException("Adição de alerta inválida: O alerta não pertence a esta transação.");
        }
        _alerts.Add(alert);
    }
    
}