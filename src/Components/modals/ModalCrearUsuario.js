import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    FormControlLabel,
    Switch,
    CircularProgress,
    InputAdornment,
    IconButton,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useState } from "react";
import { useForm } from "react-hook-form";
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
    nombreUsuario: yup
        .string()
        .required("El usuario es obligatorio")
        .min(4, "El usuario debe tener al menos 4 caracteres")
        .max(20, "El usuario no puede exceder 20 caracteres")
        .matches(/^[a-zA-Z0-9_]+$/, "Solo se permiten letras, números y guión bajo"),
    contraseña: yup
        .string()
        .required("La contraseña es obligatoria")
        .min(8, "La contraseña debe tener al menos 8 caracteres")
        .matches(/[A-Z]/, "Debe contener al menos una mayúscula")
        .matches(/[a-z]/, "Debe contener al menos una minúscula")
        .matches(/[0-9]/, "Debe contener al menos un número"),
    habilitado: yup.boolean().default(true),
});

export default function ModalCrearUsuario({ abierto, onClose, onGuardado }) {
    const [guardando, setGuardando] = useState(false);
    const [mostrarPassword, setMostrarPassword] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(esquema),
        defaultValues: {
            nombre: "",
            apellidoPaterno: "",
            apellidoMaterno: "",
            nombreUsuario: "",
            contraseña: "",
            habilitado: true,
        },
    });

    const handleClose = () => {
        if (!guardando) {
            reset();
            onClose();
        }
    };

    const onSubmit = async (data) => {
        setGuardando(true);

        try {
            await api.post("/usuarios", data);
            reset();
            onClose();
            onGuardado();
        } catch (error) {
            console.error("Error al guardar usuario:", error);
            
            let mensajeError = "Ocurrió un error inesperado al guardar el usuario";
            let detalles = "";
            
            if (error.response) {
                if (error.response.status === 400) {
                    mensajeError = "Datos inválidos";
                    detalles = "Verifica que toda la información esté correcta";
                } else if (error.response.status === 409) {
                    mensajeError = "Usuario duplicado";
                    detalles = "El nombre de usuario ya existe. Por favor elige otro.";
                } else {
                    mensajeError = "Error del servidor";
                    detalles = "No se pudo guardar el usuario. Intenta nuevamente.";
                }
            } else if (error.request) {
                mensajeError = "Sin conexión";
                detalles = "No se pudo conectar con el servidor. Verifica tu conexión a internet.";
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
                Nuevo Usuario
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
                        autoFocus
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
                        label="Usuario"
                        fullWidth
                        {...register("nombreUsuario")}
                        error={!!errors.nombreUsuario}
                        helperText={errors.nombreUsuario?.message}
                        margin="normal"
                        disabled={guardando}
                    />
                    <TextField
                        label="Contraseña"
                        fullWidth
                        type={mostrarPassword ? "text" : "password"}
                        {...register("contraseña")}
                        error={!!errors.contraseña}
                        helperText={errors.contraseña?.message}
                        margin="normal"
                        disabled={guardando}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={() => setMostrarPassword(!mostrarPassword)}
                                        edge="end"
                                        disabled={guardando}
                                    >
                                        {mostrarPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                    <FormControlLabel
                        control={<Switch {...register("habilitado")} defaultChecked disabled={guardando} />}
                        label="Habilitado"
                        sx={{ mt: 1 }}
                    />
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button
                        onClick={handleClose}
                        variant="outlined"
                        disabled={guardando}
                    >
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