using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace UBS.Watchdog.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AdicionaResolucaoEmAlerta : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Resolucao",
                table: "Alertas",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Resolucao",
                table: "Alertas");
        }
    }
}
