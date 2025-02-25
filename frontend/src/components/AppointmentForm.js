import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { createAppointment } from "../store/appointmentSlice";
import { format } from "date-fns";
import { APPOINTMENT_TYPES, APPOINTMENT_DURATIONS } from "../utils/constants";

const AppointmentForm = ({ doctor, selectedSlot, onSubmit }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    patientName: "",
    appointmentType: APPOINTMENT_TYPES[0],
    notes: "",
    duration: 30,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await dispatch(
        createAppointment({
          doctorId: doctor._id,
          doctor: {
            name: doctor.name,
            specialization: doctor.specialization,
          },
          date: selectedSlot.toISOString(),
          ...formData,
        })
      ).unwrap();

      onSubmit();
    } catch (error) {
      setError(error.message || "Failed to create appointment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-6 space-y-6">
      <div className="border-b pb-4">
        <h2 className="text-2xl font-bold text-gray-800">Book Appointment</h2>
        <div className="mt-2 text-gray-600">
          <p className="font-medium">{doctor.name}</p>
          <p className="text-sm">{doctor.specialization}</p>
          <p className="text-sm mt-1">
            {format(selectedSlot, "EEEE, MMMM d, yyyy")}
          </p>
          <p className="text-sm font-medium text-blue-600">
            {format(selectedSlot, "h:mm a")}
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Patient Name *
          </label>
          <input
            type="text"
            value={formData.patientName}
            onChange={(e) =>
              setFormData({ ...formData, patientName: e.target.value })
            }
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter patient name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Appointment Type *
          </label>
          <select
            value={formData.appointmentType}
            onChange={(e) =>
              setFormData({ ...formData, appointmentType: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {APPOINTMENT_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Duration
          </label>
          <select
            value={formData.duration}
            onChange={(e) =>
              setFormData({ ...formData, duration: Number(e.target.value) })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {APPOINTMENT_DURATIONS.map((duration) => (
              <option key={duration.value} value={duration.value}>
                {duration.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Notes (Optional)
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) =>
              setFormData({ ...formData, notes: e.target.value })
            }
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Add any special notes or requirements"
          />
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={loading}
            className={`flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors
              ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {loading ? "Booking..." : "Confirm Booking"}
          </button>
          <button
            type="button"
            onClick={() => onSubmit()}
            className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AppointmentForm;
