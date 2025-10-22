using Api.Comun.Modelos.Conceptos;
using Api.Entidades;
using Api.Repositorios;
using AutoMapper;

namespace Api.Servicios;

public class ConceptoServicio : IConceptoServicio
{
    private readonly IConceptoRepositorio _repositorio;
    private readonly IMapper _mapper;

    public ConceptoServicio(IConceptoRepositorio repositorio, IMapper mapper)
    {
        _repositorio = repositorio;
        _mapper = mapper;
    }

    public async Task<IEnumerable<BuscarConceptoDto>> ObtenerTodosAsync(bool? activo = null, string? tipoConcepto = null)
    {
        var conceptos = await _repositorio.ObtenerOrdenadasAsync(activo, tipoConcepto);
        return _mapper.Map<IEnumerable<BuscarConceptoDto>>(conceptos);
    }

    public async Task<BuscarConceptoDto?> ObtenerPorSlugAsync(string slug)
    {
        var concepto = await _repositorio.ObtenerPorSlugAsync(slug);
        return concepto == null ? null : _mapper.Map<BuscarConceptoDto>(concepto);
    }

    public async Task<BuscarConceptoDto> CrearAsync(CrearConceptoDto dto)
    {
        var concepto = _mapper.Map<Concepto>(dto);
        concepto.Activo = true;

        var conceptoCreado = await _repositorio.AgregarAsync(concepto);
        return _mapper.Map<BuscarConceptoDto>(conceptoCreado);
    }

    public async Task<BuscarConceptoDto> ActualizarAsync(string slug, ModificarConceptoDto dto)
    {
        var concepto = await _repositorio.ObtenerPorSlugAsync(slug);
        if (concepto == null)
        {
            throw new KeyNotFoundException("Concepto no encontrado");
        }

        _mapper.Map(dto, concepto);
        await _repositorio.ActualizarAsync(concepto);

        return _mapper.Map<BuscarConceptoDto>(concepto);
    }

    public async Task DesactivarAsync(string slug)
    {
        var concepto = await _repositorio.ObtenerPorSlugAsync(slug);
        if (concepto == null)
        {
            throw new KeyNotFoundException("Concepto no encontrado");
        }

        concepto.Activo = false;
        await _repositorio.ActualizarAsync(concepto);
    }
}
