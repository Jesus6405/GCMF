import { useEffect, useState } from "react";
import { getAllVehicles } from "../api/vehicles.api";
import { VehicleCard } from "./VehicleCard";

export function VehiclesList() {
    const [vehicles, setVehicles] = useState([]);

    useEffect(() => {
        async function loadVehicles() {
            const ans = await getAllVehicles();
            console.log(ans);
            setVehicles(ans.data);
        }

        loadVehicles();

    }, []);

    return (
        <div>
            <h2>Lista de Vehículos</h2>
            <table>
                <thead>
                    <tr>
                        <th>Placa</th>
                        <th>Marca</th>
                        <th>Modelo</th>
                        <th>Año</th>
                        <th>Tipo de Combustible</th>
                        <th>Estado Operativo</th>
                        <th>Kilometraje Actual</th>
                    </tr>
                </thead>
                <tbody>
                    {vehicles.map((vehicle) => (
                        <VehicleCard key={vehicle.placa} vehicle={vehicle} />
                    ))}
                </tbody>
            </table>
        </div>
    );
}