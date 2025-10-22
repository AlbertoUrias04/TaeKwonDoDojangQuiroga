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
  Card,
  CardContent,
  Typography,
  Grid,
} from "@mui/material";
import { Search, Clear, PaymentRounded, AttachMoney, TrendingUp } from "@mui/icons-material";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { obtenerPagos, eliminarPago, obtenerEstadisticasPagos } from "../../services/pagosService";
import api from "../../services/api";
import ModalPago from "../../Components/modals/ModalPago";
import "./Pagos.css";

export default function Pagos() {
  const [pagos, setPagos] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [estadoFiltro, setEstadoFiltro] = useState("");
  const [sucursalFiltro, setSucursalFiltro] = useState("");
  const [pagina, setPagina] = useState(1);
  const [filtrados, setFiltrados] = useState([]);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [sucursales, setSucursales] = useState([]);
  const [estadisticas, setEstadisticas] = useState(null);

  const itemsPorPagina = 10;

  const cargarSucursales = async () => {
    try {
      const res = await api.get("/sucursales?habilitado=true");
      setSucursales(res.data || []);
    } catch (error) {
      console.error("Error al cargar sucursales:", error);
    }
  };

  const cargarEstadisticas = async () => {
    try {
      const filtros = {};
      if (sucursalFiltro) filtros.sucursalId = sucursalFiltro;

      const data = await obtenerEstadisticasPagos(filtros);
      setEstadisticas(data);
    } catch (error) {
      console.error("Error al cargar estadísticas:", error);
    }
  };

  const cargarPagos = async () => {
    setCargando(true);
    setError(null);

    try {
      const filtros = {};
      if (estadoFiltro) filtros.estado = estadoFiltro;
      if (sucursalFiltro) filtros.sucursalId = sucursalFiltro;

      const data = await obtenerPagos(filtros);
      setPagos(data || []);
    } catch (error) {
      console.error("Error al cargar pagos:", error);

      let mensajeError = "Ocurrió un error inesperado al cargar los pagos.";

      if (error.response) {
        mensajeError = "Error al cargar los pagos del servidor.";
      } else if (error.request) {
        mensajeError = "No se pudo conectar con el servidor. Verifica tu conexión.";
      }

      setError(mensajeError);

      Swal.fire({
        icon: "error",
        title: "Error al cargar pagos",
        text: mensajeError,
        confirmButtonColor: "#d32f2f",
      });
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarSucursales();
    cargarPagos();
  }, [estadoFiltro, sucursalFiltro]);

  useEffect(() => {
    cargarEstadisticas();
  }, [pagos, sucursalFiltro]);

  useEffect(() => {
    const datosFiltrados = pagos.filter((p) =>
      [p.socioNombre, p.membresiaNombre, p.metodoPago, p.referencia]
        .join(" ")
        .toLowerCase()
        .includes(filtro.toLowerCase())
    );
    setFiltrados(datosFiltrados);
    setPagina(1);
  }, [filtro, pagos]);

  const indiceInicio = (pagina - 1) * itemsPorPagina;
  const indiceFin = indiceInicio + itemsPorPagina;
  const datosPaginados = filtrados.slice(indiceInicio, indiceFin);

  const handleEliminarPago = async (id) => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d32f2f",
      cancelButtonColor: "#757575",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        await eliminarPago(id);

        Swal.fire({
          icon: "success",
          title: "Pago eliminado",
          text: "El pago se ha eliminado exitosamente",
          confirmButtonColor: "#d32f2f",
        });

        cargarPagos();
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo eliminar el pago",
          confirmButtonColor: "#d32f2f",
        });
      }
    }
  };

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString("es-MX", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatearMonto = (monto) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(monto);
  };

  const obtenerColorEstado = (estado) => {
    switch (estado) {
      case "Confirmado":
        return "success";
      case "Pendiente":
        return "warning";
      case "Rechazado":
        return "error";
      default:
        return "default";
    }
  };

  const totalPaginas = Math.ceil(filtrados.length / itemsPorPagina);

  return (
    <div className="pagos-container">
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <h1 className="page-title">Gestión de Pagos</h1>
        <Button
          variant="contained"
          startIcon={<PaymentRounded />}
          onClick={() => setModalAbierto(true)}
          sx={{
            backgroundColor: "#d32f2f",
            "&:hover": {
              backgroundColor: "#b71c1c",
            },
          }}
        >
          Registrar Pago
        </Button>
      </Box>

      {estadisticas && (
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} md={3}>
            <Card sx={{ backgroundColor: "#e3f2fd" }}>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <AttachMoney sx={{ color: "#1976d2" }} />
                  <Typography variant="h6" component="div">
                    Total Ingresos
                  </Typography>
                </Box>
                <Typography variant="h4" sx={{ mt: 1, color: "#1976d2" }}>
                  {formatearMonto(estadisticas.montoTotal)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card sx={{ backgroundColor: "#e8f5e9" }}>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <TrendingUp sx={{ color: "#388e3c" }} />
                  <Typography variant="h6" component="div">
                    Confirmados
                  </Typography>
                </Box>
                <Typography variant="h4" sx={{ mt: 1, color: "#388e3c" }}>
                  {estadisticas.pagosConfirmados}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card sx={{ backgroundColor: "#fff3e0" }}>
              <CardContent>
                <Typography variant="h6" component="div">
                  Pendientes
                </Typography>
                <Typography variant="h4" sx={{ mt: 1, color: "#f57c00" }}>
                  {estadisticas.pagosPendientes}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card sx={{ backgroundColor: "#ffebee" }}>
              <CardContent>
                <Typography variant="h6" component="div">
                  Rechazados
                </Typography>
                <Typography variant="h4" sx={{ mt: 1, color: "#d32f2f" }}>
                  {estadisticas.pagosRechazados}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      <Box sx={{ mb: 2, display: "flex", gap: 2, flexWrap: "wrap" }}>
        <TextField
          placeholder="Buscar por socio, membresía o referencia..."
          variant="outlined"
          size="small"
          sx={{ flex: 1, minWidth: "250px" }}
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

        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Estado</InputLabel>
          <Select
            value={estadoFiltro}
            label="Estado"
            onChange={(e) => setEstadoFiltro(e.target.value)}
          >
            <MenuItem value="">Todos</MenuItem>
            <MenuItem value="Confirmado">Confirmado</MenuItem>
            <MenuItem value="Pendiente">Pendiente</MenuItem>
            <MenuItem value="Rechazado">Rechazado</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel>Sucursal</InputLabel>
          <Select
            value={sucursalFiltro}
            label="Sucursal"
            onChange={(e) => setSucursalFiltro(e.target.value)}
          >
            <MenuItem value="">Todas</MenuItem>
            {sucursales.map((sucursal) => (
              <MenuItem key={sucursal.id} value={sucursal.id}>
                {sucursal.nombre}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
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
                    Fecha
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    Socio
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    Membresía
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    Monto
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    Método
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    Estado
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    Referencia
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
                    <TableCell colSpan={8} align="center">
                      No se encontraron pagos
                    </TableCell>
                  </TableRow>
                ) : (
                  datosPaginados.map((pago) => (
                    <TableRow key={pago.id} hover>
                      <TableCell>{formatearFecha(pago.fecha)}</TableCell>
                      <TableCell>{pago.socioNombre}</TableCell>
                      <TableCell>{pago.membresiaNombre}</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>
                        {formatearMonto(pago.monto)}
                      </TableCell>
                      <TableCell>{pago.metodoPago}</TableCell>
                      <TableCell>
                        <Chip
                          label={pago.estado}
                          color={obtenerColorEstado(pago.estado)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{pago.referencia || "N/A"}</TableCell>
                      <TableCell align="center">
                        <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          onClick={() => handleEliminarPago(pago.id)}
                        >
                          Eliminar
                        </Button>
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

      <ModalPago
        abierto={modalAbierto}
        cerrar={() => setModalAbierto(false)}
        recargar={cargarPagos}
      />
    </div>
  );
}
