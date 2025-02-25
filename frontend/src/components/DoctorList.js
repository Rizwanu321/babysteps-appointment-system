import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDoctors, fetchAvailableSlots } from "../store/doctorSlice";
import DoctorCard from "./DoctorCard";
import TimeSlotSelector from "./TimeSlotSelector";

const DoctorList = ({ onDoctorSelect }) => {
  const dispatch = useDispatch();
  const { doctors, status, availableSlots } = useSelector(
    (state) => state.doctors
  );
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    if (status.doctors === "idle") {
      dispatch(fetchDoctors());
    }
  }, [status.doctors, dispatch]);

  useEffect(() => {
    if (selectedDoctor && selectedDate) {
      dispatch(
        fetchAvailableSlots({
          doctorId: selectedDoctor._id,
          date: selectedDate,
        })
      );
    }
  }, [selectedDoctor, selectedDate, dispatch]);

  const handleDoctorSelect = (doctor) => {
    setSelectedDoctor(doctor);
    setSelectedDate(null);
  };

  return (
    <div className="container mx-auto p-4">
      {!selectedDoctor ? (
        <div>
          <h2 className="text-2xl font-bold mb-6">Select a Doctor</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {doctors.map((doctor) => (
              <DoctorCard
                key={doctor._id}
                doctor={doctor}
                onSelect={handleDoctorSelect}
              />
            ))}
          </div>
        </div>
      ) : (
        <TimeSlotSelector
          doctor={selectedDoctor}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          availableSlots={availableSlots}
          onSlotSelect={onDoctorSelect}
          onBack={() => setSelectedDoctor(null)}
        />
      )}
    </div>
  );
};

export default DoctorList;
