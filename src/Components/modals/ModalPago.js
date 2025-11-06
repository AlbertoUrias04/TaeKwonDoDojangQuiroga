import {
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  CircularProgress,
  InputAdornment,
  Chip,
} from "@mui/material";
import { Payment } from "@mui/icons-material";
import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Swal from "sweetalert2";
import api from "../../services/api";
import { registrarPago } from "../../services/pagosService";
import ModernModal from "./ModernModal";

const esquema = yup.object().shape({
  alumnoId: yup
    .number()
    .required("El alumno es obligatorio")
    .positive("Selecciona un alumno"),
  conceptoId: yup
    .number()
    .required("El concepto es obligatorio")
    .positive("Selecciona un concepto"),
  monto: yup
    .number()
    .required("El monto es obligatorio")
    .positive("El monto debe ser positivo")
    .min(1, "El monto debe ser mayor a 0"),
  metodoPago: yup.string().required("El método de pago es obligatorio"),
  referencia: yup.string().nullable(),
  notas: yup.string().nullable(),
});

export default function ModalPago({ abierto, cerrar, recargar }) {
  const [guardando, setGuardando] = useState(false);
  const [alumnos, setAlumnos] = useState([]);
  const [conceptos, setConceptos] = useState([]);

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
      alumnoId: "",
      conceptoId: "",
      monto: "",
      metodoPago: "",
      referencia: "",
      notas: "",
    },
  });

  const conceptoIdWatch = watch("conceptoId");

  useEffect(() => {
    if (abierto) {
      cargarAlumnos();
      cargarConceptos();
    }
  }, [abierto]);

  useEffect(() => {
    if (conceptoIdWatch) {
      actualizarMonto();
    }
  }, [conceptoIdWatch]);

  const cargarAlumnos = async () => {
    try {
      const res = await api.get("/alumnos?activo=true");
      setAlumnos(res.data || []);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudieron cargar los alumnos",
        confirmButtonColor: "#d32f2f",
      });
    }
  };

  const cargarConceptos = async () => {
    try {
      const res = await api.get("/conceptos?activo=true");
      setConceptos(res.data || []);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudieron cargar los conceptos",
        confirmButtonColor: "#d32f2f",
      });
    }
  };

  const actualizarMonto = () => {
    if (!conceptoIdWatch) return;

    const concepto = conceptos.find((c) => c.id === conceptoIdWatch);
    if (concepto) {
      setValue("monto", concepto.precio);
    }
  };

  const handleClose = () => {
    if (!guardando) {
      reset();
      cerrar();
    }
  };

  const onSubmit = async (data) => {
    setGuardando(true);

    try {
      const pagoData = {
        alumnoId: data.alumnoId,
        conceptoId: data.conceptoId,
        monto: parseFloat(data.monto),
        metodoPago: data.metodoPago,
        referencia: data.referencia || null,
        notas: data.notas || null,
        alumnoInscripcionId: null,
      };

      await registrarPago(pagoData);

      Swal.fire({
        icon: "success",
        title: "Pago registrado",
        text: "El pago se ha registrado exitosamente",
        confirmButtonColor: "#d32f2f",
      });

      reset();
      cerrar();
      recargar();
    } catch (error) {
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
            "El alumno o concepto no existe";
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

  return (
    <ModernModal
      open={abierto}
      onClose={handleClose}
      title="Registrar Pago"
      icon={<Payment />}
      maxWidth="sm"
      actions={
        <>
          <Button
            onClick={handleClose}
            className="modal-button-secondary"
            disabled={guardando}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            form="form-pago"
            className="modal-button-primary"
            disabled={guardando}
            startIcon={guardando && <CircularProgress size={20} />}
          >
            {guardando ? "Registrando..." : "Registrar Pago"}
          </Button>
        </>
      }
    >
      <form id="form-pago" onSubmit={handleSubmit(onSubmit)}>
          <FormControl
            fullWidth
            margin="normal"
            error={!!errors.alumnoId}
            disabled={guardando}
          >
            <InputLabel>Alumno</InputLabel>
            <Controller
              name="alumnoId"
              control={control}
              render={({ field }) => (
                <Select {...field} label="Alumno">
                  <MenuItem value="">
                    <em>Selecciona un alumno</em>
                  </MenuItem>
                  {alumnos.map((alumno) => (
                    <MenuItem key={alumno.id} value={alumno.id}>
                      {alumno.nombre} {alumno.apellidoPaterno}{" "}
                      {alumno.apellidoMaterno}
                      {alumno.cintaActual && (
                        <Chip
                          label={alumno.cintaActual}
                          size="small"
                          sx={{ ml: 1 }}
                        />
                      )}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
            {errors.alumnoId && (
              <FormHelperText>{errors.alumnoId?.message}</FormHelperText>
            )}
          </FormControl>

          <FormControl
            fullWidth
            margin="normal"
            error={!!errors.conceptoId}
            disabled={guardando}
          >
            <InputLabel>Concepto</InputLabel>
            <Controller
              name="conceptoId"
              control={control}
              render={({ field }) => (
                <Select {...field} label="Concepto">
                  <MenuItem value="">
                    <em>Selecciona un concepto</em>
                  </MenuItem>
                  {conceptos.map((concepto) => (
                    <MenuItem key={concepto.id} value={concepto.id}>
                      {concepto.nombre} - ${concepto.precio.toFixed(2)}
                      <Chip
                        label={concepto.tipoConcepto}
                        size="small"
                        sx={{ ml: 1 }}
                      />
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
            {errors.conceptoId && (
              <FormHelperText>{errors.conceptoId?.message}</FormHelperText>
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

          <TextField
            label="Notas (Opcional)"
            fullWidth
            multiline
            rows={3}
            {...register("notas")}
            error={!!errors.notas}
            helperText={
              errors.notas?.message ||
              "Información adicional (ej: Aprobó examen Cinta Azul)"
            }
            margin="normal"
            disabled={guardando}
          />
      </form>
    </ModernModal>
  );
}
