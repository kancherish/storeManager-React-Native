import {createSlice, PayloadAction} from "@reduxjs/toolkit"
import { Stocks } from '../backend/database';

type stockState ={
    stockData: Stocks[]
}

const initialState:stockState = {
    stockData : []
}

const stockSlice = createSlice({
    name:"stockSlice",
    initialState,
    reducers:{
        addData:(state,action: PayloadAction<Stocks>):void=>{
            state.stockData.push(action.payload)
        },
        removeData:(state,action: PayloadAction<string>):void=>{
            state.stockData = state.stockData.filter((item)=>item.pid!==action.payload)
        },
        updateData:(state,action: PayloadAction<Stocks>):void =>{
            state.stockData = state.stockData.map((item)=>item.pid===action.payload.pid?action.payload:item)
        }
    }
})
export const stockReducers = stockSlice.reducer

export const {addData,removeData,updateData} = stockSlice.actions