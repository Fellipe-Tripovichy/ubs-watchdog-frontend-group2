using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace UBS.Watchdog.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class ContraParteId : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ContraparteNome",
                table: "Transacoes");

            migrationBuilder.DropColumn(
                name: "ContrapartePais",
                table: "Transacoes");

            migrationBuilder.AddColumn<Guid>(
                name: "ContraparteId",
                table: "Transacoes",
                type: "uuid",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Transacoes_ContraparteId",
                table: "Transacoes",
                column: "ContraparteId");

            migrationBuilder.AddForeignKey(
                name: "FK_Transacoes_Clientes_ContraparteId",
                table: "Transacoes",
                column: "ContraparteId",
                principalTable: "Clientes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Transacoes_Clientes_ContraparteId",
                table: "Transacoes");

            migrationBuilder.DropIndex(
                name: "IX_Transacoes_ContraparteId",
                table: "Transacoes");

            migrationBuilder.DropColumn(
                name: "ContraparteId",
                table: "Transacoes");

            migrationBuilder.AddColumn<string>(
                name: "ContraparteNome",
                table: "Transacoes",
                type: "character varying(200)",
                maxLength: 200,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ContrapartePais",
                table: "Transacoes",
                type: "character varying(100)",
                maxLength: 100,
                nullable: true);
        }
    }
}
