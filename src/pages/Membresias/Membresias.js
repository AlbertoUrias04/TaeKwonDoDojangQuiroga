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
  CircularProgress,
  Alert,
  Box,
  InputAdornment,
  IconButton,
  Card,
  CardContent,
  Grid,
} from "@mui/material";
import { Search, Clear, Add, FitnessCenter } from "@mui/icons-material";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import api from "../../services/api";
import ModalCrearMembresia from "../../Components/modals/ModalCrearMembresia";
import ModalEditarMembresia from "../../Components/modals/ModalEditarMembresia";
import "./Membresias.css";

export default function Membresias() {
  const [membresias, setMembresias] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [filtrados, setFiltrados] = useState([]);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modalEditarAbierto, setModalEditarAbierto] = useState(false);
  const [membresiaEditar, setMembresiaEditar] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const cargarMembresias = async () => {
    setCargando(true);
    setError(null);

    try {
      const res = await api.get("/membresias");
      setMembresias(res.data || []);
    } catch (error) {
      console.error("Error al cargar membresías:", error);

      let mensajeError = "Ocurrió un error inesperado al cargar las membresías.";

      if (error.response) {
        mensajeError = "Error al cargar las membresías del servidor.";
      } else if (error.request) {
        mensajeError =
          "No se pudo conectar con el servidor. Verifica tu conexión.";
      }

      setError(mensajeError);

      Swal.fire({
        icon: "error",
        title: "Error al cargar membresías",
        text: mensajeError,
        confirmButtonColor: "#d32f2f",
      });
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarMembresias();
  }, []);

  useEffect(() => {
    const datosFiltrados = membresias.filter((m) =>
      m.nombre.toLowerCase().includes(filtro.toLowerCase())
    );
    setFiltrados(datosFiltrados);
  }, [filtro, membresias]);

  const cambiarEstado = async (slug, nuevoEstado) => {
    try {
      if (nuevoEstado) {
        // Activar
        await api.put(`/membresias/${slug}`, {
          ...membresias.find((m) => m.slug === slug),
          activa: nuevoEstado,
        });
      } else {
        // Desactivar
        await api.delete(`/membresias/${slug}`);
      }

      Swal.fire({
        icon: "success",
        title: "Estado actualizado",
        text: `Membresía ${nuevoEstado ? "activada" : "desactivada"} exitosamente`,
        confirmButtonColor: "#d32f2f",
      });

      cargarMembresias();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo cambiar el estado de la membresía",
        confirmButtonColor: "#d32f2f",
      });
    }
  };

  const abrirModalEditar = (membresia) => {
    setMembresiaEditar(membresia);
    setModalEditarAbierto(true);
  };

  const getDuracionTexto = (dias) => {
    if (dias === 1) return "1 día";
    if (dias === 7) return "1 semana";
    if (dias === 30) return "1 mes";
    if (dias === 90) return "3 meses";
    if (dias === 180) return "6 meses";
    if (dias === 365) return "1 año";
    return `${dias} días`;
  };

  return (
    <div className="membresias-container">
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <h1 className="page-title">Gestión de Membresías</h1>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setModalAbierto(true)}
          sx={{
            backgroundColor: "#d32f2f",
            "&:hover": {
              backgroundColor: "#b71c1c",
            },
          }}
        >
          Nueva Membresía
        </Button>
      </Box>

      <Box sx={{ mb: 3 }}>
        <TextField
          placeholder="Buscar membresía por nombre..."
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
          <Grid container spacing={3} sx={{ mb: 3 }}>
            {filtrados.map((membresia) => (
              <Grid item xs={12} sm={6} md={4} key={membresia.slug}>
                <Card
                  elevation={3}
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    borderTop: membresia.activa
                      ? "4px solid #d32f2f"
                      : "4px solid #9e9e9e",
                  }}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        mb: 2,
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <h3 style={{ margin: 0 }}>{membresia.nombre}</h3>
                      </Box>
                      <Chip
                        label={membresia.activa ? "Activa" : "Inactiva"}
                        color={membresia.activa ? "success" : "default"}
                        size="small"
                      />
                    </Box>

                    <Box sx={{ mb: 2 }}>
                      <p
                        style={{
                          fontSize: "2rem",
                          fontWeight: "bold",
                          color: "#d32f2f",
                          margin: 0,
                        }}
                      >
                        ${membresia.precio.toLocaleString("es-MX")}
                      </p>
                      <p style={{ color: "#666", margin: 0 }}>
                        {getDuracionTexto(membresia.duracionDias)}
                      </p>
                    </Box>

                    {membresia.descripcion && (
                      <p
                        style={{
                          fontSize: "0.9rem",
                          color: "#666",
                          marginBottom: "1rem",
                        }}
                      >
                        {membresia.descripcion}
                      </p>
                    )}

                    <Box
                      sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}
                    >
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => abrirModalEditar(membresia)}
                        sx={{
                          backgroundColor: "#d32f2f",
                          "&:hover": {
                            backgroundColor: "#b71c1c",
                          },
                        }}
                      >
                        Editar
                      </Button>
                      <Button
                        variant="outlined"
                        color={membresia.activa ? "error" : "success"}
                        size="small"
                        onClick={() =>
                          cambiarEstado(membresia.slug, !membresia.activa)
                        }
                      >
                        {membresia.activa ? "Desactivar" : "Activar"}
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}

            {filtrados.length === 0 && (
              <Grid item xs={12}>
                <Alert severity="info">
                  No se encontraron membresías
                </Alert>
              </Grid>
            )}
          </Grid>

          <TableContainer component={Paper} elevation={3} sx={{ mt: 3 }}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#d32f2f" }}>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    Nombre
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    Precio
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    Duración
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    Descripción
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
                {filtrados.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      No se encontraron membresías
                    </TableCell>
                  </TableRow>
                ) : (
                  filtrados.map((membresia) => (
                    <TableRow key={membresia.slug} hover>
                      <TableCell>{membresia.nombre}</TableCell>
                      <TableCell>
                        ${membresia.precio.toLocaleString("es-MX")}
                      </TableCell>
                      <TableCell>{getDuracionTexto(membresia.duracionDias)}</TableCell>
                      <TableCell>
                        {membresia.descripcion || "Sin descripción"}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={membresia.activa ? "Activa" : "Inactiva"}
                          color={membresia.activa ? "success" : "default"}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Box
                          sx={{
                            display: "flex",
                            gap: 1,
                            justifyContent: "center",
                          }}
                        >
                          <Button
                            variant="contained"
                            size="small"
                            onClick={() => abrirModalEditar(membresia)}
                            sx={{
                              backgroundColor: "#d32f2f",
                              "&:hover": {
                                backgroundColor: "#b71c1c",
                              },
                            }}
                          >
                            Editar
                          </Button>
                          <Button
                            variant="outlined"
                            color={membresia.activa ? "error" : "success"}
                            size="small"
                            onClick={() =>
                              cambiarEstado(membresia.slug, !membresia.activa)
                            }
                          >
                            {membresia.activa ? "Desactivar" : "Activar"}
                          </Button>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}

      <ModalCrearMembresia
        abierto={modalAbierto}
        cerrar={() => setModalAbierto(false)}
        recargar={cargarMembresias}
      />

      <ModalEditarMembresia
        abierto={modalEditarAbierto}
        cerrar={() => setModalEditarAbierto(false)}
        recargar={cargarMembresias}
        membresia={membresiaEditar}
      />
    </div>
  );
}
