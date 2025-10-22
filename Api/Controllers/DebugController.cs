using Api.Comun.Interfaces;
using Api.Servicios;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Api.Controllers;

[Route("debug")]
public class DebugController : ControllerBase
{
    private readonly IAplicacionBdContexto _contexto;
    private readonly IHasherServicio _hasherServicio;

    public DebugController(IAplicacionBdContexto contexto, IHasherServicio hasherServicio)
    {
        _contexto = contexto;
        _hasherServicio = hasherServicio;
    }

    [HttpGet("usuarios")]
    public async Task<IActionResult> GetUsuarios()
    {
        var usuarios = await _contexto.Usuarios
            .Select(u => new
            {
                u.Id,
                u.NombreUsuario,
                HashPreview = u.Contraseña.Substring(0, 20),
                HashLength = u.Contraseña.Length,
                u.Habilitado,
                u.Rol
            })
            .ToListAsync();

        return Ok(usuarios);
    }

    [HttpPost("test-hash")]
    public IActionResult TestHash([FromBody] string password)
    {
        var hash = _hasherServicio.GenerarHash(password);
        return Ok(new
        {
            Password = password,
            Hash = hash,
            HashLength = hash.Length
        });
    }

    [HttpPost("fix-admin-password")]
    public async Task<IActionResult> FixAdminPassword()
    {
        // Generar el hash correcto para "admin123"
        var correctHash = _hasherServicio.GenerarHash("admin123");

        var admin = await _contexto.Usuarios
            .FirstOrDefaultAsync(u => u.NombreUsuario == "admin");

        if (admin == null)
        {
            return NotFound("Usuario admin no encontrado");
        }

        var oldHash = admin.Contraseña.Substring(0, 20);
        admin.Contraseña = correctHash;
        await _contexto.SaveChangesAsync();

        return Ok(new
        {
            Message = "Contraseña actualizada correctamente",
            Usuario = "admin",
            Password = "admin123",
            OldHashPreview = oldHash,
            NewHashPreview = correctHash.Substring(0, 20),
            NewHashLength = correctHash.Length
        });
    }

    [HttpPost("corregir-codificacion")]
    public async Task<ActionResult> CorregirCodificacion()
    {
        try
        {
            var conceptos = await _contexto.Conceptos.ToListAsync();
            var corregidos = 0;

            foreach (var concepto in conceptos)
            {
                var nombreOriginal = concepto.Nombre;
                var descripcionOriginal = concepto.Descripcion;

                // Corregir Nombre
                concepto.Nombre = CorregirTexto(concepto.Nombre);

                // Corregir Descripción
                if (!string.IsNullOrEmpty(concepto.Descripcion))
                {
                    concepto.Descripcion = CorregirTexto(concepto.Descripcion);
                }

                if (concepto.Nombre != nombreOriginal || concepto.Descripcion != descripcionOriginal)
                {
                    corregidos++;
                }
            }

            await _contexto.SaveChangesAsync();

            return Ok(new
            {
                mensaje = $"Se corrigieron {corregidos} conceptos",
                totalConceptos = conceptos.Count,
                conceptosCorregidos = corregidos
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { mensaje = "Error al corregir codificación", error = ex.Message });
        }
    }

    private string CorregirTexto(string texto)
    {
        if (string.IsNullOrEmpty(texto))
            return texto;

        // Casos más comunes primero
        texto = texto.Replace("ï¿½as", "ías");
        texto = texto.Replace("ï¿½a", "ía");
        texto = texto.Replace("ï¿½o", "ío");
        texto = texto.Replace("ï¿½", "í");

        // Vocales con acento minúsculas
        texto = texto.Replace("Ã¡", "á");
        texto = texto.Replace("Ã©", "é");
        texto = texto.Replace("Ã­", "í");
        texto = texto.Replace("Ã³", "ó");
        texto = texto.Replace("Ãº", "ú");

        // Vocales con acento mayúsculas
        texto = texto.Replace("Ã", "Á");
        texto = texto.Replace("Ã‰", "É");
        texto = texto.Replace("Ã", "Ó");
        texto = texto.Replace("Ãš", "Ú");

        // Ñ
        texto = texto.Replace("Ã±", "ñ");
        texto = texto.Replace("Ã", "Ñ");

        return texto;
    }

    [HttpGet("ver-conceptos")]
    public async Task<ActionResult> VerConceptos()
    {
        var conceptos = await _contexto.Conceptos
            .Select(c => new
            {
                c.Id,
                c.Nombre,
                c.Descripcion,
                c.TipoConcepto,
                c.Activo
            })
            .ToListAsync();

        return Ok(conceptos);
    }
}
