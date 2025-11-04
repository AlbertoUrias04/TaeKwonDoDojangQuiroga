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
    CircularProgress,
    Box,
    Chip,
    Typography,
} from "@mui/material";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Swal from "sweetalert2";
import { crearClase } from "../../services/clasesService";

const esquema = yup.object().shape({
    nombre: yup
        .string()
        .required("El nombre es obligatorio")
        .min(3, "El nombre debe tener al menos 3 caracteres")
        .max(100, "El nombre no puede exceder 100 caracteres"),
    dias: yup
        .string()
        .required("Los días son obligatorios")
        .max(50, "Los días no pueden exceder 50 caracteres"),
    horaInicio: yup
        .string()
        .required("La hora de inicio es obligatoria")
        .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Formato de hora inválido (HH:MM)"),
    horaFin: yup
        .string()
        .required("La hora de fin es obligatoria")
        .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Formato de hora inválido (HH:MM)"),
    cupoMaximo: yup
        .number()
        .required("El cupo máximo es obligatorio")
        .positive("El cupo debe ser mayor a 0")
        .integer("El cupo debe ser un número entero")
        .min(1, "El cupo mínimo es 1")
        .max(100, "El cupo máximo es 100"),
    tipoClase: yup
        .string()
        .required("El tipo de clase es obligatorio"),
});

const diasSemana = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

export default function ModalCrearClase({ abierto, cerrar, recargar }) {
    const [guardando, setGuardando] = useState(false);
    const [diasSeleccionados, setDiasSeleccionados] = useState([]);

    const {
        register,
        handleSubmit,
        reset,
        control,
        setValue,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(esquema),
        defaultValues: {
            nombre: "",
            dias: "",
            horaInicio: "",
            horaFin: "",
            cupoMaximo: 20,
            tipoClase: "",
        },
    });

    const toggleDia = (dia) => {
        let nuevosDias;
        if (diasSeleccionados.includes(dia)) {
            nuevosDias = diasSeleccionados.filter(d => d !== dia);
        } else {
            nuevosDias = [...diasSeleccionados, dia];
        }
        setDiasSeleccionados(nuevosDias);
        setValue("dias", nuevosDias.join(", "));
    };

    const handleClose = () => {
        if (!guardando) {
            reset();
            setDiasSeleccionados([]);
            cerrar();
        }
    };

    const onSubmit = async (data) => {
        setGuardando(true);

        try {
            // Convertir horas a TimeSpan format
            const payload = {
                ...data,
                horaInicio: `${data.horaInicio}:00`,
                horaFin: `${data.horaFin}:00`,
            };

            await crearClase(payload);

            Swal.fire({
                icon: "success",
                title: "Clase creada",
                text: "La clase se ha registrado exitosamente",
                confirmButtonColor: "#d32f2f",
            });

            reset();
            setDiasSeleccionados([]);
            cerrar();
            recargar();
        } catch (error) {
            let mensajeError = "Ocurrió un error inesperado al guardar la clase";
            let detalles = "";

            if (error.response) {
                if (error.response.status === 400) {
                    mensajeError = "Datos inválidos";
                    detalles = error.response.data?.message || "Verifica que todos los datos sean correctos";
                } else if (error.response.status === 409) {
                    mensajeError = "Clase duplicada";
                    detalles = error.response.data?.message || "Ya existe una clase con este nombre.";
                } else {
                    mensajeError = "Error del servidor";
                    detalles = "No se pudo guardar la clase. Intenta nuevamente.";
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
        <Dialog
            open={abierto}
            onClose={handleClose}
            maxWidth="sm"
            fullWidth
            disableEscapeKeyDown={guardando}
        >
            <DialogTitle sx={{ color: "#d32f2f", fontWeight: "bold" }}>
                Nueva Clase
            </DialogTitle>
            <form onSubmit={handleSubmit(onSubmit)}>
                <DialogContent>
                    <TextField
                        label="Nombre de la Clase"
                        fullWidth
                        {...register("nombre")}
                        error={!!errors.nombre}
                        helperText={errors.nombre?.message}
                        margin="normal"
                        disabled={guardando}
                        autoFocus
                    />
                    <Box sx={{ mt: 2, mb: 1 }}>
                        <Typography variant="subtitle2" sx={{ mb: 1, color: "#666" }}>
                            Días de la semana
                        </Typography>
                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                            {diasSemana.map((dia) => (
                                <Chip
                                    key={dia}
                                    label={dia}
                                    onClick={() => toggleDia(dia)}
                                    color={diasSeleccionados.includes(dia) ? "primary" : "default"}
                                    variant={diasSeleccionados.includes(dia) ? "filled" : "outlined"}
                                    disabled={guardando}
                                    sx={{ cursor: "pointer" }}
                                />
                            ))}
                        </Box>
                        {errors.dias && (
                            <Typography variant="caption" sx={{ color: "#d32f2f", mt: 1, display: "block" }}>
                                {errors.dias?.message}
                            </Typography>
                        )}
                    </Box>
                    <input type="hidden" {...register("dias")} />
                    <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, mt: 2 }}>
                        <TextField
                            label="Hora de Inicio"
                            type="time"
                            fullWidth
                            {...register("horaInicio")}
                            error={!!errors.horaInicio}
                            helperText={errors.horaInicio?.message}
                            disabled={guardando}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                        <TextField
                            label="Hora de Fin"
                            type="time"
                            fullWidth
                            {...register("horaFin")}
                            error={!!errors.horaFin}
                            helperText={errors.horaFin?.message}
                            disabled={guardando}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </Box>
                    <TextField
                        label="Cupo Máximo"
                        type="number"
                        fullWidth
                        {...register("cupoMaximo")}
                        error={!!errors.cupoMaximo}
                        helperText={errors.cupoMaximo?.message}
                        margin="normal"
                        disabled={guardando}
                    />
                    <TextField
                        label="Tipo de Clase (ej: Infantil, Juvenil, Adultos)"
                        fullWidth
                        {...register("tipoClase")}
                        error={!!errors.tipoClase}
                        helperText={errors.tipoClase?.message || "Puedes escribir cualquier tipo de clase"}
                        margin="normal"
                        disabled={guardando}
                        placeholder="Infantil"
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
                        {guardando ? "Guardando..." : "Guardar"}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}
