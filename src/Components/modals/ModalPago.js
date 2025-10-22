import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  CircularProgress,
  InputAdornment,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormLabel,
  Box,
  Chip,
} from "@mui/material";
import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Swal from "sweetalert2";
import api from "../../services/api";
import { registrarPago } from "../../services/pagosService";

const esquema = yup.object().shape({
  socioId: yup
    .number()
    .required("El socio es obligatorio")
    .positive("Selecciona un socio"),
  membresiaId: yup
    .number()
    .required("La membresía es obligatoria")
    .positive("Selecciona una membresía"),
  monto: yup
    .number()
    .required("El monto es obligatorio")
    .positive("El monto debe ser positivo")
    .min(1, "El monto debe ser mayor a 0"),
  metodoPago: yup.string().required("El método de pago es obligatorio"),
  sucursalId: yup
    .number()
    .required("La sucursal es obligatoria")
    .positive("Selecciona una sucursal"),
  referencia: yup.string().nullable(),
});

export default function ModalPago({ abierto, cerrar, recargar }) {
  const [guardando, setGuardando] = useState(false);
  const [socios, setSocios] = useState([]);
  const [todasMembresias, setTodasMembresias] = useState([]);
  const [membresiasDelSocio, setMembresiasDelSocio] = useState([]);
  const [sucursales, setSucursales] = useState([]);
  const [socioSeleccionado, setSocioSeleccionado] = useState(null);
  const [tipoSeleccion, setTipoSeleccion] = useState("nueva"); // "existente" o "nueva"

  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(esquema),
    defaultValues: {
      socioId: "",
      membresiaId: "",
      monto: "",
      metodoPago: "",
      sucursalId: "",
      referencia: "",
    },
  });

  const socioIdWatch = watch("socioId");
  const membresiaIdWatch = watch("membresiaId");

  useEffect(() => {
    if (abierto) {
      cargarSocios();
      cargarSucursales();
      cargarTodasMembresias();
    }
  }, [abierto]);

  useEffect(() => {
    if (socioIdWatch) {
      cargarMembresiasDelSocio(socioIdWatch);
    } else {
      setMembresiasDelSocio([]);
      setValue("membresiaId", "");
      setValue("monto", "");
      setTipoSeleccion("nueva");
    }
  }, [socioIdWatch]);

  useEffect(() => {
    if (membresiaIdWatch) {
      actualizarMonto();
    }
  }, [membresiaIdWatch, tipoSeleccion]);

  const cargarSocios = async () => {
    try {
      const res = await api.get("/socios?habilitado=true");
      setSocios(res.data || []);
    } catch (error) {
      console.error("Error al cargar socios:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudieron cargar los socios",
        confirmButtonColor: "#d32f2f",
      });
    }
  };

  const cargarTodasMembresias = async () => {
    try {
      const res = await api.get("/membresias?activa=true");
      setTodasMembresias(res.data || []);
    } catch (error) {
      console.error("Error al cargar membresías:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudieron cargar las membresías",
        confirmButtonColor: "#d32f2f",
      });
    }
  };

  const cargarMembresiasDelSocio = async (socioId) => {
    try {
      const socio = socios.find((s) => s.id === socioId);
      setSocioSeleccionado(socio);

      // Obtener el socio completo con sus membresías
      const res = await api.get(`/socios/${socio.slug}`);
      const socioCompleto = res.data;

      // Obtener las membresías activas del socio
      const membresiasActivas = socioCompleto.socioMembresias?.filter(
        (sm) => sm.activa
      ) || [];

      setMembresiasDelSocio(membresiasActivas);

      // Si tiene membresías activas, sugerir tipo "existente"
      if (membresiasActivas.length > 0) {
        setTipoSeleccion("existente");
      } else {
        setTipoSeleccion("nueva");
      }
    } catch (error) {
      console.error("Error al cargar membresías del socio:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudieron cargar las membresías del socio",
        confirmButtonColor: "#d32f2f",
      });
    }
  };

  const cargarSucursales = async () => {
    try {
      const res = await api.get("/sucursales?habilitado=true");
      setSucursales(res.data || []);
    } catch (error) {
      console.error("Error al cargar sucursales:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudieron cargar las sucursales",
        confirmButtonColor: "#d32f2f",
      });
    }
  };

  const actualizarMonto = () => {
    if (!membresiaIdWatch) return;

    if (tipoSeleccion === "existente") {
      const socioMembresia = membresiasDelSocio.find(
        (sm) => sm.id === membresiaIdWatch
      );
      if (socioMembresia) {
        setValue("monto", socioMembresia.membresia.precio);
      }
    } else {
      const membresia = todasMembresias.find((m) => m.id === membresiaIdWatch);
      if (membresia) {
        setValue("monto", membresia.precio);
      }
    }
  };

  const handleClose = () => {
    if (!guardando) {
      reset();
      setMembresiasDelSocio([]);
      setSocioSeleccionado(null);
      setTipoSeleccion("nueva");
      cerrar();
    }
  };

  const handleTipoChange = (event) => {
    setTipoSeleccion(event.target.value);
    setValue("membresiaId", "");
    setValue("monto", "");
  };

  const onSubmit = async (data) => {
    setGuardando(true);

    try {
      let socioMembresiaId;

      // Si es una membresía nueva, primero crear la asociación SocioMembresia
      if (tipoSeleccion === "nueva") {
        const membresia = todasMembresias.find((m) => m.id === data.membresiaId);

        // Crear SocioMembresia
        const fechaInicio = new Date();
        const fechaFin = new Date();
        fechaFin.setDate(fechaFin.getDate() + membresia.duracionDias);

        const socioMembresiaData = {
          socioId: data.socioId,
          membresiaId: data.membresiaId,
          fechaInicio: fechaInicio.toISOString(),
          fechaFin: fechaFin.toISOString(),
          activa: true,
        };

        const resSocioMembresia = await api.post(
          "/socio-membresias",
          socioMembresiaData
        );
        socioMembresiaId = resSocioMembresia.data.id || resSocioMembresia.data;
      } else {
        // Si es una membresía existente, usar el ID directamente
        socioMembresiaId = data.membresiaId;
      }

      // Crear el pago
      const pagoData = {
        socioId: data.socioId,
        socioMembresiaId: socioMembresiaId,
        monto: data.monto,
        metodoPago: data.metodoPago,
        sucursalId: data.sucursalId,
        referencia: data.referencia,
      };

      await registrarPago(pagoData);

      Swal.fire({
        icon: "success",
        title: "Pago registrado",
        text: tipoSeleccion === "nueva"
          ? "El pago se ha registrado y la membresía ha sido asignada al socio"
          : "El pago se ha registrado exitosamente",
        confirmButtonColor: "#d32f2f",
      });

      reset();
      setMembresiasDelSocio([]);
      setSocioSeleccionado(null);
      setTipoSeleccion("nueva");
      cerrar();
      recargar();
    } catch (error) {
      console.error("Error al registrar pago:", error);

      let mensajeError = "Ocurrió un error inesperado al registrar el pago";
      let detalles = "";

      if (error.response) {
        if (error.response.status === 400) {
          mensajeError = "Datos inválidos";
          detalles =
            error.response.data?.message ||
            "Verifica los datos ingresados";
        } else if (error.response.status === 404) {
          mensajeError = "Datos no encontrados";
          detalles =
            error.response.data?.message ||
            "El socio, membresía o sucursal no existe";
        } else {
          mensajeError = "Error del servidor";
          detalles = "No se pudo registrar el pago. Intenta nuevamente.";
        }
      } else if (error.request) {
        mensajeError = "Sin conexión";
        detalles =
          "No se pudo conectar con el servidor. Verifica tu conexión a internet.";
      }

      Swal.fire({
        icon: "error",
        title: mensajeError,
        text: detalles,
        confirmButtonColor: "#d32f2f",
      });
    } finally {
      setGuardando(false);
    }
  };

  const membresiasDisponibles =
    tipoSeleccion === "existente" ? membresiasDelSocio : todasMembresias;

  return (
    <Dialog
      open={abierto}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      disableEscapeKeyDown={guardando}
    >
      <DialogTitle sx={{ color: "#d32f2f", fontWeight: "bold" }}>
        Registrar Pago
      </DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <FormControl
            fullWidth
            margin="normal"
            error={!!errors.socioId}
            disabled={guardando}
          >
            <InputLabel>Socio</InputLabel>
            <Controller
              name="socioId"
              control={control}
              render={({ field }) => (
                <Select {...field} label="Socio">
                  <MenuItem value="">
                    <em>Selecciona un socio</em>
                  </MenuItem>
                  {socios.map((socio) => (
                    <MenuItem key={socio.id} value={socio.id}>
                      {socio.nombre} {socio.apellidoPaterno}{" "}
                      {socio.apellidoMaterno}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
            {errors.socioId && (
              <FormHelperText>{errors.socioId?.message}</FormHelperText>
            )}
          </FormControl>

          {socioIdWatch && (
            <Box sx={{ mt: 2, mb: 2 }}>
              <FormControl component="fieldset" disabled={guardando}>
                <FormLabel component="legend">Tipo de membresía</FormLabel>
                <RadioGroup
                  row
                  value={tipoSeleccion}
                  onChange={handleTipoChange}
                >
                  {membresiasDelSocio.length > 0 && (
                    <FormControlLabel
                      value="existente"
                      control={<Radio />}
                      label={
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          Renovar membresía activa
                          <Chip
                            label={membresiasDelSocio.length}
                            size="small"
                            color="primary"
                          />
                        </Box>
                      }
                    />
                  )}
                  <FormControlLabel
                    value="nueva"
                    control={<Radio />}
                    label="Asignar nueva membresía"
                  />
                </RadioGroup>
              </FormControl>
            </Box>
          )}

          <FormControl
            fullWidth
            margin="normal"
            error={!!errors.membresiaId}
            disabled={guardando || !socioIdWatch}
          >
            <InputLabel>Membresía</InputLabel>
            <Controller
              name="membresiaId"
              control={control}
              render={({ field }) => (
                <Select {...field} label="Membresía">
                  <MenuItem value="">
                    <em>Selecciona una membresía</em>
                  </MenuItem>
                  {tipoSeleccion === "existente"
                    ? membresiasDelSocio.map((sm) => (
                        <MenuItem key={sm.id} value={sm.id}>
                          {sm.membresia.nombre} - $
                          {sm.membresia.precio.toFixed(2)}
                          {sm.activa && (
                            <Chip
                              label="Activa"
                              size="small"
                              color="success"
                              sx={{ ml: 1 }}
                            />
                          )}
                        </MenuItem>
                      ))
                    : todasMembresias.map((m) => (
                        <MenuItem key={m.id} value={m.id}>
                          {m.nombre} - ${m.precio.toFixed(2)} ({m.duracionDias}{" "}
                          días)
                        </MenuItem>
                      ))}
                </Select>
              )}
            />
            {errors.membresiaId && (
              <FormHelperText>{errors.membresiaId?.message}</FormHelperText>
            )}
          </FormControl>

          <TextField
            label="Monto"
            type="number"
            fullWidth
            {...register("monto")}
            error={!!errors.monto}
            helperText={errors.monto?.message}
            margin="normal"
            disabled={guardando}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">$</InputAdornment>
              ),
            }}
            inputProps={{
              step: "0.01",
              min: "0",
            }}
          />

          <FormControl
            fullWidth
            margin="normal"
            error={!!errors.metodoPago}
            disabled={guardando}
          >
            <InputLabel>Método de Pago</InputLabel>
            <Controller
              name="metodoPago"
              control={control}
              render={({ field }) => (
                <Select {...field} label="Método de Pago">
                  <MenuItem value="">
                    <em>Selecciona un método</em>
                  </MenuItem>
                  <MenuItem value="Efectivo">Efectivo</MenuItem>
                  <MenuItem value="Tarjeta">Tarjeta</MenuItem>
                  <MenuItem value="Transferencia">Transferencia</MenuItem>
                </Select>
              )}
            />
            {errors.metodoPago && (
              <FormHelperText>{errors.metodoPago?.message}</FormHelperText>
            )}
          </FormControl>

          <FormControl
            fullWidth
            margin="normal"
            error={!!errors.sucursalId}
            disabled={guardando}
          >
            <InputLabel>Sucursal</InputLabel>
            <Controller
              name="sucursalId"
              control={control}
              render={({ field }) => (
                <Select {...field} label="Sucursal">
                  <MenuItem value="">
                    <em>Selecciona una sucursal</em>
                  </MenuItem>
                  {sucursales.map((sucursal) => (
                    <MenuItem key={sucursal.id} value={sucursal.id}>
                      {sucursal.nombre}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
            {errors.sucursalId && (
              <FormHelperText>{errors.sucursalId?.message}</FormHelperText>
            )}
          </FormControl>

          <TextField
            label="Referencia (Opcional)"
            fullWidth
            {...register("referencia")}
            error={!!errors.referencia}
            helperText={
              errors.referencia?.message || "Número de transacción, folio, etc."
            }
            margin="normal"
            disabled={guardando}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleClose} variant="outlined" disabled={guardando}>
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={guardando}
            startIcon={guardando && <CircularProgress size={20} />}
            sx={{
              backgroundColor: "#d32f2f",
              "&:hover": {
                backgroundColor: "#b71c1c",
              },
            }}
          >
            {guardando ? "Registrando..." : "Registrar Pago"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
