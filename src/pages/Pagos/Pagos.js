import React, { useState, useEffect } from 'react';
import Layout from '../../Components/layout/Layout';
import { obtenerPagos } from '../../services/api';
import './Pagos.css';

const Pagos = () => {
    // Estado para almacenar la lista de pagos
    const [pagos, setPagos] = useState([]);
    // Estado para manejar la carga de datos
    const [loading, setLoading] = useState(true);
    // Estado para manejar posibles errores
    const [error, setError] = useState(null);

    // useEffect se ejecuta cuando el componente se monta por primera vez
    useEffect(() => {
        const cargarPagos = async () => {
            try {
                setLoading(true);
                const { data } = await obtenerPagos();
                setPagos(data);
            } catch (error) {
                console.error("Error al cargar los pagos:", error);
                setError("No se pudieron cargar los pagos. Por favor, intente de nuevo más tarde.");
            } finally {
                setLoading(false);
            }
        };

        cargarPagos();
    }, []); // El array vacío asegura que se ejecute solo una vez

    // Función para renderizar el contenido principal
    const renderContent = () => {
        if (loading) {
            return <p>Cargando pagos...</p>;
        }

        if (error) {
            return <p style={{ color: 'red' }}>{error}</p>;
        }

        return (
            <table className="pagos-table">
                <thead>
                    <tr>
                        <th>ID Pago</th>
                        <th>Socio</th>
                        <th>Monto</th>
                        <th>Fecha de Pago</th>
                        <th>Método de Pago</th>
                    </tr>
                </thead>
                <tbody>
                    {pagos.length > 0 ? (
                        pagos.map((pago) => (
                            <tr key={pago.id}>
                                <td>{pago.id}</td>
                                <td>{pago.socio ? `${pago.socio.nombre} ${pago.socio.apellido}` : 'Socio no disponible'}</td>
                                <td>${pago.monto.toFixed(2)}</td>
                                <td>{new Date(pago.fechaPago).toLocaleDateString()}</td>
                                <td>{pago.metodoPago}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5">No hay pagos registrados.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        );
    };

    return (
        <Layout>
            <div className="container-pagos">
                <h1>Registro de Pagos</h1>
                <button className="btn-agregar">
                    + Registrar Nuevo Pago
                </button>
                <div className="tabla-container">
                    {renderContent()}
                </div>
            </div>
        </Layout>
    );
};

export default Pagos;