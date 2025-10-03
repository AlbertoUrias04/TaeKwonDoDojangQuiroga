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
import { useEffect, useState } from "react";
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
        .nullable()
        .test("password-strength", "La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número", function(value) {
            if (!value || value === "") return true;
            
            if (value.length < 8) return false;
            if (!/[A-Z]/.test(value)) return false;
            if (!/[a-z]/.test(value)) return false;
            if (!/[0-9]/.test(value)) return false;
            
            return true;
        }),
    habilitado: yup.boolean().default(true),
});

export default function ModalEditarUsuario({ abierto, onClose, usuario, onActualizado }) {
    const [guardando, setGuardando] = useState(false);
    const [mostrarPassword, setMostrarPassword] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        watch,
        formState: { errors }
    } = useForm({
        resolver: yupResolver(esquema),
        defaultValues: {
            nombre: "",
            apellidoPaterno: "",
            apellidoMaterno: "",
            nombreUsuario: "",
            contraseña: "",
            habilitado: true,
        }
    });

    useEffect(() => {
        if (usuario) {
            reset({
                nombre: usuario.nombre || "",
                apellidoPaterno: usuario.apellidoPaterno || "",
                apellidoMaterno: usuario.apellidoMaterno || "",
                nombreUsuario: usuario.nombreUsuario || "",
                contraseña: "",
                habilitado: usuario.habilitado ?? true,
            });
        }
    }, [usuario, reset]);

    const handleClose = () => {
        if (!guardando) {
            reset();
            setMostrarPassword(false);
            onClose();
        }
    };

    const onSubmit = async (data) => {
        setGuardando(true);

        try {
            const dto = {
                slug: usuario.slug,
                nombre: data.nombre,
                apellidoPaterno: data.apellidoPaterno,
                apellidoMaterno: data.apellidoMaterno,
                nombreUsuario: data.nombreUsuario,
                contraseña: data.contraseña || "",
                habilitado: data.habilitado,
            };

            await api.put(`/usuarios/${usuario.slug}`, dto);
            handleClose();
            onActualizado();
        } catch (err) {
            console.error("Error al actualizar usuario:", err);
            
            let mensajeError = "Error al actualizar";
            let detalles = "Ocurrió un error inesperado al actualizar el usuario";
            
            if (err.response) {
                if (err.response.status === 400) {
                    mensajeError = "Datos inválidos";
                    detalles = "Verifica que toda la información esté correcta";
                } else if (err.response.status === 404) {
                    mensajeError = "Usuario no encontrado";
                    detalles = "El usuario que intentas actualizar no existe";
                } else if (err.response.status === 409) {
                    mensajeError = "Usuario duplicado";
                    detalles = "El nombre de usuario ya existe. Por favor elige otro.";
                } else {
                    mensajeError = "Error del servidor";
                    detalles = "No se pudo actualizar el usuario. Intenta nuevamente.";
                }
            } else if (err.request) {
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
                Editar Usuario
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
                        label="Contraseña (dejar en blanco para no cambiar)" 
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
                        control={<Switch {...register("habilitado")} checked={watch("habilitado")} disabled={guardando} />}
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