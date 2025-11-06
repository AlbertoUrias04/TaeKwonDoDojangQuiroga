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
  CircularProgress,
  Alert,
  Box,
  Typography,
} from "@mui/material";
import { useState, useEffect } from "react";
import api from "../../services/api";
import CintaChip from "../CintaChip";

export default function ModalVerAlumnosClase({ abierto, cerrar, clase }) {
  const [alumnos, setAlumnos] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (abierto && clase) {
      cargarAlumnos();
    }
  }, [abierto, clase]);

  const cargarAlumnos = async () => {
    setCargando(true);
    setError(null);

    try {
      const res = await api.get(`/alumnos?claseId=${clase.id}&activo=true`);
      setAlumnos(res.data || []);
    } catch (error) {
      setError("No se pudieron cargar los alumnos de esta clase");
    } finally {
      setCargando(false);
    }
  };

  const handleClose = () => {
    cerrar();
    // Limpiar estados después de que cierre el modal (delay para la animación)
    setTimeout(() => {
      setAlumnos([]);
      setError(null);
    }, 300);
  };

  return (
    <Dialog open={abierto} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ color: "#d32f2f", fontWeight: "bold" }}>
        Alumnos de la clase: {clase?.nombre}
      </DialogTitle>
      <DialogContent>
        {clase && (
          <Box sx={{ mb: 2, p: 2, backgroundColor: "#f5f5f5", borderRadius: 1 }}>
            <Typography variant="body2">
              <strong>Horario:</strong> {clase.dias} de {clase.horaInicio} a{" "}
              {clase.horaFin}
            </Typography>
            <Typography variant="body2">
              <strong>Tipo:</strong> {clase.tipoClase}
            </Typography>
            <Typography variant="body2">
              <strong>Cupo:</strong> {alumnos.length} /{" "}
              {clase.cupoMaximo || "Sin límite"}
            </Typography>
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
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    Nombre
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    Edad
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    Cinta Actual
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    Teléfono Tutor
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {alumnos.map((alumno) => (
                  <TableRow key={alumno.id} hover>
                    <TableCell>
                      {alumno.nombre} {alumno.apellidoPaterno}{" "}
                      {alumno.apellidoMaterno}
                    </TableCell>
                    <TableCell>{alumno.edad} años</TableCell>
                    <TableCell>
                      <CintaChip nombreCinta={alumno.cintaActualNombre} />
                    </TableCell>
                    <TableCell>{alumno.telefonoTutor}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={handleClose} variant="outlined">
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
