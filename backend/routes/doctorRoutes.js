const express = require("express");
const router = express.Router();
const Doctor = require("../models/Doctor");
const Appointment = require("../models/Appointment");
const {
  parseISO,
  addMinutes,
  format,
  startOfDay,
  endOfDay,
} = require("date-fns");

router.get("/", async (req, res) => {
  try {
    const doctors = await Doctor.find();
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/:id/slots", async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    const requestedDate = req.query.date
      ? parseISO(req.query.date)
      : new Date();

    const existingAppointments = await Appointment.find({
      doctorId: req.params.id,
      date: {
        $gte: startOfDay(requestedDate),
        $lte: endOfDay(requestedDate),
      },
    });

    const [startHour, startMinute] = doctor.workingHours.start.split(":");
    const [endHour, endMinute] = doctor.workingHours.end.split(":");

    const startTime = new Date(requestedDate);
    startTime.setHours(parseInt(startHour), parseInt(startMinute), 0, 0);

    const endTime = new Date(requestedDate);
    endTime.setHours(parseInt(endHour), parseInt(endMinute), 0, 0);

    const slots = [];
    let currentSlot = startTime;

    while (currentSlot < endTime) {
      const slotEnd = addMinutes(currentSlot, 30);

      const isAvailable = !existingAppointments.some(
        (appt) => appt.date >= currentSlot && appt.date < slotEnd
      );

      if (isAvailable) {
        slots.push(format(currentSlot, "HH:mm"));
      }

      currentSlot = slotEnd;
    }

    res.json(slots);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
