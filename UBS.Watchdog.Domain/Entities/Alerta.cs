using UBS.Watchdog.Domain.Enums;
using System;

namespace UBS.Watchdog.Domain.Entities;
//Criados automaticamente quando regras são violadas.
// WORKFLOW : Novo -> EmAnálise -> Resolvido
public class Alerta
{
	public Guid Id { get; private set; }
	public Guid ClienteId { get; private set; }
	public Guid TransacaoId { get; private set; }
	public string NomeRegra { get; private set; }
	public string Descricao { get; private set; }
	public SeveridadeAlerta Severidade { get; private set; }
	public StatusAlerta Status { get; private set; }
	public DateTime DataCriacao { get; private set; }
	public DateTime? DataResolucao { get; private set; }
	public string? ResolvidoPor { get; private set; }

	#region Navegação
	public Cliente Cliente { get; private set; } = null!;
	public Transacao Transacao { get; private set; } = null!;
	#endregion
	private Alerta() { }

	public Alerta(
		   Guid clienteId,
		   Guid transacaoId,
		   string nomeRegra,
		   string descricao,
		   SeveridadeAlerta severidade)
	{
		if (string.IsNullOrWhiteSpace(nomeRegra))
			throw new ArgumentException("Nome da regra não pode ser vazio", nameof(nomeRegra));

		Id = Guid.NewGuid();
		ClienteId = clienteId;
		TransacaoId = transacaoId;
		NomeRegra = nomeRegra;
		Descricao = descricao;
		Severidade = severidade;
		Status = StatusAlerta.Novo;
		DataCriacao = DateTime.UtcNow;
	}

	public void IniciarAnalise()
	{
		if (Status != StatusAlerta.Novo)
			throw new InvalidOperationException("Alerta não está no status Novo");

		Status = StatusAlerta.EmAnalise;
	}

	public void Resolver(string resolvidoPor)
	{
		if (Status == StatusAlerta.Resolvido)
			throw new InvalidOperationException("Alerta já foi resolvido");

		if (string.IsNullOrWhiteSpace(resolvidoPor))
			throw new ArgumentException("Necessário informar quem resolveu", nameof(resolvidoPor));

		Status = StatusAlerta.Resolvido;
		DataResolucao = DateTime.UtcNow;
		ResolvidoPor = resolvidoPor;
	}


}