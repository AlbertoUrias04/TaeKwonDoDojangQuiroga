using AutoMapper;
using Api.Comun.Modelos.Cintas;
using Api.Entidades;

namespace Api.Perfiles;

public class CintaProfile : Profile
{
    public CintaProfile()
    {
        CreateMap<Cinta, BuscarCintaDto>();
    }
}
