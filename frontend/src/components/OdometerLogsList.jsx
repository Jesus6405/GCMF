import { useEffect, useState } from "react";
import { getAllOdometerLogs, deleteOdometerLog } from "../api/odometerLog.api";
import { OdometerLogCard } from "./OdometerLogCard";

export function OdometerLogsList() {
    const [Odlogs, setOdlog] = useState([]);

    useEffect(() => {
        async function loadOdLogs() {
            const ans = await getAllOdometerLogs();
            setOdlog(ans.data);
        }
        loadOdLogs();
    }, []);

    const handleDelete = async (id) => {
        const accepted = window.confirm("¿Estás seguro de eliminar este vehículo?");
        if (accepted) {
            await deleteOdometerLog(id);
            setOdlog(Odlogs.filter(v => v.id !== id));
        }
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <h2>Inventario de Unidades</h2>
                <p>Lista de logs registrados en el sistema.</p>
            </div>

            <div className="table-container">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>Kilometraje</th>
                            <th>Fecha</th>
                            <th>Vehiculo</th>
                            <th>Descripcion</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Odlogs.map((odLog) => (
                            <OdometerLogCard
                                key={odLog.id}
                                odLog={odLog} /* ESTA ES LA LÍNEA CLAVE: L mayúscula */
                                onDelete={handleDelete}
                            />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}