using UBS.Watchdog.Domain.Enums;
using System;

namespace UBS.Watchdog.Domain.Entities;

public class Client
{
    public Guid Id { get; private set; }
    public string Name { get; private set; }
    public string Country { get; private set; }
    public RiskLevel RiskLevel { get; private set; }
    public KycStatus KycStatus { get; private set; }

    public IReadOnlyCollection<Transaction> Transactions => _transactions;
    public readonly List<Transaction> Transactions = new List<Transaction>();
    
    protected Client(){ }

    public Client(string name, string country, RiskLevel riskLevel, KycStatus kycStatus)
    {
        Id = Guid.NewGuid();
        Name = name;
        Country = country;
        RiskLevel = riskLevel;
        KycStatus = kycStatus;
    }

    public void UpdateRiskLevel(RiskLevel riskLevel)
    {
        RiskLevel = riskLevel;
    }

    public void UpdateKycStatus(KycStatus kycStatus)
    {
        KycStatus = kycStatus;
    }
}