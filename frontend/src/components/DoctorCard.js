import React from "react";
import { FiUser, FiClock } from "react-icons/fi";

const DoctorCard = ({ doctor, onSelect }) => {
  return (
    <div
      onClick={() => onSelect(doctor)}
      className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow"
    >
      <div className="flex items-center mb-4">
        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
          <FiUser className="w-6 h-6 text-blue-500" />
        </div>
        <div className="ml-4">
          <h3 className="text-lg font-semibold">{doctor.name}</h3>
          <p className="text-gray-600">{doctor.specialization}</p>
        </div>
      </div>

      <div className="flex items-center text-gray-600">
        <FiClock className="mr-2" />
        <span>
          {doctor.workingHours.start} - {doctor.workingHours.end}
        </span>
      </div>
    </div>
  );
};

export default DoctorCard;
