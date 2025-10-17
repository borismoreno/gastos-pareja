import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface HogarState {
    hasHogar: boolean;
    hogar: {
        id: string;
        nombre: string;
        join_code: string;
        presupuesto: number;
    } | null;
}

const initialState: HogarState = {
    hasHogar: false,
    hogar: null
}

export const hogarSlice = createSlice({
    name: 'hogar',
    initialState,
    reducers: {
        setHogar: (state, action: PayloadAction<{ id: string, nombre: string, join_code: string, presupuesto: number }>) => {
            state.hasHogar = true;
            state.hogar = action.payload;
        },
        removeHogar: (state) => {
            state.hasHogar = false;
            state.hogar = null;
        }
    }
})

export const { setHogar, removeHogar } = hogarSlice.actions;
export const selectHasHogar = (state: { hogar: HogarState }) => state.hogar.hasHogar;
export const selectHogar = (state: { hogar: HogarState }) => state.hogar;

export default hogarSlice.reducer;