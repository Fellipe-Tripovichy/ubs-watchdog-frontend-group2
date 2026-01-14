using UBS.Watchdog.Domain.Entities;
using UBS.Watchdog.Domain.Enums;

public class Transacao
{
    public Guid Id { get; private set; }
    public Guid ClienteId { get; private set; }
    public TipoTransacao Tipo { get; private set; }
    public decimal Valor { get; private set; }
    public Moeda Moeda { get; private set; }
    public Guid? ContraparteId { get; private set; }
    public DateTime DataHora { get; private set; }
    #region Navegação
    public Cliente Cliente { get; private set; } = null!;
    public Cliente? Contraparte { get; private set; }
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
        Guid? contraparteId = null)
    {
        if (valor <= 0)
            throw new ArgumentException("Valor deve ser maior que zero", nameof(valor));

        if (tipo == TipoTransacao.Transferencia && contraparteId == null)
            throw new ArgumentException("Transferência precisa de contraparte", nameof(contraparteId));

        Id = Guid.NewGuid();
        ClienteId = clienteId;
        Tipo = tipo;
        Valor = valor;
        Moeda = moeda;
        ContraparteId = contraparteId;
        DataHora = DateTime.UtcNow;

        Alertas = new List<Alerta>();
    }

    /// <summary>
    /// Factory method - recebe primitivos e enums
    /// </summary>
    public static Transacao Criar(
        Guid clienteId,
        TipoTransacao tipo,
        decimal valor,
        Moeda moeda,
        Guid? contraparteId = null)
    {
        return new Transacao(clienteId, tipo, valor, moeda, contraparteId);
    }
}