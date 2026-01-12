using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace UBS.Watchdog.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class SegundaMigration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Contraparte",
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

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ContraparteNome",
                table: "Transacoes");

            migrationBuilder.DropColumn(
                name: "ContrapartePais",
                table: "Transacoes");

            migrationBuilder.AddColumn<string>(
                name: "Contraparte",
                table: "Transacoes",
                type: "text",
                nullable: true);
        }
    }
}
