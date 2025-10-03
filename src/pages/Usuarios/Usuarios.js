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
} from "@mui/material";
import { Search, Clear } from "@mui/icons-material";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import api from "../../services/api";
import ModalCrearUsuario from "../../Components/modals/ModalCrearUsuario";
import ModalEditarUsuario from "../../Components/modals/ModalEditarUsuario";
import "./Usuarios.css";

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [pagina, setPagina] = useState(1);
  const [filtrados, setFiltrados] = useState([]);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modalEditarAbierto, setModalEditarAbierto] = useState(false);
  const [usuarioEditar, setUsuarioEditar] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const itemsPorPagina = 5;

  const cargarUsuarios = async () => {
    setCargando(true);
    setError(null);
    
    try {
      const res = await api.get("/usuarios");
      setUsuarios(res.data || []);
    } catch (error) {
      console.error("Error al cargar usuarios:", error);
      
      let mensajeError = "Ocurrió un error inesperado al cargar los usuarios.";
      
      if (error.response) {
        mensajeError = "Error al cargar los usuarios del servidor.";
      } else if (error.request) {
        mensajeError = "No se pudo conectar con el servidor. Verifica tu conexión.";
      }
      
      setError(mensajeError);
      
      Swal.fire({
        icon: "error",
        title: "Error al cargar usuarios",
        text: mensajeError,
        confirmButtonColor: "#d32f2f",
      });
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);

  useEffect(() => {
    const datosFiltrados = usuarios.filter((u) =>
      [u.nombre, u.apellidoPaterno, u.apellidoMaterno, u.nombreUsuario]
        .join(" ")
        .toLowerCase()
        .includes(filtro.toLowerCase())
    );
    setFiltrados(datosFiltrados);
    setPagina(1);
  }, [filtro, usuarios]);

  const usuariosPaginados = filtrados.slice(
    (pagina - 1) * itemsPorPagina,
    pagina * itemsPorPagina
  );

  const abrirEditar = (usuario) => {
    setUsuarioEditar(usuario);
    setModalEditarAbierto(true);
  };

  const eliminarUsuario = async (usuario) => {
    const resultado = await Swal.fire({
      title: "¿Estás seguro?",
      text: `Se deshabilitará al usuario ${usuario.nombre} ${usuario.apellidoPaterno}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d32f2f",
      cancelButtonColor: "#757575",
      confirmButtonText: "Sí, deshabilitar",
      cancelButtonText: "Cancelar",
      reverseButtons: true,
    });

    if (!resultado.isConfirmed) return;

    try {
      await api.patch(`/usuarios/${usuario.slug}`, {
        slug: usuario.slug,
        habilitado: false,
      });
      
      await Swal.fire({
        icon: "success",
        title: "Usuario deshabilitado",
        text: "El usuario ha sido deshabilitado correctamente",
        confirmButtonColor: "#d32f2f",
        timer: 2000,
        timerProgressBar: true,
      });
      
      cargarUsuarios();
    } catch (error) {
      console.error("Error al deshabilitar el usuario:", error);
      
      let mensajeError = "Ocurrió un error al deshabilitar el usuario";
      
      if (error.response) {
        if (error.response.status === 404) {
          mensajeError = "Usuario no encontrado";
        } else {
          mensajeError = "Error al deshabilitar el usuario en el servidor";
        }
      } else if (error.request) {
        mensajeError = "No se pudo conectar con el servidor. Verifica tu conexión.";
      }
      
      Swal.fire({
        icon: "error",
        title: "Error",
        text: mensajeError,
        confirmButtonColor: "#d32f2f",
      });
    }
  };

  const handleGuardadoExitoso = async () => {
    await Swal.fire({
      icon: "success",
      title: "Usuario creado",
      text: "El usuario ha sido creado correctamente",
      confirmButtonColor: "#d32f2f",
      timer: 2000,
      timerProgressBar: true,
    });
    cargarUsuarios();
  };

  const handleActualizadoExitoso = async () => {
    await Swal.fire({
      icon: "success",
      title: "Usuario actualizado",
      text: "El usuario ha sido actualizado correctamente",
      confirmButtonColor: "#d32f2f",
      timer: 2000,
      timerProgressBar: true,
    });
    cargarUsuarios();
  };

  const limpiarFiltro = () => {
    setFiltro("");
  };

  const recargarDatos = async () => {
    await cargarUsuarios();
    
    if (!error) {
      Swal.fire({
        icon: "success",
        title: "Datos actualizados",
        text: "Los datos se han recargado correctamente",
        confirmButtonColor: "#d32f2f",
        timer: 1500,
        timerProgressBar: true,
        showConfirmButton: false,
      });
    }
  };

  if (cargando) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
        flexDirection="column"
        gap={2}
      >
        <CircularProgress size={60} />
        <p>Cargando usuarios...</p>
      </Box>
    );
  }

  return (
    <div className="page-container">
      <div className="header">
        <h1>Usuarios</h1>
        <Box display="flex" gap={1}>
          <Button
            variant="outlined"
            color="primary"
            onClick={recargarDatos}
          >
            Recargar
          </Button>
          <Button
            variant="contained"
            onClick={() => setModalAbierto(true)}
            sx={{
              backgroundColor: "#d32f2f",
              "&:hover": {
                backgroundColor: "#b71c1c",
              },
            }}
          >
            Nuevo
          </Button>
        </Box>
      </div>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <div className="search-bar">
        <TextField
          label="Buscar por nombre o usuario"
          variant="outlined"
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
                <IconButton onClick={limpiarFiltro} size="small">
                  <Clear />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </div>

      <TableContainer component={Paper} className="table-container">
        <Table>
          <TableHead>
            <TableRow className="table-header">
              <TableCell>
                <b>Nombre</b>
              </TableCell>
              <TableCell>
                <b>Apellido Paterno</b>
              </TableCell>
              <TableCell>
                <b>Apellido Materno</b>
              </TableCell>
              <TableCell>
                <b>Usuario</b>
              </TableCell>
              <TableCell>
                <b>Estado</b>
              </TableCell>
              <TableCell align="center">
                <b>Acciones</b>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {usuariosPaginados.map((u) => (
              <TableRow key={u.slug} hover>
                <TableCell>{u.nombre}</TableCell>
                <TableCell>{u.apellidoPaterno}</TableCell>
                <TableCell>{u.apellidoMaterno}</TableCell>
                <TableCell>{u.nombreUsuario}</TableCell>
                <TableCell>
                  <Chip
                    label={u.habilitado ? "Habilitado" : "Deshabilitado"}
                    color={u.habilitado ? "success" : "error"}
                    size="small"
                  />
                </TableCell>
                <TableCell align="center" className="actions-cell">
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => abrirEditar(u)}
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
                    size="small"
                    color="error"
                    onClick={() => eliminarUsuario(u)}
                    disabled={!u.habilitado}
                  >
                    Deshabilitar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {usuariosPaginados.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  {filtro
                    ? "No se encontraron usuarios con ese criterio de búsqueda"
                    : "No hay usuarios registrados"}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <div className="pagination-container">
        <Pagination
          count={Math.ceil(filtrados.length / itemsPorPagina)}
          page={pagina}
          onChange={(e, value) => setPagina(value)}
          showFirstButton
          showLastButton
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
      </div>

      <ModalCrearUsuario
        abierto={modalAbierto}
        onClose={() => setModalAbierto(false)}
        onGuardado={handleGuardadoExitoso}
      />
      <ModalEditarUsuario
        abierto={modalEditarAbierto}
        onClose={() => setModalEditarAbierto(false)}
        usuario={usuarioEditar}
        onActualizado={handleActualizadoExitoso}
      />
    </div>
  );
}