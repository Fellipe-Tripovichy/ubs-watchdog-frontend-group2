namespace UBS.Watchdog.Domain.Entities;

using System;

public class Alert
{
    public Guid Id { get; private set; }
    public Guid ClientId { get; private set; }
    public Guid TransactionId { get; private set; }
    
    public string Rule { get; private set; }
    public AlertStatus Status { get; private set; }
    public AlertSeverity Severity { get; private set; }
    public DateTime CreatedAt { get; private set; }
    
    protected Alert(){ }

    public Alert(Guid clientId, Guid transactionId, string rule, AlertSeverity severity)
    {
        Id = Guid.newGuid();
        ClientId = clientId;
        TransactionId = transactionId;
        Rule = rule;
        Status = AlertStatus.New;
        Severity = severity;
        CreatedAt = DateTime.UtcNow;
    }

    public void StartAnalysis()
    {
        if (Status != AlertStatus.New)
        {
            throw new InvalidOperation("Apenas novos alertas podem ser analisados...");
        }
        Status = AlertStatus.InAnalysis;
    }
    
    public void ResolveAnalysis()
    {
        if (Status != AlertStatus.InAnalysis)
        {
            throw new InvalidOperationException("Apenas alertas em análise podem ser fechados.");
        }
        Status = AlertStatus.Resolved;
    }
}