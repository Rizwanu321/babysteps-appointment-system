import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import io from "socket.io-client";
import { API_BASE_URL, SOCKET_URL } from "../utils/constants";

const socket = io(SOCKET_URL);

export const fetchAppointments = createAsyncThunk(
  "appointments/fetchAppointments",
  async () => {
    const response = await axios.get(`${API_BASE_URL}/appointments`);
    return response.data;
  }
);

export const createAppointment = createAsyncThunk(
  "appointments/createAppointment",
  async (appointmentData, { dispatch }) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/appointments`,
        appointmentData
      );

      socket.emit("book-appointment", response.data);

      return response.data;
    } catch (error) {
      if (error.response) {
        throw new Error(error.response.data.message || "Booking failed");
      }
      throw error;
    }
  }
);

export const deleteAppointment = createAsyncThunk(
  "appointments/deleteAppointment",
  async (id) => {
    await axios.delete(`${API_BASE_URL}/appointments/${id}`);
    return id;
  }
);

export const updateAppointment = createAsyncThunk(
  "appointments/updateAppointment",
  async ({ id, appointmentData }, { getState }) => {
    const response = await axios.put(`${API_BASE_URL}/appointments/${id}`, {
      ...appointmentData,
      doctor: getState().appointments.appointments.find((apt) => apt._id === id)
        ?.doctor,
    });
    return response.data;
  }
);

const appointmentSlice = createSlice({
  name: "appointments",
  initialState: {
    appointments: [],
    status: "idle",
    error: null,
  },
  reducers: {
    updateAppointments: (state, action) => {
      state.appointments = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAppointments.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAppointments.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.appointments = action.payload;
      })
      .addCase(fetchAppointments.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(createAppointment.fulfilled, (state, action) => {
        state.appointments.push(action.payload);
      })
      .addCase(deleteAppointment.fulfilled, (state, action) => {
        state.appointments = state.appointments.filter(
          (appointment) => appointment._id !== action.payload
        );
      })
      .addCase(updateAppointment.fulfilled, (state, action) => {
        const index = state.appointments.findIndex(
          (appointment) => appointment._id === action.payload._id
        );
        if (index !== -1) {
          state.appointments[index] = action.payload;
        }
      });
  },
});

export const { updateAppointments } = appointmentSlice.actions;
export default appointmentSlice.reducer;
