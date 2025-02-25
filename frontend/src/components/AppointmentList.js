import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAppointments,
  deleteAppointment,
  updateAppointment,
} from "../store/appointmentSlice";
import { format, parseISO } from "date-fns";
import { FiEdit2, FiTrash2, FiUser } from "react-icons/fi";
import AppointmentStats from "./AppointmentStats";
import EditAppointmentForm from "./EditAppointmentForm";

const AppointmentList = () => {
  const dispatch = useDispatch();
  const { appointments, status, error } = useSelector(
    (state) => state.appointments
  );
  const [filter, setFilter] = useState("upcoming");
  const [searchTerm, setSearchTerm] = useState("");
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [editForm, setEditForm] = useState({
    patientName: "",
    appointmentType: "",
    notes: "",
    duration: 30,
  });

  useEffect(() => {
    dispatch(fetchAppointments());
  }, [dispatch]);

  const handleEditClick = (appointment) => {
    setEditingAppointment(appointment._id);
    setEditForm({
      patientName: appointment.patientName,
      appointmentType: appointment.appointmentType,
      notes: appointment.notes || "",
      duration: appointment.duration || 30,
    });
  };

  const handleEditSubmit = async (e, appointmentId) => {
    e.preventDefault();
    try {
      await dispatch(
        updateAppointment({
          id: appointmentId,
          appointmentData: editForm,
        })
      ).unwrap();
      setEditingAppointment(null);
      setEditForm({
        patientName: "",
        appointmentType: "",
        notes: "",
        duration: 30,
      });
    } catch (error) {
      console.error("Failed to update appointment", error);
      alert("Failed to update appointment");
    }
  };

  const filteredAppointments = appointments
    .filter((appointment) => {
      const matchesSearch = appointment.patientName
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const isUpcoming = new Date(appointment.date) >= new Date();
      return (
        matchesSearch &&
        (filter === "all" || (filter === "upcoming" && isUpcoming))
      );
    })
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  const groupedAppointments = filteredAppointments.reduce(
    (groups, appointment) => {
      const date = format(parseISO(appointment.date), "yyyy-MM-dd");
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(appointment);
      return groups;
    },
    {}
  );

  const handleCancelAppointment = async (id) => {
    if (window.confirm("Are you sure you want to cancel this appointment?")) {
      try {
        await dispatch(deleteAppointment(id)).unwrap();
      } catch (error) {
        console.error("Failed to cancel appointment", error);
        alert("Failed to cancel appointment");
      }
    }
  };

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4 text-red-700">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 sm:mb-0">
          Appointments
        </h2>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search appointments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="upcoming">Upcoming</option>
            <option value="all">All Appointments</option>
          </select>
        </div>
      </div>

      {Object.entries(groupedAppointments).map(([date, dayAppointments]) => (
        <div key={date} className="mb-8">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">
            {format(parseISO(date), "EEEE, MMMM d, yyyy")}
          </h3>

          <div className="space-y-4">
            {dayAppointments.map((appointment) => (
              <div
                key={appointment._id}
                className="border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                {editingAppointment === appointment._id ? (
                  <EditAppointmentForm
                    appointment={appointment}
                    formData={editForm}
                    setFormData={setEditForm}
                    onSubmit={(e) => handleEditSubmit(e, appointment._id)}
                    onCancel={() => setEditingAppointment(null)}
                  />
                ) : (
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <FiUser className="text-gray-500" />
                        <h4 className="text-lg font-semibold">
                          {appointment.patientName}
                        </h4>
                      </div>

                      <div className="text-gray-600">
                        <p>{format(parseISO(appointment.date), "h:mm a")}</p>
                        <p>{appointment.duration} minutes</p>
                        <p className="text-sm">{appointment.appointmentType}</p>
                      </div>

                      {appointment.notes && (
                        <p className="text-gray-600 text-sm">
                          {appointment.notes}
                        </p>
                      )}

                      {appointment.doctorId && (
                        <p className="text-sm text-gray-500">
                          Doctor: {appointment.doctor.name}
                          {appointment.doctor.specialization &&
                            ` (${appointment.doctor.specialization})`}
                        </p>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditClick(appointment)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                        title="Edit appointment"
                      >
                        <FiEdit2 />
                      </button>
                      <button
                        onClick={() => handleCancelAppointment(appointment._id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                        title="Cancel appointment"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      <AppointmentStats appointments={filteredAppointments} />
    </div>
  );
};

export default AppointmentList;
