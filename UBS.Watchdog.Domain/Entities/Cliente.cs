using System;
using System.Transactions;
using UBS.Watchdog.Domain.Enums;

namespace UBS.Watchdog.Domain.Entities;

public class Cliente
{
	public Guid Id { get; private set; }
	public string Nome { get; private set; }
	public string Pais { get; private set; }
	public NivelRisco NivelRisco { get; private set; }
	public StatusKyc StatusKyc { get; private set; }
	public DateTime DataCriacao { get; private set; }

	#region Navegação
	public ICollection<Transacao> Transacoes { get; private set; }
	public ICollection<Alerta> Alertas { get; private set; }
	#endregion

	private Cliente()
	{
		Transacoes = new List<Transacao>();
		Alertas = new List<Alerta>();
	}

	public Cliente(string nome, string pais, NivelRisco nivelRisco)
	{
		if (string.IsNullOrWhiteSpace(nome))
			throw new ArgumentException("Nome não pode ser vazio", nameof(nome));

		if (string.IsNullOrWhiteSpace(pais))
			throw new ArgumentException("País não pode ser vazio", nameof(pais));

		Id = Guid.NewGuid();
		Nome = nome;
		Pais = pais;
		NivelRisco = nivelRisco;
		StatusKyc = StatusKyc.Pendente;
		DataCriacao = DateTime.UtcNow;

		Transacoes = new List<Transacao>();
		Alertas = new List<Alerta>();
	}
	public void AtualizarStatusKyc(StatusKyc novoStatus)
	{
		StatusKyc = novoStatus;
	}

	public void AtualizarNivelRisco(NivelRisco novoNivel)
	{
		NivelRisco = novoNivel;
	}
}