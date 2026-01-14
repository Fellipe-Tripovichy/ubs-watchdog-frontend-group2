using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using UBS.Watchdog.Domain.Entities;

namespace UBS.Watchdog.Infrastructure.Data.Configurations
{
    public class TransacaoConfiguration : IEntityTypeConfiguration<Transacao>
    {
        public void Configure(EntityTypeBuilder<Transacao> builder)
        {
            builder.HasKey(t => t.Id);

            builder.Property(t => t.Tipo)
                .IsRequired()
                .HasConversion<string>()
                .HasMaxLength(15);

            builder.Property(t => t.Valor)
                .IsRequired()
                .HasPrecision(18, 2);

            builder.Property(t => t.Moeda)
                .IsRequired()
                .HasConversion<string>()
                .HasMaxLength(10);

            builder.Property(t => t.DataHora)
                .IsRequired()
                .HasConversion<DateTime>();

            builder.HasOne(t => t.Cliente)
                .WithMany(c => c.Transacoes)
                .HasForeignKey(t => t.ClienteId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(t => t.Contraparte)
                .WithMany() 
                .HasForeignKey(t => t.ContraparteId)
                .OnDelete(DeleteBehavior.Restrict)
                .IsRequired(false);
        }
    }
}