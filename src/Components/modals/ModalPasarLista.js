import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  CircularProgress,
  Alert,
  Box,
  Typography,
  TextField,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  Snackbar,
} from "@mui/material";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import api from "../../services/api";
import { registrarAsistenciasMasivas, obtenerAsistencias } from "../../services/asistenciasService";

export default function ModalPasarLista({ abierto, cerrar, clase }) {
  const [alumnos, setAlumnos] = useState([]);
  const [asistencias, setAsistencias] = useState({});
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);
  const [historialFechas, setHistorialFechas] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState(null);
  const [mensajeExito, setMensajeExito] = useState(false);

  useEffect(() => {
    if (abierto && clase) {
      cargarAlumnos();
      cargarHistorialFechas();
    }
  }, [abierto, clase]);

  useEffect(() => {
    if (abierto && clase && alumnos.length > 0) {
      cargarAsistenciasPorFecha();
    }
  }, [fecha, alumnos]);

  const cargarHistorialFechas = async () => {
    try {
      const response = await obtenerAsistencias({ claseId: clase.id });
      const asistencias = response.data || response || [];

      // Mapeo de días en español a números de día de la semana (0 = Domingo, 1 = Lunes, etc.)
      const diasSemana = {
        'domingo': 0,
        'lunes': 1,
        'martes': 2,
        'miércoles': 3,
        'miercoles': 3, // Sin acento
        'jueves': 4,
        'viernes': 5,
        'sábado': 6,
        'sabado': 6 // Sin acento
      };

      // Obtener los días de la semana de esta clase
      const diasClase = clase.dias
        .toLowerCase()
        .split(',')
        .map(d => d.trim())
        .map(d => diasSemana[d])
        .filter(d => d !== undefined);

      // Extraer fechas únicas y filtrar solo las que coincidan con los días de la clase
      const fechasUnicas = [...new Set(asistencias.map(a => a.fecha.split('T')[0]))]
        .filter(fechaStr => {
          const fecha = new Date(fechaStr + 'T00:00:00');
          const diaSemana = fecha.getDay();
          return diasClase.includes(diaSemana);
        });

      fechasUnicas.sort((a, b) => new Date(b) - new Date(a));
      setHistorialFechas(fechasUnicas.slice(0, 10)); // Solo las últimas 10
    } catch (error) {
      // Si no hay asistencias, no es un error crítico
      setHistorialFechas([]);
    }
  };

  const cargarAlumnos = async () => {
    setCargando(true);
    setError(null);

    try {
      const resAlumnos = await api.get(`/alumnos?claseId=${clase.id}&activo=true`);
      setAlumnos(resAlumnos.data || []);
    } catch (error) {
      setError("No se pudieron cargar los alumnos de esta clase");
    } finally {
      setCargando(false);
    }
  };

  const cargarAsistenciasPorFecha = async () => {
    try {
      const resAsistencias = await obtenerAsistencias({
        claseId: clase.id,
        fecha: fecha
      });
      const asistencias = resAsistencias.data || resAsistencias || [];

      const asistenciasMap = {};
      asistencias.forEach(asist => {
        asistenciasMap[asist.alumnoId] = asist.presente;
      });
      setAsistencias(asistenciasMap);
    } catch (error) {
      // Si no hay asistencias para esta fecha, inicializar vacío
      setAsistencias({});
    }
  };

  const handleToggleAsistencia = (alumnoId) => {
    setAsistencias(prev => ({
      ...prev,
      [alumnoId]: !prev[alumnoId]
    }));
  };

  const handleGuardar = async () => {
    setGuardando(true);

    try {
      const asistenciasArray = alumnos.map(alumno => ({
        alumnoId: alumno.id,
        presente: asistencias[alumno.id] || false
      }));

      const payload = {
        claseId: clase.id,
        fecha: fecha + "T00:00:00", // Formato ISO completo
        asistencias: asistenciasArray
      };

      await registrarAsistenciasMasivas(payload);

      // Recargar historial primero
      await cargarHistorialFechas();

      // Mostrar mensaje de éxito discreto
      setMensajeExito(true);
    } catch (error) {
      let mensajeError = "No se pudieron guardar las asistencias";

      if (error.response?.data?.message) {
        mensajeError = error.response.data.message;
      } else if (error.response?.data?.errors) {
        mensajeError = error.response.data.errors.join(", ");
      } else if (error.message) {
        mensajeError = error.message;
      }

      Swal.fire({
        icon: "error",
        title: "Error al guardar",
        text: mensajeError,
        confirmButtonColor: "#d32f2f",
      });
    } finally {
      setGuardando(false);
    }
  };

  const handleClose = () => {
    if (!guardando) {
      cerrar();
      setTimeout(() => {
        setAlumnos([]);
        setAsistencias({});
        setHistorialFechas([]);
        setError(null);
        setFecha(new Date().toISOString().split('T')[0]);
      }, 300);
    }
  };

  const handleSeleccionarFecha = (fechaHistorial) => {
    setFecha(fechaHistorial);
  };

  const contarPresentes = () => {
    return Object.values(asistencias).filter(presente => presente).length;
  };

  const contarAusentes = () => {
    return alumnos.length - contarPresentes();
  };

  const formatearFecha = (fechaStr) => {
    const fecha = new Date(fechaStr + 'T00:00:00');
    return fecha.toLocaleDateString('es-MX', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <>
      <Dialog open={abierto} onClose={handleClose} maxWidth="lg" fullWidth>
        <DialogTitle sx={{ color: "#d32f2f", fontWeight: "bold" }}>
          Pasar Lista: {clase?.nombre}
        </DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", gap: 2 }}>
          {/* Panel izquierdo - Historial */}
          <Box sx={{ width: "250px", borderRight: "1px solid #e0e0e0", pr: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: "bold", color: "#666" }}>
              Historial de Lista
            </Typography>
            {historialFechas.length === 0 ? (
              <Alert severity="info" sx={{ fontSize: "0.8rem" }}>
                No hay registros previos
              </Alert>
            ) : (
              <List dense sx={{ maxHeight: 400, overflow: "auto" }}>
                {historialFechas.map((fechaHistorial) => (
                  <ListItem
                    key={fechaHistorial}
                    button
                    selected={fechaHistorial === fecha}
                    onClick={() => handleSeleccionarFecha(fechaHistorial)}
                    sx={{
                      borderRadius: 1,
                      mb: 0.5,
                      backgroundColor: fechaHistorial === fecha ? "#ffebee" : "transparent",
                      "&:hover": {
                        backgroundColor: fechaHistorial === fecha ? "#ffcdd2" : "#f5f5f5"
                      }
                    }}
                  >
                    <ListItemText
                      primary={formatearFecha(fechaHistorial)}
                      primaryTypographyProps={{ fontSize: "0.85rem" }}
                    />
                    {fechaHistorial === fecha && (
                      <Chip label="Actual" size="small" color="error" sx={{ height: 20, fontSize: "0.7rem" }} />
                    )}
                  </ListItem>
                ))}
              </List>
            )}
          </Box>

          {/* Panel derecho - Lista actual */}
          <Box sx={{ flex: 1 }}>
            {clase && (
              <Box sx={{ mb: 2, p: 2, backgroundColor: "#f5f5f5", borderRadius: 1 }}>
                <Typography variant="body2">
                  <strong>Horario:</strong> {clase.dias} de {clase.horaInicio} a {clase.horaFin}
                </Typography>
                <Typography variant="body2">
                  <strong>Tipo:</strong> {clase.tipoClase}
                </Typography>
                <Box sx={{ mt: 1 }}>
                  <TextField
                    label="Fecha"
                    type="date"
                    value={fecha}
                    onChange={(e) => setFecha(e.target.value)}
                    size="small"
                    InputLabelProps={{ shrink: true }}
                    disabled={guardando}
                    fullWidth
                  />
                </Box>
              </Box>
            )}

            {!cargando && alumnos.length > 0 && (
              <Box sx={{ mb: 2, display: "flex", gap: 2, justifyContent: "center" }}>
                <Box sx={{ textAlign: "center", p: 1, backgroundColor: "#e8f5e9", borderRadius: 1, minWidth: 100 }}>
                  <Typography variant="caption" color="text.secondary">Presentes</Typography>
                  <Typography variant="h5" sx={{ color: "#388e3c", fontWeight: "bold" }}>
                    {contarPresentes()}
                  </Typography>
                </Box>
                <Box sx={{ textAlign: "center", p: 1, backgroundColor: "#ffebee", borderRadius: 1, minWidth: 100 }}>
                  <Typography variant="caption" color="text.secondary">Ausentes</Typography>
                  <Typography variant="h5" sx={{ color: "#d32f2f", fontWeight: "bold" }}>
                    {contarAusentes()}
                  </Typography>
                </Box>
                <Box sx={{ textAlign: "center", p: 1, backgroundColor: "#e3f2fd", borderRadius: 1, minWidth: 100 }}>
                  <Typography variant="caption" color="text.secondary">Total</Typography>
                  <Typography variant="h5" sx={{ color: "#1976d2", fontWeight: "bold" }}>
                    {alumnos.length}
                  </Typography>
                </Box>
              </Box>
            )}

            {cargando ? (
              <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
                <CircularProgress />
              </Box>
            ) : error ? (
              <Alert severity="error">{error}</Alert>
            ) : alumnos.length === 0 ? (
              <Alert severity="info">
                No hay alumnos inscritos en esta clase
              </Alert>
            ) : (
              <TableContainer component={Paper} elevation={2}>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ backgroundColor: "#d32f2f" }}>
                      <TableCell sx={{ color: "white", fontWeight: "bold", width: "80px" }}>
                        Presente
                      </TableCell>
                      <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                        Nombre
                      </TableCell>
                      <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                        Edad
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {alumnos.map((alumno) => {
                      const presente = asistencias[alumno.id] || false;
                      return (
                        <TableRow
                          key={alumno.id}
                          hover
                          sx={{
                            backgroundColor: presente ? "#e8f5e9" : asistencias[alumno.id] === false ? "#ffebee" : "inherit"
                          }}
                        >
                          <TableCell>
                            <Checkbox
                              checked={presente}
                              onChange={() => handleToggleAsistencia(alumno.id)}
                              color="success"
                              disabled={guardando}
                            />
                          </TableCell>
                          <TableCell>
                            {alumno.nombre} {alumno.apellidoPaterno} {alumno.apellidoMaterno}
                          </TableCell>
                          <TableCell>{alumno.edad} años</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={handleClose} variant="outlined" disabled={guardando}>
          Cancelar
        </Button>
        {alumnos.length > 0 && (
          <Button
            onClick={handleGuardar}
            variant="contained"
            disabled={guardando || cargando}
            startIcon={guardando && <CircularProgress size={20} />}
            sx={{
              backgroundColor: "#d32f2f",
              "&:hover": {
                backgroundColor: "#b71c1c",
              },
            }}
          >
            {guardando ? "Guardando..." : "Guardar Asistencias"}
          </Button>
        )}
      </DialogActions>
      </Dialog>

      <Snackbar
        open={mensajeExito}
        autoHideDuration={3000}
        onClose={() => setMensajeExito(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setMensajeExito(false)}
          severity="success"
          sx={{ width: '100%' }}
          variant="filled"
        >
          Asistencias guardadas exitosamente
        </Alert>
      </Snackbar>
    </>
  );
}
