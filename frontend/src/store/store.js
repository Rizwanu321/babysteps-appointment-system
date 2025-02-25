import { configureStore } from "@reduxjs/toolkit";
import doctorReducer from "./doctorSlice";
import appointmentReducer from "./appointmentSlice";

export const store = configureStore({
  reducer: {
    doctors: doctorReducer,
    appointments: appointmentReducer,
  },
});
