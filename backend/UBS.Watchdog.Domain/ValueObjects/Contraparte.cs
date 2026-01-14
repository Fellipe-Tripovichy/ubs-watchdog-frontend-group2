using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace UBS.Watchdog.Domain.ValueObjects;
/// Value Object representando uma contraparte em transações
public class Contraparte
{
    public string Nome { get; private set; }
    public string Pais { get; private set; }

    // Construtor privado para EF Core
    private Contraparte()
    {
        Nome = string.Empty;
        Pais = string.Empty;
    }

    public Contraparte(string nome, string pais)
    {
        if (string.IsNullOrWhiteSpace(nome))
            throw new ArgumentException("Nome da contraparte não pode ser vazio", nameof(nome));

        if (string.IsNullOrWhiteSpace(pais))
            throw new ArgumentException("País da contraparte não pode ser vazio", nameof(pais));

        Nome = nome.Trim();
        Pais = pais.Trim();
    }

    public override bool Equals(object? obj)
    {
        if (obj is not Contraparte other)
            return false;

        return Nome == other.Nome && Pais == other.Pais;
    }

    public override int GetHashCode()
    {
        return HashCode.Combine(Nome, Pais);
    }

    public override string ToString()
    {
        return $"{Nome} ({Pais})";
    }

    // Operadores de igualdade
    public static bool operator ==(Contraparte? left, Contraparte? right)
    {
        if (left is null && right is null) return true;
        if (left is null || right is null) return false;
        return left.Equals(right);
    }

    public static bool operator !=(Contraparte? left, Contraparte? right)
    {
        return !(left == right);
    }
}