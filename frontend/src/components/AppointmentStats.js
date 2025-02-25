import React from "react";

const AppointmentStats = ({ appointments }) => {
  const upcomingAppointments = appointments.filter(
    (apt) => new Date(apt.date) >= new Date()
  );

  const appointmentTypes = appointments.reduce((acc, apt) => {
    acc[apt.appointmentType] = (acc[apt.appointmentType] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="mt-8 bg-gray-50 rounded-lg p-4">
      <h3 className="font-semibold mb-3">Appointment Summary</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <p className="text-gray-600">Total Appointments</p>
          <p className="text-2xl font-bold">{appointments.length}</p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm">
          <p className="text-gray-600">Upcoming Appointments</p>
          <p className="text-2xl font-bold">{upcomingAppointments.length}</p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm">
          <p className="text-gray-600">Types Breakdown</p>
          <div className="text-sm">
            {Object.entries(appointmentTypes).map(([type, count]) => (
              <div key={type} className="flex justify-between">
                <span>{type}:</span>
                <span className="font-medium">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentStats;
