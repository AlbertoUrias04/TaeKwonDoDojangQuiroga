using Api.Comun.Interfaces;
using Api.Comun.Modelos.Sucursales;
using Api.Entidades;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Api.Controllers;

[Authorize]
[Route("sucursales")]
public class SucursalesController : ControllerBase
{
	private readonly IAplicacionBdContexto _contexto;

	public SucursalesController(IAplicacionBdContexto contexto)
	{
		_contexto = contexto;
	}

	[HttpGet]
	public async Task<List<BuscarSucursalDto>> ObtenerSucursales(string nombre, bool habilitado)
	{

        var query = _contexto.Sucursales.AsQueryable();

        if (habilitado != null)
        {
            query = query.Where(x => x.Habilitado == habilitado);
        }

        if (!string.IsNullOrEmpty(nombre))
		{
			query = query.Where(s => s.Nombre.Contains(nombre));
		}

		var lista = await query.ToListAsync();

		return lista.Select(s => new BuscarSucursalDto
		{
			Id = s.Id,
			Nombre = s.Nombre,
			Direccion = s.Direccion,
			Slug = s.Slug,
			Habilitado = s.Habilitado
		}).ToList();
	}

	[HttpGet("{slug}")]
	public async Task<BuscarSucursalDto> ObtenerSucursal(string slug, CancellationToken ct)
	{
		var sucursal = await _contexto.Sucursales.FirstOrDefaultAsync(s => s.Slug == slug, ct);

		if (sucursal == null)
			return new BuscarSucursalDto();

		return new BuscarSucursalDto
		{
			Id = sucursal.Id,
			Nombre = sucursal.Nombre,
			Direccion = sucursal.Direccion,
			Slug = sucursal.Slug,
			Habilitado = sucursal.Habilitado
		};
	}

	[HttpPost]
	public async Task<string> RegistrarSucursal([FromBody] CrearSucursalDto dto, CancellationToken ct)
	{
		var nueva = new Sucursal
		{
			Nombre = dto.Nombre,
			Direccion = dto.Direccion,
			Habilitado = dto.Habilitado
		};

		await _contexto.Sucursales.AddAsync(nueva, ct);
		await _contexto.SaveChangesAsync(ct);

		return nueva.Slug;
	}

	[HttpPut("{slug}")]
	public async Task<BuscarSucursalDto> ModificarSucursal([FromBody] ModificarSucursalDto dto, CancellationToken ct)
	{
		var sucursal = await _contexto.Sucursales.FirstOrDefaultAsync(x => x.Slug == dto.Slug, ct);

		if (sucursal == null)
			return new BuscarSucursalDto();

		sucursal.Nombre = dto.Nombre;
		sucursal.Direccion = dto.Direccion;
		sucursal.Habilitado = dto.Habilitado;

		await _contexto.SaveChangesAsync(ct);

		return new BuscarSucursalDto
		{
			Id = sucursal.Id,
			Nombre = sucursal.Nombre,
			Direccion = sucursal.Direccion,
			Slug = sucursal.Slug,
			Habilitado = sucursal.Habilitado
		};
	}

	[HttpPatch("{slug}")]
	public async Task<bool> CambiarHabilitado([FromBody] HabilitadoSucursalDto dto, CancellationToken ct)
	{
		var entidad = await _contexto.Sucursales.FirstOrDefaultAsync(x => x.Slug == dto.Slug, ct);

		if (entidad == null)
			return false;

		entidad.Habilitado = dto.Habilitado;
		await _contexto.SaveChangesAsync(ct);

		return true;
	}
}