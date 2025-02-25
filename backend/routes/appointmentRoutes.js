const express = require("express");
const router = express.Router();
const Appointment = require("../models/Appointment");
const { parseISO, addMinutes, isWithinInterval } = require("date-fns");

router.get("/", async (req, res) => {
  try {
    const appointments = await Appointment.find();
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const { doctorId, doctor, date, duration, ...appointmentData } = req.body;
    const appointmentStart = new Date(date);
    const appointmentEnd = addMinutes(appointmentStart, duration || 30);

    const conflictingAppointment = await Appointment.findOne({
      doctorId,
      $or: [
        {
          date: {
            $lt: appointmentEnd,
            $gte: appointmentStart,
          },
        },
        {
          $expr: {
            $and: [
              { $lt: ["$date", appointmentEnd] },
              {
                $gte: [
                  { $add: ["$date", { $multiply: ["$duration", 60000] }] },
                  appointmentStart,
                ],
              },
            ],
          },
        },
      ],
    });

    if (conflictingAppointment) {
      return res.status(400).json({
        message: "Selected time slot is not available",
      });
    }

    const appointment = new Appointment({
      doctorId,
      doctor,
      date,
      duration: duration || 30,
      ...appointmentData,
    });

    const newAppointment = await appointment.save();
    res.status(201).json(newAppointment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (!updateData.patientName || !updateData.appointmentType) {
      return res
        .status(400)
        .json({ message: "Patient name and appointment type are required" });
    }

    const updatedAppointment = await Appointment.findByIdAndUpdate(
      id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedAppointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.json(updatedAppointment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await Appointment.findByIdAndDelete(req.params.id);
    res.json({ message: "Appointment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
