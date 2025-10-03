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
        .min(2, "El nombre debe tener al menos 2 caracteres")
        .max(50, "El nombre no puede exceder 50 caracteres"),
    apellidoPaterno: yup
        .string()
        .required("El apellido paterno es obligatorio")
        .min(2, "El apellido debe tener al menos 2 caracteres")
        .max(50, "El apellido no puede exceder 50 caracteres"),
    apellidoMaterno: yup
        .string()
        .required("El apellido materno es obligatorio")
        .min(2, "El apellido debe tener al menos 2 caracteres")
        .max(50, "El apellido no puede exceder 50 caracteres"),
    email: yup
        .string()
        .required("El email es obligatorio")
        .email("Ingresa un email válido"),
    telefono: yup
        .string()
        .matches(/^[0-9]{10}$/, "Ingresa un teléfono válido de 10 dígitos")
        .nullable(),
    fechaNacimiento: yup
        .date()
        .required("La fecha de nacimiento es obligatoria")
        .max(new Date(), "La fecha no puede ser futura")
        .test("edad-minima", "Debe ser mayor de 12 años", function(value) {
            if (!value) return false;
            const hoy = new Date();
            const edad = hoy.getFullYear() - value.getFullYear();
            return edad >= 12;
        }),
    sucursalId: yup
        .number()
        .required("La sucursal es obligatoria")
        .positive("Selecciona una sucursal"),
    habilitado: yup.boolean(),
});

export default function ModalEditarSocio({ abierto, cerrar, recargar, socio }) {
    const [guardando, setGuardando] = useState(false);
    const [sucursales, setSucursales] = useState([]);

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
        if (abierto) {
            cargarSucursales();
        }
    }, [abierto]);

    useEffect(() => {
        if (socio && sucursales.length > 0) {
            // Convertir fecha a formato YYYY-MM-DD para el input
            const fechaFormateada = socio.fechaNacimiento
                ? new Date(socio.fechaNacimiento).toISOString().split("T")[0]
                : "";

            reset({
                nombre: socio.nombre,
                apellidoPaterno: socio.apellidoPaterno,
                apellidoMaterno: socio.apellidoMaterno,
                email: socio.email,
                telefono: socio.telefono || "",
                fechaNacimiento: fechaFormateada,
                sucursalId: socio.sucursalId || "",
                habilitado: socio.habilitado ?? true,
            });
        }
    }, [socio, sucursales, reset]);

    const cargarSucursales = async () => {
        try {
            const res = await api.get("/sucursales?habilitado=true");
            setSucursales(res.data || []);
        } catch (error) {
            console.error("Error al cargar sucursales:", error);
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
            const payload = {
                ...data,
                slug: socio.slug
            };
            await api.put(`/socios/${socio.slug}`, payload);

            Swal.fire({
                icon: "success",
                title: "Socio actualizado",
                text: "Los datos se actualizaron exitosamente",
                confirmButtonColor: "#d32f2f",
            });

            reset();
            cerrar();
            recargar();
        } catch (error) {
            console.error("Error al actualizar socio:", error);

            let mensajeError = "Ocurrió un error inesperado";
            let detalles = "";

            if (error.response) {
                if (error.response.status === 400) {
                    mensajeError = "Datos duplicados";
                    detalles = error.response.data?.message || "Ya existe otro socio con este email o teléfono";
                } else if (error.response.status === 404) {
                    mensajeError = "Socio no encontrado";
                    detalles = "El socio que intentas editar no existe";
                } else {
                    mensajeError = "Error del servidor";
                    detalles = "No se pudo actualizar el socio. Intenta nuevamente.";
                }
            } else if (error.request) {
                mensajeError = "Sin conexión";
                detalles =
                    "No se pudo conectar con el servidor. Verifica tu conexión a internet.";
            }

            // Cerrar modal primero
            setGuardando(false);
            reset();
            cerrar();

            // Mostrar error después de cerrar
            setTimeout(() => {
                Swal.fire({
                    icon: "error",
                    title: mensajeError,
                    text: detalles,
                    confirmButtonColor: "#d32f2f",
                });
            }, 300);
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
                Editar Socio
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
                        label="Apellido Paterno"
                        fullWidth
                        {...register("apellidoPaterno")}
                        error={!!errors.apellidoPaterno}
                        helperText={errors.apellidoPaterno?.message}
                        margin="normal"
                        disabled={guardando}
                    />
                    <TextField
                        label="Apellido Materno"
                        fullWidth
                        {...register("apellidoMaterno")}
                        error={!!errors.apellidoMaterno}
                        helperText={errors.apellidoMaterno?.message}
                        margin="normal"
                        disabled={guardando}
                    />
                    <TextField
                        label="Email"
                        type="email"
                        fullWidth
                        {...register("email")}
                        error={!!errors.email}
                        helperText={errors.email?.message}
                        margin="normal"
                        disabled={guardando}
                    />
                    <TextField
                        label="Teléfono (10 dígitos)"
                        fullWidth
                        {...register("telefono")}
                        error={!!errors.telefono}
                        helperText={errors.telefono?.message}
                        margin="normal"
                        disabled={guardando}
                    />
                    <TextField
                        label="Fecha de Nacimiento"
                        type="date"
                        fullWidth
                        {...register("fechaNacimiento")}
                        error={!!errors.fechaNacimiento}
                        helperText={errors.fechaNacimiento?.message}
                        margin="normal"
                        disabled={guardando}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
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
                            defaultValue=""
                            render={({ field }) => (
                                <Select
                                    {...field}
                                    label="Sucursal"
                                    value={field.value || ""}
                                >
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
                    <FormControlLabel
                        control={
                            <Controller
                                name="habilitado"
                                control={control}
                                render={({ field }) => (
                                    <Switch
                                        checked={field.value}
                                        onChange={(e) => field.onChange(e.target.checked)}
                                        disabled={guardando}
                                    />
                                )}
                            />
                        }
                        label="Habilitado"
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
