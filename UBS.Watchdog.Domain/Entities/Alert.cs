using System;

public class Alert
{
	public Guid Id { get; private set; }
	public Guid ClientId { get; private set; }
	public Guid TransactionId { get; private set; }

	public string Rule { get; private set; }
	public DateTime CreatedAt { get; private set; }
	public AlertStatus Status { get; private set; }
	public AlertSeverity Severity { get; private set; }

	//for EF Core later on
	protected Alert () { }

	public Alert(	
		Guid clientId,
		Guid transctionId,
		string rule,
		AlertSeverity severity)
	{
		Id = Guid.NewGuid();
		ClientId = clientId;
		TransactionId = transctionId;
		Rule = rule;
		Status = AlertStatus.New;
		Severity = severity;
		CreatedAt = DateTime.UtcNow;
	}

	//This considers the enums in Domain/Enum (not yet implemented as of now)
	public void StartAnalysis()
	{

		if (Status != AlertStatus.New)
		{
			throw new InvalidOperationException("Only new alerts can be analyzed.");
		}

		Status = AlertStatus.InAnalysis;
	}

	public void ResolveAnalysis()
	{

		if (Status != AlertStatus.InAnalysis)
		{
			throw new InvalidOperationException("Only alerts in analysis can be resolved.");
		}

		Status = AlertStatus.Resolved;
	}
}
