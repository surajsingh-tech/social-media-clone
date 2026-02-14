import { createSlice } from "@reduxjs/toolkit";
const sockitSlice = createSlice({
  name :'socketio',
  initialState: {
    socket : null
  },
  reducers : {
    //actions
    setSocket : (state,action)=>{
      state.socket = action.payload ;
    }
  }
})

export const {setSocket} =sockitSlice.actions;
export default sockitSlice.reducer;