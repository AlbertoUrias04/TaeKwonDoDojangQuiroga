import { useState } from "react";
import Sidebar from './Sidebar';
import { Outlet } from "react-router-dom";

export default function Layout() {
    const [sidebarAbierto, setSidebarAbierto] = useState(true);

    const toggleSidebar = () => {
        setSidebarAbierto(!sidebarAbierto);
    };

    return (
        <div style={{ display: "flex", minHeight: "100vh" }}>
            <Sidebar isOpen={sidebarAbierto} toggleSidebar={toggleSidebar} />

            <main
                style={{
                    flexGrow: 1,
                    padding: "2rem",
                    transition: "margin-left 0.3s ease",
                    backgroundColor: "#f4f6f8",
                    boxSizing: "border-box",
                    maxWidth: "100%",
                    overflowY: "auto",
                    height: "100vh",
                }}
            >
                <Outlet />
            </main>
        </div>
    );
}