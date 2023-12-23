import {PayloadAction, createSlice} from '@reduxjs/toolkit';
import {RootState} from '../configureStore';

export interface UserState {
  user: string | null;
}

const initialState: UserState = {
  user: null,
};

export const userSlice = createSlice({
  name: 'user',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<string>) => {
      state.user = action.payload;
    },
    clearUser: state => {
      state.user = null;
    },
  },
});

export const {setUser, clearUser} = userSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectUser = (state: RootState) => state.auth.user;

export default userSlice.reducer;
