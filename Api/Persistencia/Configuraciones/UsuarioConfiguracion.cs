using Api.Entidades;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Api.Persistencia.Configuraciones;

public class UsuarioConfiguracion : IEntityTypeConfiguration<Usuario>
{
    public void Configure(EntityTypeBuilder<Usuario> constructor)
    {
        constructor.ToTable("Usuarios");
        constructor.HasKey(u => u.Id);

        constructor.Property(u => u.NombreUsuario)
            .IsRequired()
            .HasMaxLength(100);

        constructor.Property(u => u.Rol)
            .IsRequired()
            .HasMaxLength(50);

        constructor.Property(u => u.Slug)
            .HasMaxLength(200);

        // Índices para mejorar performance
        constructor.HasIndex(u => u.Slug)
            .IsUnique()
            .HasDatabaseName("IX_Usuarios_Slug");

        constructor.HasIndex(u => u.NombreUsuario)
            .IsUnique()
            .HasDatabaseName("IX_Usuarios_NombreUsuario");

        constructor.HasIndex(u => u.Habilitado)
            .HasDatabaseName("IX_Usuarios_Habilitado");

        constructor.HasMany(u => u.PagosRegistrados)
            .WithOne(p => p.UsuarioRegistro)
            .HasForeignKey(p => p.UsuarioRegistroId)
            .OnDelete(DeleteBehavior.Restrict);

        constructor.HasMany(u => u.AsistenciasRegistradas)
            .WithOne(a => a.UsuarioRegistro)
            .HasForeignKey(a => a.UsuarioRegistroId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
