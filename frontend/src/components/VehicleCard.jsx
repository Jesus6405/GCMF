export function VehicleCard({ vehicle }) {
    return (
        <tr>
            <td>{vehicle.placa}</td>
            <td>{vehicle.brand}</td>
            <td>{vehicle.model}</td>
            <td>{vehicle.year}</td>
            <td>{vehicle.fuel_type}</td>
            <td>{vehicle.operational_status}</td>
            <td>{vehicle.current_km}</td>
        </tr>
    );
}