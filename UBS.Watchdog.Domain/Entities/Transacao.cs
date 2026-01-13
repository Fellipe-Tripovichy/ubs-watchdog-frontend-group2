using UBS.Watchdog.Domain.Entities;
using UBS.Watchdog.Domain.Enums;
using UBS.Watchdog.Domain.ValueObjects;

public class Transacao
{
    public Guid Id { get; private set; }
    public Guid ClienteId { get; private set; }
    public TipoTransacao Tipo { get; private set; }
    public decimal Valor { get; private set; }
    public Moeda Moeda { get; private set; }
    public Contraparte? Contraparte { get; private set; }
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
        Contraparte? contraparte = null)
    {
        if (valor <= 0)
            throw new ArgumentException("Valor deve ser maior que zero", nameof(valor));

        if (tipo == TipoTransacao.Transferencia && contraparte == null)
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

    /// <summary>
    /// Factory method - recebe primitivos e enums
    /// </summary>
    public static Transacao Criar(
        Guid clienteId,
        TipoTransacao tipo,
        decimal valor,
        Moeda moeda,
        string? contraparteNome = null,
        string? contrapartePais = null)
    {
        Contraparte? contraparte = null;
        if (!string.IsNullOrWhiteSpace(contraparteNome) && !string.IsNullOrWhiteSpace(contrapartePais))
        {
            contraparte = new Contraparte(contraparteNome, contrapartePais);
        }

        return new Transacao(clienteId, tipo, valor, moeda, contraparte);
    }
}