using Api.Entidades;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Api.Persistencia.Configuraciones;

public class UsuarioConfiguracion : IEntityTypeConfiguration<Usuario>
{
    public void Configure(EntityTypeBuilder<Usuario> constructor)
    {
        constructor.HasKey(u => u.Id);

        constructor.Property(u => u.SucursalId)
            .IsRequired(false);

        constructor.HasOne(u => u.Sucursal)
            .WithMany(s => s.Usuarios)
            .HasForeignKey(u => u.SucursalId)
            .OnDelete(DeleteBehavior.SetNull);
    }
}
