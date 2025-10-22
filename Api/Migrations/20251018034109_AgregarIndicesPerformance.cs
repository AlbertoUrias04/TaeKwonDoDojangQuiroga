using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Api.Migrations
{
    /// <inheritdoc />
    public partial class AgregarIndicesPerformance : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_Usuarios_Habilitado",
                table: "Usuarios",
                column: "Habilitado");

            migrationBuilder.CreateIndex(
                name: "IX_Usuarios_NombreUsuario",
                table: "Usuarios",
                column: "NombreUsuario",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Usuarios_Slug",
                table: "Usuarios",
                column: "Slug",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Pagos_AlumnoId_Fecha",
                table: "Pagos",
                columns: new[] { "AlumnoId", "Fecha" });

            migrationBuilder.CreateIndex(
                name: "IX_Pagos_Estado",
                table: "Pagos",
                column: "Estado");

            migrationBuilder.CreateIndex(
                name: "IX_Pagos_Estado_Fecha",
                table: "Pagos",
                columns: new[] { "Estado", "Fecha" });

            migrationBuilder.CreateIndex(
                name: "IX_Pagos_Fecha",
                table: "Pagos",
                column: "Fecha");

            migrationBuilder.CreateIndex(
                name: "IX_Alumnos_Activo",
                table: "Alumnos",
                column: "Activo");

            migrationBuilder.CreateIndex(
                name: "IX_Alumnos_Activo_ClaseId",
                table: "Alumnos",
                columns: new[] { "Activo", "ClaseId" });

            migrationBuilder.CreateIndex(
                name: "IX_Alumnos_EmailTutor",
                table: "Alumnos",
                column: "EmailTutor");

            migrationBuilder.CreateIndex(
                name: "IX_Alumnos_Slug",
                table: "Alumnos",
                column: "Slug",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Usuarios_Habilitado",
                table: "Usuarios");

            migrationBuilder.DropIndex(
                name: "IX_Usuarios_NombreUsuario",
                table: "Usuarios");

            migrationBuilder.DropIndex(
                name: "IX_Usuarios_Slug",
                table: "Usuarios");

            migrationBuilder.DropIndex(
                name: "IX_Pagos_AlumnoId_Fecha",
                table: "Pagos");

            migrationBuilder.DropIndex(
                name: "IX_Pagos_Estado",
                table: "Pagos");

            migrationBuilder.DropIndex(
                name: "IX_Pagos_Estado_Fecha",
                table: "Pagos");

            migrationBuilder.DropIndex(
                name: "IX_Pagos_Fecha",
                table: "Pagos");

            migrationBuilder.DropIndex(
                name: "IX_Alumnos_Activo",
                table: "Alumnos");

            migrationBuilder.DropIndex(
                name: "IX_Alumnos_Activo_ClaseId",
                table: "Alumnos");

            migrationBuilder.DropIndex(
                name: "IX_Alumnos_EmailTutor",
                table: "Alumnos");

            migrationBuilder.DropIndex(
                name: "IX_Alumnos_Slug",
                table: "Alumnos");
        }
    }
}
