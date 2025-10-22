using Api.Comun.Modelos.Clases;
using Api.Entidades;
using Api.Repositorios;
using AutoMapper;

namespace Api.Servicios;

public class ClaseServicio : IClaseServicio
{
    private readonly IClaseRepositorio _repositorio;
    private readonly IMapper _mapper;

    public ClaseServicio(IClaseRepositorio repositorio, IMapper mapper)
    {
        _repositorio = repositorio;
        _mapper = mapper;
    }

    public async Task<IEnumerable<BuscarClaseDto>> ObtenerTodasAsync(bool? activo = null, string? tipoClase = null)
    {
        var clases = await _repositorio.ObtenerConAlumnosAsync(activo, tipoClase);
        return _mapper.Map<IEnumerable<BuscarClaseDto>>(clases);
    }

    public async Task<BuscarClaseDto?> ObtenerPorSlugAsync(string slug)
    {
        var clase = await _repositorio.ObtenerPorSlugConAlumnosAsync(slug);
        return clase == null ? null : _mapper.Map<BuscarClaseDto>(clase);
    }

    public async Task<BuscarClaseDto> CrearAsync(CrearClaseDto dto)
    {
        var clase = _mapper.Map<Clase>(dto);
        clase.Activo = true;

        var claseCreada = await _repositorio.AgregarAsync(clase);
        var claseCompleta = await _repositorio.ObtenerPorSlugConAlumnosAsync(claseCreada.Slug);

        return _mapper.Map<BuscarClaseDto>(claseCompleta!);
    }

    public async Task<BuscarClaseDto> ActualizarAsync(string slug, ModificarClaseDto dto)
    {
        var clase = await _repositorio.ObtenerPorSlugAsync(slug);
        if (clase == null)
        {
            throw new KeyNotFoundException("Clase no encontrada");
        }

        _mapper.Map(dto, clase);
        await _repositorio.ActualizarAsync(clase);

        var claseActualizada = await _repositorio.ObtenerPorSlugConAlumnosAsync(slug);
        return _mapper.Map<BuscarClaseDto>(claseActualizada!);
    }

    public async Task EliminarAsync(string slug)
    {
        if (await _repositorio.TieneAlumnosActivosAsync(slug))
        {
            throw new InvalidOperationException("No se puede eliminar la clase porque tiene alumnos asignados");
        }

        var clase = await _repositorio.ObtenerPorSlugAsync(slug);
        if (clase == null)
        {
            throw new KeyNotFoundException("Clase no encontrada");
        }

        await _repositorio.EliminarAsync(clase);
    }
}
