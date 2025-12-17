using System;

public class Transaction
{
    //similar to Client.cs structure
    public Guid Id { get; private set; }
    public Guid ClientId { get; private set; }

    public TransactionType Type { get; private set; }
    public decimal Amount { get; private set; }
    public string Currency { get; private set; }
    public string Counterparty { get; private set; }
    public DateTime CreatedAt { get; private set; }

    public IReadOnlyCollection<Alert> Alerts => _alerts;
    private readonly List<Alert> _alerts = new();

    //For EF Core later on
    protected Transaction () { }

    public Transaction(
        Guid clientId,
        TransactionType type,
        decimal amount,
        string currency,
        string counterparty)
    {

        if (amount <= 0)
        {
            //Amount can not be zero or negative.
            throw new ArgumentException("Valor da transação inválido.");

        }

        Id = Guid.NewGuid();
        ClientId = clientId;
        Type = type;
        Amount = amount;
        Currency = currency;
        Counterparty = counterparty;
        CreatedAt = DateTime.UtcNow;

    }

    public void AddAlert(Alert alert)
    {

        if (alert.TransactionId  != Id)
        {
            throw new InvalidOperationException("Adição de alerta inválida: O alerta não pertence a esta transação.");
        }

        _alerts.Add(alert);
    }

}