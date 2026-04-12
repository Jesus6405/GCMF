import { useEffect } from "react";
import { getAllVehicles } from "../api/vehicles.api";

export function VehiclesList() {

    useEffect(() => {
        async function loadVehicles() {
            const ans = await getAllVehicles();
            console.log(ans);
        }

        loadVehicles();

    }, []);

    return (
        <div>
            Lista de Vehículos
        </div>
    );
}