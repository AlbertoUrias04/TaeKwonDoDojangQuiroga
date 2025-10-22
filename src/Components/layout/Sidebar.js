import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { User, Users, CreditCard, LogOut, Menu, Banknote, Calendar, Award } from "lucide-react";
import "./Sidebar.css";

export default function Sidebar({ isOpen, toggleSidebar }) {
    return (
        <div
            className={`sidebar ${isOpen ? "open" : "closed"}`}
        >
            <div>
                <div className="flex items-center justify-between mb-6">
                    {isOpen && <h2 className="text-2xl font-bold text-red-600">Taekwondo  Dojang Quiroga</h2>}
                    <button onClick={toggleSidebar} className="text-red-600 hover:text-red-800 focus:outline-none">
                        <Menu className="w-6 h-6" />
                    </button>
                </div>
                <nav className="flex flex-col space-y-4">
                    <Link to="/usuarios" className="sidebar-link">
                        <User className="w-5 h-5" />
                        {isOpen && <span className="ml-2">Usuarios</span>}
                    </Link>
                    <Link to="/alumnos" className="sidebar-link">
                        <Users className="w-5 h-5" />
                        {isOpen && <span className="ml-2">Alumnos</span>}
                    </Link>
                    <Link to="/cintas" className="sidebar-link">
                        <Award className="w-5 h-5" />
                        {isOpen && <span className="ml-2">Cintas</span>}
                    </Link>
                    <Link to="/clases" className="sidebar-link">
                        <Calendar className="w-5 h-5" />
                        {isOpen && <span className="ml-2">Clases</span>}
                    </Link>
                    <Link to="/conceptos" className="sidebar-link">
                        <CreditCard className="w-5 h-5" />
                        {isOpen && <span className="ml-2">Conceptos</span>}
                    </Link>
                    <Link to="/pagos" className="sidebar-link">
                        <Banknote className="w-5 h-5" />
                        {isOpen && <span className="ml-2">Pagos</span>}
                    </Link>
                </nav>
            </div>
            <button
                className="logout-button"
                onClick={() => {
                    localStorage.removeItem("token");
                    window.location.href = "/login";
                }}
            >
                <LogOut className="w-5 h-5" />
                {isOpen && <span>Cerrar sesion</span>}
            </button>
        </div>
    );
}

Sidebar.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    toggleSidebar: PropTypes.func.isRequired
};
