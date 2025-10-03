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
    FormControlLabel,
    Switch,
    CircularProgress,
    InputAdornment,
} from "@mui/material";
import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Swal from "sweetalert2";
import api from "../../services/api";

const esquema = yup.object().shape({
    nombre: yup
        .string()
        .required("El nombre es obligatorio")
        .min(3, "El nombre debe tener al menos 3 caracteres")
        .max(100, "El nombre no puede exceder 100 caracteres"),
    precio: yup
        .number()
        .required("El precio es obligatorio")
        .positive("El precio debe ser mayor a 0")
        .max(999999, "El precio es demasiado alto"),
    duracionDias: yup
        .number()
        .required("La duración es obligatoria")
        .positive("La duración debe ser mayor a 0"),
    descripcion: yup
        .string()
        .max(500, "La descripción no puede exceder 500 caracteres")
        .nullable(),
    activa: yup.boolean(),
});

const duracionesPreestablecidas = [
    { valor: 1, etiqueta: "1 día" },
    { valor: 7, etiqueta: "1 semana" },
    { valor: 15, etiqueta: "15 días" },
    { valor: 30, etiqueta: "1 mes" },
    { valor: 60, etiqueta: "2 meses" },
    { valor: 90, etiqueta: "3 meses" },
    { valor: 180, etiqueta: "6 meses" },
    { valor: 365, etiqueta: "1 año" },
];

export default function ModalEditarMembresia({ abierto, cerrar, recargar, membresia }) {
    const [guardando, setGuardando] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        control,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(esquema),
    });

    useEffect(() => {
        if (membresia) {
            reset({
                nombre: membresia.nombre,
                precio: membresia.precio,
                duracionDias: membresia.duracionDias,
                descripcion: membresia.descripcion || "",
                activa: membresia.activa,
            });
        }
    }, [membresia, reset]);

    const handleClose = () => {
        if (!guardando) {
            reset();
            cerrar();
        }
    };

    const onSubmit = async (data) => {
        setGuardando(true);

        try {
            // Incluir el slug en el body de la petición
            const payload = {
                slug: membresia.slug,
                ...data
            };
            await api.put(`/membresias/${membresia.slug}`, payload);

            Swal.fire({
                icon: "success",
                title: "Membresía actualizada",
                text: "Los datos se actualizaron exitosamente",
                confirmButtonColor: "#d32f2f",
            });

            reset();
            cerrar();
            recargar();
        } catch (error) {
            console.error("Error al actualizar membresía:", error);

            let mensajeError = "Ocurrió un error inesperado";
            let detalles = "";

            if (error.response) {
                if (error.response.status === 400) {
                    mensajeError = "Datos inválidos";
                    detalles = "Verifica que toda la información esté correcta";
                } else if (error.response.status === 404) {
                    mensajeError = "Membresía no encontrada";
                    detalles = "La membresía que intentas editar no existe";
                } else {
                    mensajeError = "Error del servidor";
                    detalles = "No se pudo actualizar la membresía. Intenta nuevamente.";
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
                Editar Membresía
            </DialogTitle>
            <form onSubmit={handleSubmit(onSubmit)}>
                <DialogContent>
                    <TextField
                        label="Nombre"
                        fullWidth
                        {...register("nombre")}
                        error={!!errors.nombre}
                        helperText={errors.nombre?.message}
                        margin="normal"
                        disabled={guardando}
                    />
                    <TextField
                        label="Precio"
                        type="number"
                        fullWidth
                        {...register("precio")}
                        error={!!errors.precio}
                        helperText={errors.precio?.message}
                        margin="normal"
                        disabled={guardando}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">$</InputAdornment>
                            ),
                        }}
                    />
                    <FormControl
                        fullWidth
                        margin="normal"
                        error={!!errors.duracionDias}
                        disabled={guardando}
                    >
                        <InputLabel>Duración</InputLabel>
                        <Controller
                            name="duracionDias"
                            control={control}
                            render={({ field }) => (
                                <Select {...field} label="Duración">
                                    {duracionesPreestablecidas.map((duracion) => (
                                        <MenuItem key={duracion.valor} value={duracion.valor}>
                                            {duracion.etiqueta}
                                        </MenuItem>
                                    ))}
                                </Select>
                            )}
                        />
                        {errors.duracionDias && (
                            <FormHelperText>
                                {errors.duracionDias?.message}
                            </FormHelperText>
                        )}
                    </FormControl>
                    <TextField
                        label="Descripción (opcional)"
                        fullWidth
                        multiline
                        rows={3}
                        {...register("descripcion")}
                        error={!!errors.descripcion}
                        helperText={errors.descripcion?.message}
                        margin="normal"
                        disabled={guardando}
                    />
                    <FormControlLabel
                        control={<Switch {...register("activa")} disabled={guardando} />}
                        label="Activa"
                        sx={{ mt: 2 }}
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
