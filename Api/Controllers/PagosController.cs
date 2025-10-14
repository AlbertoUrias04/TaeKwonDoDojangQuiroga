using Api.Comun.Modelos.Pagos;
using Api.Entidades; 
using Api.Persistencia;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;


namespace Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PagosController : ControllerBase
    {
        private readonly AplicacionBdContexto _contexto;

        public PagosController(AplicacionBdContexto contexto)
        {
            _contexto = contexto;
        }

        // GET: api/pagos
        [HttpGet]
        public async Task<IActionResult> ObtenerPagos()
        {
            var pagos = await _contexto.Pagos
                .Include(p => p.Socio) // Incluir datos del Socio
                .Include(p => p.Sucursal) // Incluir datos de la Sucursal
                .Include(p => p.UsuarioRegistro) // Incluir datos del Usuario que registró
                .OrderByDescending(p => p.Fecha) // Corregido: FechaPago -> Fecha
                .ToListAsync();

            return Ok(pagos);
        }

        // POST: api/pagos
        [HttpPost]
        public async Task<IActionResult> CrearPago([FromBody] CrearPagoDto nuevoPago)
        {
            if (nuevoPago == null)
            {
                return BadRequest("Datos del pago inválidos.");
            }

            var pago = new Pago
            {
                Monto = nuevoPago.Monto,
                MetodoPago = nuevoPago.MetodoPago,
                Referencia = nuevoPago.Referencia,
                SocioId = nuevoPago.SocioId,
                SocioMembresiaId = nuevoPago.SocioMembresiaId,
                SucursalId = nuevoPago.SucursalId,
                UsuarioRegistroId = nuevoPago.UsuarioRegistroId,
                Fecha = DateTime.UtcNow, // Corregido: FechaPago -> Fecha
                Estado = "Confirmado" // Asignamos un estado por defecto
            };

            await _contexto.Pagos.AddAsync(pago);
            await _contexto.SaveChangesAsync();

            return Ok(new { message = "Pago registrado con éxito" });
        }
    }
}