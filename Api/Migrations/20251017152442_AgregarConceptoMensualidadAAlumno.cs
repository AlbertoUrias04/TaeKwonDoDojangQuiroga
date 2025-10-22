using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Api.Migrations
{
    /// <inheritdoc />
    public partial class AgregarConceptoMensualidadAAlumno : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Asistencias_Socio_SocioId",
                table: "Asistencias");

            migrationBuilder.DropForeignKey(
                name: "FK_Pagos_SocioMembresia_SocioMembresiaId",
                table: "Pagos");

            migrationBuilder.DropForeignKey(
                name: "FK_Pagos_Socio_SocioId",
                table: "Pagos");

            migrationBuilder.DropForeignKey(
                name: "FK_Usuarios_Sucursal_SucursalId",
                table: "Usuarios");

            migrationBuilder.DropTable(
                name: "SocioMembresia");

            migrationBuilder.DropTable(
                name: "Membresia");

            migrationBuilder.DropTable(
                name: "Socio");

            migrationBuilder.DropTable(
                name: "Sucursal");

            migrationBuilder.DropIndex(
                name: "IX_Usuarios_SucursalId",
                table: "Usuarios");

            migrationBuilder.DropIndex(
                name: "IX_Pagos_SocioId",
                table: "Pagos");

            migrationBuilder.DropIndex(
                name: "IX_Pagos_SocioMembresiaId",
                table: "Pagos");

            migrationBuilder.DropIndex(
                name: "IX_Asistencias_SocioId",
                table: "Asistencias");

            migrationBuilder.DropColumn(
                name: "SucursalId",
                table: "Usuarios");

            migrationBuilder.DropColumn(
                name: "SocioId",
                table: "Pagos");

            migrationBuilder.DropColumn(
                name: "SocioMembresiaId",
                table: "Pagos");

            migrationBuilder.DropColumn(
                name: "SocioId",
                table: "Asistencias");

            migrationBuilder.AddColumn<int>(
                name: "ConceptoMensualidadId",
                table: "Alumnos",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Alumnos_ConceptoMensualidadId",
                table: "Alumnos",
                column: "ConceptoMensualidadId");

            migrationBuilder.AddForeignKey(
                name: "FK_Alumnos_Conceptos_ConceptoMensualidadId",
                table: "Alumnos",
                column: "ConceptoMensualidadId",
                principalTable: "Conceptos",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Alumnos_Conceptos_ConceptoMensualidadId",
                table: "Alumnos");

            migrationBuilder.DropIndex(
                name: "IX_Alumnos_ConceptoMensualidadId",
                table: "Alumnos");

            migrationBuilder.DropColumn(
                name: "ConceptoMensualidadId",
                table: "Alumnos");

            migrationBuilder.AddColumn<int>(
                name: "SucursalId",
                table: "Usuarios",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "SocioId",
                table: "Pagos",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "SocioMembresiaId",
                table: "Pagos",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "SocioId",
                table: "Asistencias",
                type: "int",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Membresia",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Activa = table.Column<bool>(type: "bit", nullable: false),
                    Descripcion = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DuracionDias = table.Column<int>(type: "int", nullable: false),
                    Nombre = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Precio = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Slug = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Membresia", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Sucursal",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Direccion = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Habilitado = table.Column<bool>(type: "bit", nullable: false),
                    Nombre = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Slug = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Telefono = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Sucursal", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Socio",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    SucursalId = table.Column<int>(type: "int", nullable: true),
                    Activo = table.Column<bool>(type: "bit", nullable: false),
                    ApellidoMaterno = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ApellidoPaterno = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Direccion = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Email = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    FechaNacimiento = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Nombre = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Slug = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Telefono = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Socio", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Socio_Sucursal_SucursalId",
                        column: x => x.SucursalId,
                        principalTable: "Sucursal",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "SocioMembresia",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    MembresiaId = table.Column<int>(type: "int", nullable: false),
                    SocioId = table.Column<int>(type: "int", nullable: false),
                    Activa = table.Column<bool>(type: "bit", nullable: false),
                    FechaFin = table.Column<DateTime>(type: "datetime2", nullable: false),
                    FechaInicio = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SocioMembresia", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SocioMembresia_Membresia_MembresiaId",
                        column: x => x.MembresiaId,
                        principalTable: "Membresia",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_SocioMembresia_Socio_SocioId",
                        column: x => x.SocioId,
                        principalTable: "Socio",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Usuarios_SucursalId",
                table: "Usuarios",
                column: "SucursalId");

            migrationBuilder.CreateIndex(
                name: "IX_Pagos_SocioId",
                table: "Pagos",
                column: "SocioId");

            migrationBuilder.CreateIndex(
                name: "IX_Pagos_SocioMembresiaId",
                table: "Pagos",
                column: "SocioMembresiaId");

            migrationBuilder.CreateIndex(
                name: "IX_Asistencias_SocioId",
                table: "Asistencias",
                column: "SocioId");

            migrationBuilder.CreateIndex(
                name: "IX_Socio_SucursalId",
                table: "Socio",
                column: "SucursalId");

            migrationBuilder.CreateIndex(
                name: "IX_SocioMembresia_MembresiaId",
                table: "SocioMembresia",
                column: "MembresiaId");

            migrationBuilder.CreateIndex(
                name: "IX_SocioMembresia_SocioId",
                table: "SocioMembresia",
                column: "SocioId");

            migrationBuilder.AddForeignKey(
                name: "FK_Asistencias_Socio_SocioId",
                table: "Asistencias",
                column: "SocioId",
                principalTable: "Socio",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Pagos_SocioMembresia_SocioMembresiaId",
                table: "Pagos",
                column: "SocioMembresiaId",
                principalTable: "SocioMembresia",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Pagos_Socio_SocioId",
                table: "Pagos",
                column: "SocioId",
                principalTable: "Socio",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Usuarios_Sucursal_SucursalId",
                table: "Usuarios",
                column: "SucursalId",
                principalTable: "Sucursal",
                principalColumn: "Id");
        }
    }
}
