import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Chip,
  TextField,
  Pagination,
  CircularProgress,
  Alert,
  Box,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Search, Clear, PersonAdd } from "@mui/icons-material";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import api from "../../services/api";
import ModalCrearSocio from "../../Components/modals/ModalCrearSocio";
import ModalEditarSocio from "../../Components/modals/ModalEditarSocio";
import "./Socios.css";

export default function Socios() {
  const [socios, setSocios] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [pagina, setPagina] = useState(1);
  const [filtrados, setFiltrados] = useState([]);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modalEditarAbierto, setModalEditarAbierto] = useState(false);
  const [socioEditar, setSocioEditar] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const itemsPorPagina = 10;

  const cargarSocios = async () => {
    setCargando(true);
    setError(null);

    try {
      const res = await api.get("/socios");
      setSocios(res.data || []);
    } catch (error) {
      console.error("Error al cargar socios:", error);

      let mensajeError = "Ocurrió un error inesperado al cargar los socios.";

      if (error.response) {
        mensajeError = "Error al cargar los socios del servidor.";
      } else if (error.request) {
        mensajeError = "No se pudo conectar con el servidor. Verifica tu conexión.";
      }

      setError(mensajeError);

      Swal.fire({
        icon: "error",
        title: "Error al cargar socios",
        text: mensajeError,
        confirmButtonColor: "#d32f2f",
      });
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarSocios();
  }, []);

  useEffect(() => {
    const datosFiltrados = socios.filter((s) =>
      [s.nombre, s.apellidoPaterno, s.apellidoMaterno, s.email]
        .join(" ")
        .toLowerCase()
        .includes(filtro.toLowerCase())
    );
    setFiltrados(datosFiltrados);
    setPagina(1);
  }, [filtro, socios]);

  const indiceInicio = (pagina - 1) * itemsPorPagina;
  const indiceFin = indiceInicio + itemsPorPagina;
  const datosPaginados = filtrados.slice(indiceInicio, indiceFin);

  const cambiarEstado = async (slug, nuevoEstado) => {
    try {
      await api.patch(`/socios/${slug}`, { habilitado: nuevoEstado });

      Swal.fire({
        icon: "success",
        title: "Estado actualizado",
        text: `Socio ${nuevoEstado ? "activado" : "desactivado"} exitosamente`,
        confirmButtonColor: "#d32f2f",
      });

      cargarSocios();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo cambiar el estado del socio",
        confirmButtonColor: "#d32f2f",
      });
    }
  };

  const abrirModalEditar = (socio) => {
    setSocioEditar(socio);
    setModalEditarAbierto(true);
  };

  const totalPaginas = Math.ceil(filtrados.length / itemsPorPagina);

  return (
    <div className="socios-container">
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <h1 className="page-title">Gestión de Socios</h1>
        <Button
          variant="contained"
          startIcon={<PersonAdd />}
          onClick={() => setModalAbierto(true)}
          sx={{
            backgroundColor: "#d32f2f",
            "&:hover": {
              backgroundColor: "#b71c1c",
            },
          }}
        >
          Agregar Socio
        </Button>
      </Box>

      <Box sx={{ mb: 2 }}>
        <TextField
          placeholder="Buscar por nombre, apellido o email..."
          variant="outlined"
          size="small"
          fullWidth
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
            endAdornment: filtro && (
              <InputAdornment position="end">
                <IconButton onClick={() => setFiltro("")} edge="end">
                  <Clear />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {cargando ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <TableContainer component={Paper} elevation={3}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#d32f2f" }}>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    Nombre Completo
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    Email
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    Teléfono
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    Sucursal
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    Membresía
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    Estado
                  </TableCell>
                  <TableCell
                    sx={{ color: "white", fontWeight: "bold" }}
                    align="center"
                  >
                    Acciones
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {datosPaginados.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      No se encontraron socios
                    </TableCell>
                  </TableRow>
                ) : (
                  datosPaginados.map((socio) => (
                    <TableRow key={socio.slug} hover>
                      <TableCell>
                        {socio.nombre} {socio.apellidoPaterno}{" "}
                        {socio.apellidoMaterno}
                      </TableCell>
                      <TableCell>{socio.email}</TableCell>
                      <TableCell>{socio.telefono || "N/A"}</TableCell>
                      <TableCell>{socio.nombreSucursal}</TableCell>
                      <TableCell>
                        {socio.membresiaActiva ? (
                          <Chip
                            label={socio.membresiaActual}
                            color="success"
                            size="small"
                          />
                        ) : (
                          <Chip label="Sin membresía" color="default" size="small" />
                        )}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={socio.habilitado ? "Activo" : "Inactivo"}
                          color={socio.habilitado ? "success" : "error"}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: "flex", gap: 1, justifyContent: "center" }}>
                          <Button
                            variant="outlined"
                            color="primary"
                            size="small"
                            onClick={() => abrirModalEditar(socio)}
                          >
                            Editar
                          </Button>
                          <Button
                            variant="outlined"
                            color={socio.habilitado ? "error" : "success"}
                            size="small"
                            onClick={() =>
                              cambiarEstado(socio.slug, !socio.habilitado)
                            }
                          >
                            {socio.habilitado ? "Desactivar" : "Activar"}
                          </Button>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {totalPaginas > 1 && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
              <Pagination
                count={totalPaginas}
                page={pagina}
                onChange={(e, val) => setPagina(val)}
                sx={{
                  "& .MuiPaginationItem-root.Mui-selected": {
                    backgroundColor: "#d32f2f",
                    color: "white",
                    "&:hover": {
                      backgroundColor: "#b71c1c",
                    },
                  },
                }}
              />
            </Box>
          )}
        </>
      )}

      <ModalCrearSocio
        abierto={modalAbierto}
        cerrar={() => setModalAbierto(false)}
        recargar={cargarSocios}
      />

      <ModalEditarSocio
        abierto={modalEditarAbierto}
        cerrar={() => setModalEditarAbierto(false)}
        recargar={cargarSocios}
        socio={socioEditar}
      />
    </div>
  );
}
