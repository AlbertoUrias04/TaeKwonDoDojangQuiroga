using Api.Comun.Interfaces;
using Api.Comun.Modelos.Membresias;
using Api.Comun.Utilidades;
using Api.Entidades;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Api.Controllers;

[Authorize]
[Route("membresias")]
public class MembresiasController : ControllerBase
{
    private readonly IAplicacionBdContexto _contexto;

    public MembresiasController(IAplicacionBdContexto contexto)
    {
        _contexto = contexto;
    }

    [HttpGet]
    public async Task<List<BuscarMembresiaDto>> ObtenerMembresias(bool? activa)
    {
        var query = _contexto.Membresias.AsQueryable();

        if (activa.HasValue)
        {
            query = query.Where(x => x.Activa == activa.Value);
        }

        var lista = await query.ToListAsync();

        return lista.ConvertAll(x => x.ConvertirDto());
    }

    [HttpGet("{slug}")]
    public async Task<BuscarMembresiaDto> ObtenerMembresia(string slug, CancellationToken cancelacionToken)
    {
        var membresia = await _contexto.Membresias
            .FirstOrDefaultAsync(x => x.Slug == slug, cancelacionToken);

        if (membresia == null)
            return new BuscarMembresiaDto();

        return membresia.ConvertirDto();
    }

    [HttpPost]
    public async Task<string> CrearMembresia([FromBody] CrearMembresiaDto membresiaDto, CancellationToken cancelacionToken)
    {
        var nuevaMembresia = new Membresia()
        {
            Nombre = membresiaDto.Nombre,
            Precio = membresiaDto.Precio,
            DuracionDias = membresiaDto.DuracionDias,
            Descripcion = membresiaDto.Descripcion,
            Activa = membresiaDto.Activa
        };

        await _contexto.Membresias.AddAsync(nuevaMembresia, cancelacionToken);
        await _contexto.SaveChangesAsync(cancelacionToken);

        return nuevaMembresia.Slug;
    }

    [HttpPut("{slug}")]
    public async Task<BuscarMembresiaDto> ModificarMembresia([FromBody] ModificarMembresiaDto membresiaDto,
        CancellationToken cancelacionToken)
    {
        var membresia = await _contexto.Membresias
            .FirstOrDefaultAsync(x => x.Slug == membresiaDto.Slug, cancelacionToken);

        if (membresia == null)
            return new BuscarMembresiaDto();

        membresia.Nombre = membresiaDto.Nombre;
        membresia.Precio = membresiaDto.Precio;
        membresia.DuracionDias = membresiaDto.DuracionDias;
        membresia.Descripcion = membresiaDto.Descripcion;
        membresia.Activa = membresiaDto.Activa;

        // Actualizar el Slug si cambió el nombre
        membresia.Slug = membresia.ObtenerDescripcionParaSlug().ToLower().Replace(" ", "-");

        await _contexto.SaveChangesAsync(cancelacionToken);

        return membresia.ConvertirDto();
    }

    [HttpDelete("{slug}")]
    public async Task<bool> EliminarMembresia(string slug, CancellationToken cancelacionToken)
    {
        var membresia = await _contexto.Membresias
            .FirstOrDefaultAsync(x => x.Slug == slug, cancelacionToken);

        if (membresia == null)
            return false;

        // Solo desactivar, no eliminar físicamente
        membresia.Activa = false;

        await _contexto.SaveChangesAsync(cancelacionToken);

        return true;
    }
}
