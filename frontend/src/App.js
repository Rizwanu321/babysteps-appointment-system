import React, { useState, useEffect } from "react";
import { Provider } from "react-redux";
import { store } from "./store/store";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Notification from "./components/Notification";
import DoctorList from "./components/DoctorList";
import AppointmentForm from "./components/AppointmentForm";
import AppointmentList from "./components/AppointmentList";
import Home from "./components/Home";
import io from "socket.io-client";
import { fetchAppointments } from "./store/appointmentSlice";

function App() {
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [socket, setSocket] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const newSocket = io("https://babysteps-appointment-system-7wlz.onrender.com");
    setSocket(newSocket);

    newSocket.on("appointment-booked", () => {
      store.dispatch(fetchAppointments());
      showNotification("New appointment booked!");
    });

    newSocket.on("appointment-updated", () => {
      store.dispatch(fetchAppointments());
      showNotification("Appointment updated successfully!");
    });

    newSocket.on("appointment-cancelled", () => {
      store.dispatch(fetchAppointments());
      showNotification("Appointment cancelled!");
    });

    return () => newSocket.close();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleDoctorSelect = (doctorWithSlot) => {
    if (doctorWithSlot.selectedSlot) {
      setSelectedDoctor(doctorWithSlot);
      setSelectedSlot(doctorWithSlot.selectedSlot);
    }
  };

  const handleAppointmentSubmit = () => {
    setSelectedDoctor(null);
    setSelectedSlot(null);
    showNotification("Appointment booked successfully!");
  };

  const openSidebar = () => setIsSidebarOpen(true);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <Provider store={store}>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Notification message={notification} />
          <div className="flex flex-col md:flex-row">
            <Sidebar
              isOpen={isSidebarOpen}
              onClose={closeSidebar}
              onOpen={openSidebar}
            />
            <div className="flex-1 p-4 md:p-8 md:ml-0 pt-16 md:pt-4">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route
                  path="/doctors"
                  element={
                    !selectedDoctor ? (
                      <DoctorList onDoctorSelect={handleDoctorSelect} />
                    ) : (
                      <AppointmentForm
                        doctor={selectedDoctor}
                        selectedSlot={selectedSlot}
                        onSubmit={handleAppointmentSubmit}
                      />
                    )
                  }
                />
                <Route path="/appointments" element={<AppointmentList />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>
          </div>
        </div>
      </Router>
    </Provider>
  );
}

export default App;
