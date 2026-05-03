import { useEffect, useState } from "react";
import { getAllVehicles, deleteVehicle } from "../api/vehicles.api";
import { getAllMaintenanceOrders } from "../api/maintenanceOrders.api";
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
        // 1. Consultar todas las órdenes de mantenimiento para verificar integridad
        const ordersRes = await getAllMaintenanceOrders();
        
        // 2. Filtrar órdenes pendientes o vigentes asociadas a este vehículo
        // Consideramos vigentes las que están en 'PLANNING' (Planificación) o 'EXECUTION' (Ejecución)
        const activeOrders = ordersRes.data.filter(order => 
            order.vehicle === placa && 
            (order.status === 'PLANNING' || order.status === 'EXECUTION')
        );

        // 3. Condicional de integridad según RNF-01
        if (activeOrders.length > 0) {
            // Si existen órdenes activas, mostramos el mensaje explicativo en lugar de la confirmación
            alert(`No se puede eliminar el vehículo ${placa} debido a que existe una orden de mantenimiento pendiente o vigente asociada.`);
            return; // Bloqueamos la ejecución del borrado
        }

        // 4. Si no hay órdenes activas, procedemos con la confirmación estándar
        const accepted = window.confirm("¿Estás seguro de eliminar este vehículo? Se mantendrá la trazabilidad histórica según el protocolo de borrado lógico.");
        if (accepted) {
            try {
                await deleteVehicle(placa);
                setVehicles(vehicles.filter(v => v.placa !== placa));
            } catch (error) {
                console.error("Error al eliminar:", error);
                alert("Hubo un error al procesar la solicitud de borrado.");
            }
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