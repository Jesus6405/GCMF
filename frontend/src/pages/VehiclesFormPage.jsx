import {useForm} from "react-hook-form";

export function VehiclesFormPage() {
    const { register, handleSubmit } = useForm();

    const onSubmit = (data) => {
        console.log(data);
    };

    return (
        <div>
            Formulario de Vehículos
            <form onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <label>Placa:</label>
                    <input {...register("placa", { required: true })} />
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
                    <input {...register("fuel_type", { required: true })} />
                </div>
                <div>
                    <label>Estado Operativo:</label>
                    <input {...register("operational_status", { required: true })} />
                </div>
                <div>
                    <label>Kilometraje Actual:</label>
                    <input type="number" {...register("current_km", { required: true } )} />
                </div>
                <button type="submit">Crear Vehículo</button>
            </form>
        </div>
    );
}