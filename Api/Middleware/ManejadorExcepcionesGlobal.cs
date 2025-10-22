using System.Net;
using System.Text.Json;
using FluentValidation;

namespace Api.Middleware;

public class ManejadorExcepcionesGlobal
{
    private readonly RequestDelegate _siguiente;
    private readonly ILogger<ManejadorExcepcionesGlobal> _logger;

    public ManejadorExcepcionesGlobal(RequestDelegate siguiente, ILogger<ManejadorExcepcionesGlobal> logger)
    {
        _siguiente = siguiente;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext contexto)
    {
        try
        {
            await _siguiente(contexto);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Ocurrió una excepción no controlada: {Message}", ex.Message);
            await ManejarExcepcionAsync(contexto, ex);
        }
    }

    private static async Task ManejarExcepcionAsync(HttpContext contexto, Exception excepcion)
    {
        contexto.Response.ContentType = "application/json";

        var respuesta = new RespuestaError
        {
            Mensaje = "Ocurrió un error en el servidor",
            Detalles = new List<string>()
        };

        switch (excepcion)
        {
            case ValidationException validationException:
                contexto.Response.StatusCode = (int)HttpStatusCode.BadRequest;
                respuesta.Mensaje = "Error de validación";
                respuesta.Detalles = validationException.Errors
                    .Select(e => e.ErrorMessage)
                    .ToList();
                break;

            case KeyNotFoundException:
                contexto.Response.StatusCode = (int)HttpStatusCode.NotFound;
                respuesta.Mensaje = excepcion.Message;
                break;

            case InvalidOperationException:
                contexto.Response.StatusCode = (int)HttpStatusCode.BadRequest;
                respuesta.Mensaje = excepcion.Message;
                break;

            case UnauthorizedAccessException:
                contexto.Response.StatusCode = (int)HttpStatusCode.Unauthorized;
                respuesta.Mensaje = "No autorizado";
                break;

            default:
                contexto.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
                respuesta.Mensaje = "Ocurrió un error interno en el servidor";
                respuesta.Detalles.Add(excepcion.Message);
                break;
        }

        var opciones = new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
        };

        var resultado = JsonSerializer.Serialize(respuesta, opciones);
        await contexto.Response.WriteAsync(resultado);
    }
}

public class RespuestaError
{
    public string Mensaje { get; set; } = string.Empty;
    public List<string> Detalles { get; set; } = new();
}
