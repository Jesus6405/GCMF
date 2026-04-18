import { useEffect, useState } from "react";
import { getAllVehicles, deleteVehicle } from "../api/vehicles.api";
import { VehicleCard } from "./VehicleCard";

export function VehiclesList() {
    const [vehicles, setVehicles] = useState([]);

    useEffect(() => {
        async function loadVehicles() {
            const ans = await getAllVehicles();
            setVehicles(ans.data);
        }
        loadVehicles();
    }, []);

    const handleDelete = async (placa) => {
        const accepted = window.confirm("¿Estás seguro de eliminar este vehículo?");
        if (accepted) {
            await deleteVehicle(placa);
            setVehicles(vehicles.filter(v => v.placa !== placa));
        }
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <h2>Inventario de Unidades</h2>
                <p>Lista de vehículos registrados en el sistema.</p>
            </div>
            
            <div className="table-container">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Placa</th>
                            <th>Marca</th>
                            <th>Modelo</th>
                            <th>Año</th>
                            <th>Combustible</th>
                            <th>Estado</th>
                            <th>KM Actual</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {vehicles.map((vehicle) => (
                            <VehicleCard 
                                key={vehicle.placa} 
                                vehicle={vehicle} 
                                onDelete={handleDelete} 
                            />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}