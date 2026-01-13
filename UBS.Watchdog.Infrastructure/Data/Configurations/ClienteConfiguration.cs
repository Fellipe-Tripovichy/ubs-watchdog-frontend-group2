using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using UBS.Watchdog.Domain.Entities;

namespace UBS.Watchdog.Infrastructure.Data.Configurations
{
	public class ClienteConfiguration : IEntityTypeConfiguration<Cliente>
	{
		public void Configure(EntityTypeBuilder<Cliente> builder)
		{
			builder.HasKey(c => c.Id);

			builder.Property(c => c.Nome)
				.IsRequired()
				.HasMaxLength(200);

			builder.Property(c => c.Pais)
				.IsRequired()
				.HasMaxLength(100);

			builder.Property(c => c.NivelRisco)
				.IsRequired()
				.HasConversion<string>()
				.HasMaxLength(10);

			builder.Property(c => c.StatusKyc)
				.IsRequired()
				.HasConversion<string>()
				.HasMaxLength(10);

			builder.Property(c => c.DataCriacao)
				.IsRequired();

			builder.HasMany(c => c.Transacoes)
				.WithOne(t => t.Cliente)
				.HasForeignKey(t => t.ClienteId)
				.OnDelete(DeleteBehavior.Restrict);
			
			//TODO: Colocar index?
		}
	}
}
