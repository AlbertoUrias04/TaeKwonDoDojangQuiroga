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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from "@mui/material";
import { Search, Clear, PersonAdd, FilterList, ExpandMore } from "@mui/icons-material";
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

  // Función para determinar si un color es claro u oscuro
  const esColorClaro = (hexColor) => {
    if (!hexColor) return false;
    const hex = hexColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const brightness = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return brightness > 155;
  };

  // Filtros avanzados
  const [filtroEstado, setFiltroEstado] = useState("");
  const [filtroCinta, setFiltroCinta] = useState("");
  const [filtroClase, setFiltroClase] = useState("");
  const [filtroMensualidad, setFiltroMensualidad] = useState("");
  const [filtroEdadMin, setFiltroEdadMin] = useState("");
  const [filtroEdadMax, setFiltroEdadMax] = useState("");

  // Datos para filtros
  const [cintas, setCintas] = useState([]);
  const [clases, setClases] = useState([]);
  const [conceptos, setConceptos] = useState([]);

  const itemsPorPagina = 10;

  const cargarSocios = async () => {
    setCargando(true);
    setError(null);

    try {
      const res = await api.get("/alumnos");
      setSocios(res.data || []);
    } catch (error) {
      let mensajeError = "Ocurrió un error inesperado al cargar los alumnos.";

      if (error.response) {
        mensajeError = "Error al cargar los alumnos del servidor.";
      } else if (error.request) {
        mensajeError = "No se pudo conectar con el servidor. Verifica tu conexión.";
      }

      setError(mensajeError);

      Swal.fire({
        icon: "error",
        title: "Error al cargar alumnos",
        text: mensajeError,
        confirmButtonColor: "#d32f2f",
      });
    } finally {
      setCargando(false);
    }
  };

  const cargarDatosFiltros = async () => {
    try {
      const [resCintas, resClases, resConceptos] = await Promise.all([
        api.get("/cintas?activo=true"),
        api.get("/clases?activo=true"),
        api.get("/conceptos?activo=true&tipoConcepto=Mensualidad"),
      ]);

      setCintas(resCintas.data || []);
      setClases(resClases.data || []);
      setConceptos(resConceptos.data || []);
    } catch (error) {
      // Error al cargar datos de filtros
    }
  };

  useEffect(() => {
    cargarSocios();
    cargarDatosFiltros();
  }, []);

  useEffect(() => {
    let datosFiltrados = socios;

    // Filtro de texto
    if (filtro) {
      datosFiltrados = datosFiltrados.filter((s) =>
        [s.nombre, s.apellidoPaterno, s.apellidoMaterno, s.nombreTutor, s.emailTutor]
          .join(" ")
          .toLowerCase()
          .includes(filtro.toLowerCase())
      );
    }

    // Filtro de estado
    if (filtroEstado !== "") {
      datosFiltrados = datosFiltrados.filter(
        (s) => s.activo === (filtroEstado === "true")
      );
    }

    // Filtro de cinta
    if (filtroCinta) {
      datosFiltrados = datosFiltrados.filter(
        (s) => s.cintaActualId === parseInt(filtroCinta)
      );
    }

    // Filtro de clase
    if (filtroClase) {
      datosFiltrados = datosFiltrados.filter(
        (s) => s.claseId === parseInt(filtroClase)
      );
    }

    // Filtro de mensualidad
    if (filtroMensualidad) {
      datosFiltrados = datosFiltrados.filter(
        (s) => s.conceptoMensualidadId === parseInt(filtroMensualidad)
      );
    }

    // Filtro de edad mínima
    if (filtroEdadMin && filtroEdadMin !== "") {
      const edadMin = parseInt(filtroEdadMin);
      if (!isNaN(edadMin)) {
        datosFiltrados = datosFiltrados.filter(
          (s) => s.edad >= edadMin
        );
      }
    }

    // Filtro de edad máxima
    if (filtroEdadMax && filtroEdadMax !== "") {
      const edadMax = parseInt(filtroEdadMax);
      if (!isNaN(edadMax)) {
        datosFiltrados = datosFiltrados.filter(
          (s) => s.edad <= edadMax
        );
      }
    }

    setFiltrados(datosFiltrados);
    setPagina(1);
  }, [
    filtro,
    socios,
    filtroEstado,
    filtroCinta,
    filtroClase,
    filtroMensualidad,
    filtroEdadMin,
    filtroEdadMax,
  ]);

  const indiceInicio = (pagina - 1) * itemsPorPagina;
  const indiceFin = indiceInicio + itemsPorPagina;
  const datosPaginados = filtrados.slice(indiceInicio, indiceFin);

  const cambiarEstado = async (slug, nuevoEstado) => {
    try {
      await api.patch(`/alumnos/${slug}/estado`, { activo: nuevoEstado });

      Swal.fire({
        icon: "success",
        title: "Estado actualizado",
        text: `Alumno ${nuevoEstado ? "activado" : "desactivado"} exitosamente`,
        confirmButtonColor: "#d32f2f",
      });

      cargarSocios();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo cambiar el estado del alumno",
        confirmButtonColor: "#d32f2f",
      });
    }
  };

  const abrirModalEditar = (socio) => {
    setSocioEditar(socio);
    setModalEditarAbierto(true);
  };

  const limpiarTodosFiltros = () => {
    setFiltro("");
    setFiltroEstado("");
    setFiltroCinta("");
    setFiltroClase("");
    setFiltroMensualidad("");
    setFiltroEdadMin("");
    setFiltroEdadMax("");
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
        <h1 className="page-title">Gestión de Alumnos</h1>
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
          Agregar Alumno
        </Button>
      </Box>

      <Box sx={{ mb: 2 }}>
        <TextField
          placeholder="Buscar por nombre, apellido o tutor..."
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

      <Accordion sx={{ mb: 2 }}>
        <AccordionSummary
          expandIcon={<ExpandMore />}
          aria-controls="filtros-content"
          id="filtros-header"
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <FilterList />
            <Typography>Filtros Avanzados</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "1fr 1fr 1fr" },
              gap: 2,
            }}
          >
            <FormControl size="small" fullWidth>
              <InputLabel>Estado</InputLabel>
              <Select
                value={filtroEstado}
                label="Estado"
                onChange={(e) => setFiltroEstado(e.target.value)}
              >
                <MenuItem value="">Todos</MenuItem>
                <MenuItem value="true">Activos</MenuItem>
                <MenuItem value="false">Inactivos</MenuItem>
              </Select>
            </FormControl>

            <FormControl size="small" fullWidth>
              <InputLabel>Cinta</InputLabel>
              <Select
                value={filtroCinta}
                label="Cinta"
                onChange={(e) => setFiltroCinta(e.target.value)}
              >
                <MenuItem value="">Todas</MenuItem>
                {cintas.map((cinta) => (
                  <MenuItem key={cinta.id} value={cinta.id}>
                    {cinta.nombre}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl size="small" fullWidth>
              <InputLabel>Clase/Horario</InputLabel>
              <Select
                value={filtroClase}
                label="Clase/Horario"
                onChange={(e) => setFiltroClase(e.target.value)}
              >
                <MenuItem value="">Todas</MenuItem>
                {clases.map((clase) => (
                  <MenuItem key={clase.id} value={clase.id}>
                    {clase.nombre} - {clase.dias}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl size="small" fullWidth>
              <InputLabel>Mensualidad</InputLabel>
              <Select
                value={filtroMensualidad}
                label="Mensualidad"
                onChange={(e) => setFiltroMensualidad(e.target.value)}
              >
                <MenuItem value="">Todas</MenuItem>
                {conceptos.map((concepto) => (
                  <MenuItem key={concepto.id} value={concepto.id}>
                    {concepto.nombre}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Edad Mínima"
              type="number"
              size="small"
              fullWidth
              value={filtroEdadMin}
              onChange={(e) => setFiltroEdadMin(e.target.value)}
              inputProps={{ min: 0, max: 100 }}
            />

            <TextField
              label="Edad Máxima"
              type="number"
              size="small"
              fullWidth
              value={filtroEdadMax}
              onChange={(e) => setFiltroEdadMax(e.target.value)}
              inputProps={{ min: 0, max: 100 }}
            />
          </Box>

          {(filtroEstado ||
            filtroCinta ||
            filtroClase ||
            filtroMensualidad ||
            filtroEdadMin ||
            filtroEdadMax) && (
            <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
              <Button
                variant="outlined"
                size="small"
                startIcon={<Clear />}
                onClick={limpiarTodosFiltros}
              >
                Limpiar Filtros
              </Button>
            </Box>
          )}
        </AccordionDetails>
      </Accordion>

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
                    Edad
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    Cinta
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    Clase
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    Horario
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    Tutor
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    Teléfono Tutor
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    Mensualidad
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
                    <TableCell colSpan={10} align="center">
                      No se encontraron alumnos
                    </TableCell>
                  </TableRow>
                ) : (
                  datosPaginados.map((alumno) => (
                    <TableRow key={alumno.slug} hover>
                      <TableCell>
                        {alumno.nombreCompleto || `${alumno.nombre} ${alumno.apellidoPaterno} ${alumno.apellidoMaterno}`}
                      </TableCell>
                      <TableCell>{alumno.edad} años</TableCell>
                      <TableCell>
                        {alumno.cintaActualNombre ? (
                          <Chip
                            label={alumno.cintaActualNombre}
                            size="small"
                            sx={{
                              backgroundColor: alumno.cintaActualColor || "#666",
                              color: esColorClaro(alumno.cintaActualColor) ? "#000" : "#fff",
                              fontWeight: 600,
                            }}
                          />
                        ) : (
                          "Sin cinta"
                        )}
                      </TableCell>
                      <TableCell>
                        {alumno.claseNombre || "Sin clase"}
                      </TableCell>
                      <TableCell>
                        {alumno.claseHorario || "-"}
                      </TableCell>
                      <TableCell>{alumno.nombreTutor}</TableCell>
                      <TableCell>{alumno.telefonoTutor || "N/A"}</TableCell>
                      <TableCell>
                        {alumno.conceptoMensualidadNombre ? (
                          <Chip
                            label={alumno.conceptoMensualidadNombre}
                            color="success"
                            size="small"
                          />
                        ) : (
                          <Chip label="Sin mensualidad" color="default" size="small" />
                        )}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={alumno.activo ? "Activo" : "Inactivo"}
                          color={alumno.activo ? "success" : "error"}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: "flex", gap: 1, justifyContent: "center" }}>
                          <Button
                            variant="outlined"
                            color="primary"
                            size="small"
                            onClick={() => abrirModalEditar(alumno)}
                          >
                            Editar
                          </Button>
                          <Button
                            variant="outlined"
                            color={alumno.activo ? "error" : "success"}
                            size="small"
                            onClick={() =>
                              cambiarEstado(alumno.slug, !alumno.activo)
                            }
                          >
                            {alumno.activo ? "Desactivar" : "Activar"}
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
