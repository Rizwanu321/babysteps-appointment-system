import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { API_BASE_URL } from "../utils/constants";

export const fetchDoctors = createAsyncThunk(
  "doctors/fetchDoctors",
  async () => {
    const response = await axios.get(`${API_BASE_URL}/doctors`);
    return response.data;
  }
);

export const fetchAvailableSlots = createAsyncThunk(
  "doctors/fetchAvailableSlots",
  async ({ doctorId, date }) => {
    const response = await axios.get(
      `${API_BASE_URL}/doctors/${doctorId}/slots`,
      {
        params: { date: date.toISOString().split("T")[0] },
      }
    );
    return response.data;
  }
);

const doctorSlice = createSlice({
  name: "doctors",
  initialState: {
    doctors: [],
    availableSlots: [],
    status: {
      doctors: "idle",
      slots: "idle",
    },
    error: {
      doctors: null,
      slots: null,
    },
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDoctors.pending, (state) => {
        state.status.doctors = "loading";
      })
      .addCase(fetchDoctors.fulfilled, (state, action) => {
        state.status.doctors = "succeeded";
        state.doctors = action.payload;
      })
      .addCase(fetchDoctors.rejected, (state, action) => {
        state.status.doctors = "failed";
        state.error.doctors = action.error.message;
      })
      .addCase(fetchAvailableSlots.pending, (state) => {
        state.status.slots = "loading";
        state.availableSlots = [];
      })
      .addCase(fetchAvailableSlots.fulfilled, (state, action) => {
        state.status.slots = "succeeded";
        state.availableSlots = action.payload;
      })
      .addCase(fetchAvailableSlots.rejected, (state, action) => {
        state.status.slots = "failed";
        state.error.slots = action.error.message;
        state.availableSlots = [];
      });
  },
});

export default doctorSlice.reducer;
