using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Api.Migrations
{
    /// <inheritdoc />
    public partial class ActualizarAsistencias : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Asistencias_AlumnoId",
                table: "Asistencias");

            migrationBuilder.DropColumn(
                name: "FechaHoraSalida",
                table: "Asistencias");

            migrationBuilder.RenameColumn(
                name: "FechaHoraEntrada",
                table: "Asistencias",
                newName: "Fecha");

            migrationBuilder.AddColumn<bool>(
                name: "Presente",
                table: "Asistencias",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.CreateIndex(
                name: "IX_Asistencias_AlumnoId_ClaseId_Fecha",
                table: "Asistencias",
                columns: new[] { "AlumnoId", "ClaseId", "Fecha" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Asistencias_AlumnoId_ClaseId_Fecha",
                table: "Asistencias");

            migrationBuilder.DropColumn(
                name: "Presente",
                table: "Asistencias");

            migrationBuilder.RenameColumn(
                name: "Fecha",
                table: "Asistencias",
                newName: "FechaHoraEntrada");

            migrationBuilder.AddColumn<DateTime>(
                name: "FechaHoraSalida",
                table: "Asistencias",
                type: "datetime2",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Asistencias_AlumnoId",
                table: "Asistencias",
                column: "AlumnoId");
        }
    }
}
