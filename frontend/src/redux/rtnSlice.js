import { createSlice } from "@reduxjs/toolkit";
const rtnSlice = createSlice({
  name:'realTimeNotification',
  initialState:{
    likeNotification:[]
  },
  reducers:{
    setNotification:(state,action)=>{
      if(action.payload.type=== 'like')
      {
        state.likeNotification.puch(action.payload)
      }
      else if(action.payload.type=== 'dislike'){
        state.likeNotification = state.likeNotification.filter(item=>item.userId !== action.payload.userId)
      }
    }
  }
})

export const {setNotification} = rtnSlice.actions;
export default rtnSlice.reducer;