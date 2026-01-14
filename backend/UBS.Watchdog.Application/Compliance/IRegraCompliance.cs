using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UBS.Watchdog.Domain.Entities;

namespace UBS.Watchdog.Application.Compliance
{
    /// <summary>
    /// Interface base para todas as regras de compliance (Strategy Pattern)
    /// </summary>
    public interface IRegraCompliance
    {
        /// <summary>
        /// Nome da regra para identificação
        /// </summary>
        string NomeRegra { get; }

        /// <summary>
        /// Valida uma transação e retorna um alerta se violou a regra
        /// </summary>
        /// <param name="transacao">Transação a ser validada</param>
        /// <returns>Alerta se violou a regra, ou null se está ok</returns>
        Task<Alerta?> ValidarAsync(Transacao transacao);
    }
}
