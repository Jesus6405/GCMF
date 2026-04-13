import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { createVehicle, getVehicle, updateVehicle } from "../api/vehicles.api";
import { useNavigate, useParams } from "react-router-dom";

export function VehiclesFormPage() {
    const { register, handleSubmit, setValue, reset } = useForm();
    const navigate = useNavigate();
    const params = useParams();

    const onSubmit = handleSubmit(async (data) => {
        if (params.placa) {
            await updateVehicle(params.placa, data);
        } else {
            await createVehicle(data);
        }
        navigate("/vehicles");
    });

    useEffect(() => {
        async function loadVehicle() {
            if (params.placa) {
                const res = await getVehicle(params.placa);
                setValue("placa", res.data.placa);
                setValue("brand", res.data.brand);
                setValue("model", res.data.model);
                setValue("year", res.data.year);
                setValue("fuel_type", res.data.fuel_type);
                setValue("operational_status", res.data.operational_status);
                setValue("current_km", res.data.current_km);
            } else {
                reset({
                    placa: "",
                    brand: "",
                    model: "",
                    year: "",
                    fuel_type: "",
                    operational_status: "",
                    current_km: ""
                });
            }
        }
        loadVehicle();
    }, [params.placa, setValue, reset]);

    return (
        <div>
            <h1>{params.placa ? "Editar Vehículo" : "Registrar Vehículo"}</h1>
            <form onSubmit={onSubmit}>
                <div>
                    <label>Placa:</label>
                    <input {...register("placa", { required: true })} disabled={!!params.placa} />
                </div>
                <div>
                    <label>Marca:</label>
                    <input {...register("brand", { required: true })} />
                </div>
                <div>
                    <label>Modelo:</label>
                    <input {...register("model", { required: true })} />
                </div>
                <div>
                    <label>Año:</label>
                    <input type="number" {...register("year", { required: true })} />
                </div>
                <div>
                    <label>Tipo de Combustible:</label>
                    <select {...register("fuel_type", { required: true })}>
                        <option value="Gasoline">Gasolina</option>
                        <option value="Diesel">Diésel</option>
                        <option value="Gas">Gas</option>
                    </select>
                </div>
                <div>
                    <label>Estado Operativo:</label>
                    <select {...register("operational_status", { required: true })}>
                        <option value="Operational">Operativo</option>
                        <option value="In Workshop">En Taller</option>
                        <option value="Under Review">Bajo Revisión</option>
                        <option value="Unfit">No Apto</option>
                    </select>
                </div>
                <div>
                    <label>Kilometraje Actual:</label>
                    <input type="number" {...register("current_km", { required: true } )} />
                </div>
                <button type="submit">
                    {params.placa ? "Actualizar" : "Guardar"}
                </button>
            </form>
        </div>
    );
}