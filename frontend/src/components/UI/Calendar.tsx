import { useState } from "react";

export const Calendar = () => {

    const today = new Date().toISOString().split("T")[0];
    const [formData, setFormData] = useState({
      start_time: today,
      end_time: today,
    });

    const handleInputChange = (
            e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
        ) => {
            const { name, value } = e.target;
            setFormData((prev) => ({ ...prev, [name]: value }));
        };

    return (
        <>
        <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
                Inicio
            </label>
            <input
                type="date"
                name="start_time"
                value={formData.start_time}
                onChange={handleInputChange}
                required
                className="w-full rounded-lg border border-slate-300 bg-background px-3 py-2 text-sm"
            />
        </div>
        <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
                Fin
            </label>
            <input
                type="date"
                name="end_time"
                value={formData.end_time}
                onChange={handleInputChange}
                required
                className="w-full rounded-lg border border-slate-300 bg-background px-3 py-2 text-sm"
            />
        </div>
        </>
    )
}