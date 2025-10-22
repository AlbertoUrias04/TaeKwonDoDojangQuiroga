using Api.Comun.Modelos.Cintas;
using Api.Repositorios;
using AutoMapper;

namespace Api.Servicios;

public class CintaServicio : ICintaServicio
{
    private readonly ICintaRepositorio _repositorio;
    private readonly IMapper _mapper;

    public CintaServicio(ICintaRepositorio repositorio, IMapper mapper)
    {
        _repositorio = repositorio;
        _mapper = mapper;
    }

    public async Task<IEnumerable<BuscarCintaDto>> ObtenerTodasAsync(bool? activo = null)
    {
        var cintas = await _repositorio.ObtenerOrdenadasAsync(activo);
        return _mapper.Map<IEnumerable<BuscarCintaDto>>(cintas);
    }

    public async Task<BuscarCintaDto?> ObtenerPorIdAsync(int id)
    {
        var cinta = await _repositorio.ObtenerPorIdAsync(id);
        return cinta == null ? null : _mapper.Map<BuscarCintaDto>(cinta);
    }

    public async Task<BuscarCintaDto?> ObtenerPorSlugAsync(string slug)
    {
        var cinta = await _repositorio.ObtenerPorSlugAsync(slug);
        return cinta == null ? null : _mapper.Map<BuscarCintaDto>(cinta);
    }
}
