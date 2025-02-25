import React from "react";
import { format, addDays, isSameDay, isAfter, parseISO } from "date-fns";
import { FiUser } from "react-icons/fi";

const TimeSlotSelector = ({
  doctor,
  selectedDate,
  setSelectedDate,
  availableSlots,
  onSlotSelect,
  onBack,
}) => {
  const getDateRange = () => {
    const today = new Date();
    const dates = [];
    for (let i = 0; i < 7; i++) {
      dates.push(addDays(today, i));
    }
    return dates;
  };

  const getFilteredSlots = () => {
    if (!selectedDate) return [];

    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();

    return availableSlots.filter((slot) => {
      const [hours, minutes] = slot.split(":").map(Number);
      const slotTime = hours * 60 + minutes;

      if (isSameDay(selectedDate, now)) {
        return slotTime > currentTime;
      }

      return true;
    });
  };

  const filteredSlots = getFilteredSlots();

  return (
    <div>
      <div className="mb-6 flex items-center">
        <button
          onClick={onBack}
          className="mr-4 text-blue-500 hover:text-blue-600"
        >
          ← Back to Doctors
        </button>
        <h2 className="text-2xl font-bold">Select Appointment Date & Time</h2>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <FiUser className="w-6 h-6 text-blue-500" />
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-semibold">{doctor.name}</h3>
            <p className="text-gray-600">{doctor.specialization}</p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Select Date</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {getDateRange().map((date) => (
              <button
                key={date.toISOString()}
                onClick={() => setSelectedDate(date)}
                className={`p-3 rounded-lg text-center transition-colors
                  ${
                    selectedDate &&
                    format(selectedDate, "yyyy-MM-dd") ===
                      format(date, "yyyy-MM-dd")
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
              >
                <div className="font-medium">{format(date, "EEE")}</div>
                <div className="text-sm">{format(date, "MMM d")}</div>
              </button>
            ))}
          </div>
        </div>

        {selectedDate && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Available Time Slots</h3>
            {filteredSlots.length === 0 ? (
              <div className="text-center text-gray-500">
                {isSameDay(selectedDate, new Date())
                  ? "No more available slots for today"
                  : "No available slots for this date"}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {filteredSlots.map((slot) => (
                  <button
                    key={slot}
                    onClick={() => {
                      const fullDateTime = new Date(selectedDate);
                      const [hours, minutes] = slot.split(":");
                      fullDateTime.setHours(
                        parseInt(hours),
                        parseInt(minutes),
                        0,
                        0
                      );
                      onSlotSelect({
                        ...doctor,
                        selectedSlot: fullDateTime,
                      });
                    }}
                    className="p-3 bg-gray-100 rounded-lg hover:bg-blue-500 hover:text-white transition-colors"
                  >
                    {slot}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TimeSlotSelector;
