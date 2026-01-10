using UBS.Watchdog.Domain.Enums;
using System;

namespace UBS.Watchdog.Domain.Entities;


public class Transacao
{

	public Guid Id { get; private set; }
	public Guid ClienteId { get; private set; }
	public TipoTransacao Tipo { get; private set; }
	public decimal Valor { get; private set; }
	public Moeda Moeda { get; private set; }
	public string? Contraparte { get; private set; } 
	public DateTime DataHora { get; private set; }

	#region Navegação
	public Cliente Cliente { get; private set; } = null!;
	public ICollection<Alerta> Alertas { get; private set; }
	#endregion

	private Transacao()
	{
		Alertas = new List<Alerta>();
	}

	public Transacao(
	Guid clienteId,
	TipoTransacao tipo,
	decimal valor,
	Moeda moeda,
	string? contraparte = null)
	{
		if (valor <= 0)
			throw new ArgumentException("Valor deve ser maior que zero", nameof(valor));

		if (tipo == TipoTransacao.Transferencia && string.IsNullOrWhiteSpace(contraparte))
			throw new ArgumentException("Transferência precisa de contraparte", nameof(contraparte));

		Id = Guid.NewGuid();
		ClienteId = clienteId;
		Tipo = tipo;
		Valor = valor;
		Moeda = moeda;
		Contraparte = contraparte;
		DataHora = DateTime.UtcNow;

		Alertas = new List<Alerta>();
	}

    public static Transacao Criar(Guid clienteId, string tipoTransacao, decimal valor, string moeda, string? contraparte)
    {

        Enum.TryParse<TipoTransacao>(tipoTransacao, true, out var tipoEnum);
        Enum.TryParse<Moeda>(moeda, true, out var moedaEnum);


        return new Transacao(clienteId, tipoEnum, valor, moedaEnum, contraparte);
    }
}

