import {
    Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, Button,
    Chip, TextField, Pagination
} from "@mui/material";
import { useEffect, useState } from "react";
import api from "../../services/api";
import ModalCrearSucursal from "../../Components/modals/ModalCrearSucursal"
import ModalEditarSucursal from "../../Components/modals/ModalEditarSucursal"
import './Sucursales.css';

export default function Sucursales() {
    const [sucursales, setSucursales] = useState([]);
    const [filtro, setFiltro] = useState("");
    const [pagina, setPagina] = useState(1);
    const [filtradas, setFiltradas] = useState([]);
    const [modalCrearAbierto, setModalCrearAbierto] = useState(false);
    const [modalEditarAbierto, setModalEditarAbierto] = useState(false);
    const [sucursalEditar, setSucursalEditar] = useState(null);

    const itemsPorPagina = 5;

    const cargarSucursales = () => {
        api.get("/sucursales?habilitado=true").then((res) => {
            setSucursales(res.data);
        });
    };

    useEffect(() => {
        cargarSucursales();
    }, []);

    useEffect(() => {
        const datos = sucursales.filter((s) =>
            s.nombre.toLowerCase().includes(filtro.toLowerCase())
        );
        setFiltradas(datos);
        setPagina(1);
    }, [filtro, sucursales]);

    const abrirEditar = (sucursal) => {
        setSucursalEditar(sucursal);
        setModalEditarAbierto(true);
    };

    const eliminarSucursal = async (slug) => {
        const confirmacion = window.confirm("�Deshabilitar esta sucursal?");
        if (!confirmacion) return;
        try {
            await api.patch(`/sucursales/${slug}`, { habilitado: false });
            cargarSucursales();
        } catch (err) {
            alert("Error al deshabilitar");
            console.error(err);
        }
    };

    const sucursalesPaginadas = filtradas.slice(
        (pagina - 1) * itemsPorPagina,
        pagina * itemsPorPagina
    );

    return (
        <div className="page-container">
            <div className="header">
                <h1>Sucursales</h1>
                <Button
                    variant="contained"
                    onClick={() => setModalCrearAbierto(true)}
                    sx={{
                        backgroundColor: "#d32f2f",
                        "&:hover": {
                            backgroundColor: "#b71c1c",
                        },
                    }}
                >
                    Nueva
                </Button>
            </div>

            <div className="search-bar">
                <TextField
                    label="Buscar por nombre"
                    fullWidth
                    value={filtro}
                    onChange={(e) => setFiltro(e.target.value)}
                />
            </div>

            <TableContainer component={Paper} className="table-container">
                <Table>
                    <TableHead>
                        <TableRow className="table-header">
                            <TableCell className="actions-cell"><b>Nombre</b></TableCell>
                            <TableCell className="actions-cell"><b>Direccion</b></TableCell>
                            <TableCell className="actions-cell"><b>Estado</b></TableCell>
                            <TableCell align="center" className="actions-cell"><b>Acciones</b></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {sucursalesPaginadas.map((s) => (
                            <TableRow key={s.slug}>
                                <TableCell>{s.nombre}</TableCell>
                                <TableCell>{s.direccion}</TableCell>
                                <TableCell>
                                    <Chip label={s.habilitado ? "Habilitada" : "Deshabilitada"}
                                        color={s.habilitado ? "success" : "default"} />
                                </TableCell>
                                <TableCell align="center">
                                    <Button
                                        size="small"
                                        variant="contained"
                                        onClick={() => abrirEditar(s)}
                                        sx={{
                                            backgroundColor: "#d32f2f",
                                            "&:hover": {
                                                backgroundColor: "#b71c1c",
                                            },
                                            marginRight: "0.5rem",
                                        }}
                                    >
                                        Editar
                                    </Button>
                                    <Button size="small" color="error" variant="outlined" onClick={() => eliminarSucursal(s.slug)}>
                                        Eliminar
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                        {sucursalesPaginadas.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={4} align="center">No hay sucursales.</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <div className="pagination-container">
                <Pagination
                    count={Math.ceil(filtradas.length / itemsPorPagina)}
                    page={pagina}
                    onChange={(e, v) => setPagina(v)}
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

            <ModalCrearSucursal
                abierto={modalCrearAbierto}
                onClose={() => setModalCrearAbierto(false)}
                onGuardado={cargarSucursales}
            />

            <ModalEditarSucursal
                abierto={modalEditarAbierto}
                onClose={() => setModalEditarAbierto(false)}
                sucursal={sucursalEditar}
                onActualizado={cargarSucursales}
            />
        </div>
    );
}