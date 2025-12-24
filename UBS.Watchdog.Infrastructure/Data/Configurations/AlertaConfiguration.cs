using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UBS.Watchdog.Domain.Entities;

namespace UBS.Watchdog.Infrastructure.Data.Configurations
{
    public class AlertaConfiguration : IEntityTypeConfiguration<Alerta>
    {
        public void Configure(EntityTypeBuilder<Alerta> builder)
        {
            builder.HasKey(a => a.Id);

            builder.Property(a => a.NomeRegra)
                .IsRequired()
                .HasMaxLength(200);

            builder.Property(a => a.Descricao)
                .IsRequired()
                .HasMaxLength(1000);

            builder.Property(a => a.Status)
                .IsRequired()
                .HasConversion<string>()
                .HasMaxLength(200);

            builder.Property(a => a.Severidade)
                .IsRequired()
                .HasConversion<string>()
                .HasMaxLength(200);

            builder.Property(a => a.DataCriacao)
                .IsRequired();

            builder.Property(a => a.DataResolucao);

            builder.Property(a => a.ResolvidoPor)
                .HasMaxLength(200);

            builder.HasOne(a => a.Cliente)
                .WithMany(c => c.Alertas)
                .HasForeignKey(c => c.ClienteId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(a => a.Transacao)
                .WithMany(t => t.Alertas)
                .HasForeignKey(t => t.TransacaoId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}