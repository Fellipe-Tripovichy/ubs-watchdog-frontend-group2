using System;

// First class created in the project :D
public class Client
{
	//Stable identity as Guid, a few other necessary data for Client with private setters
	public Guid Id { get; private set; }
	public string Name { get; private set; }
	public string Country { get; private set; }
	public RiskLevel RiskLevel { get; private set; }
	public KycStatus KycStatus { get; private set; }

	//Creating protected read-only Transactions list
	public IReadOnlyCollection<Transaction> Transactions => _transactions;
	private readonly List<Transaction> _transactions = new();

	//Necessary for EF
	protected Client() { }

	public Client(string name, string country, RiskLevel riskLevel, KycStatus kycStatus)
	{
		Id = Guid.NewGuid();
		Name = name;
		Country = country;
		RiskLevel = riskLevel;
		KycStatus = kycStatus;
	}

	//Simple domain methods
	public void UpdateRiskLevel(RiskLevel newLevel)
	{
		RiskLevel = newLevel;
	}

	public void UpdateKycStatus(KycStatus status)
	{
		KycStatus = status;
	}
}
