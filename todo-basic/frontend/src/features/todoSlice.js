import {createAsyncThunk, createSlice} from "@reduxjs/toolkit"
import axios from "axios"
import toast from "react-hot-toast"
const initialState = {
    todos : [], 
    loading : false,
    error : null,
};

//Fetching all todos
export const fetchTodos = createAsyncThunk("todo/fetchAll", async(_, ThunkApi) => {
    try {
        const response = await axios.get(`http://localhost:8001/todo/getAll`);
        return response.data.data;
    } catch (error) {
        toast.error(error.response.data.message);
        return ThunkApi.rejectWithValue(error.response.data);
    }
});

//Adding todo
export const addTodo = createAsyncThunk("todo/add", async(data, ThunkApi) => {
    try {
        const response = await axios.post(`http://localhost:8001/todo/create`, data);
        toast.success("Todo added successfully");
        return response.data.data;
    } catch (error) {
        toast.error(error.response.data.message);
        return ThunkApi.rejectWithValue(error.response.data);
    }
});


//Edit todo
export const editTodo = createAsyncThunk("todo/edit", async({id, data}, ThunkApi) => {
    try {
        const response = await axios.put(`http://localhost:8001/todo/update/${id}`, data);
        toast.success("Todo updated successfully");
        return response.data.data;
    } catch (error) {
        toast.error(error.response.data.message);
        return ThunkApi.rejectWithValue(error.response.data);
    }
});

//Delete Todo
export const deleteTodo = createAsyncThunk("todo/delete", async(id, ThunkApi) => {
    try {
        await axios.delete(`http://localhost:8001/todo/delete/${id}`);
        toast.success("Todo deleted successfully");
        return id
    } catch (error) {
        toast.error(error.response.data.message);
        return ThunkApi.rejectWithValue(error.response.data);
    }
});

//slice

const todoSlice = createSlice({
    name : "todo",
    initialState,
    reducers : {}, // useState values updated that thing to be called here

    extraReducers : (builder) => {  // whenever Api is there in slice
        builder
        //Fetch
        .addCase(fetchTodos.pending,(state) => {
            state.loading = true
        })
        .addCase(fetchTodos.fulfilled, (state,action) => {
            state.loading = false
            state.todos = action.payload || []
        })
        .addCase(fetchTodos.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
        })

        //add
        .addCase(addTodo.fulfilled, (state, action) => {
            if(action.payload){
                state.todos.push(action.payload)
            }
        })

        //edit
        .addCase(editTodo.fulfilled, (state, action) => {
            const index = state.todos.findIndex((item) => item._id === action.payload._id);
            if(index !== -1) state.todos[index] = action.payload;
        })

        //delete
        .addCase(deleteTodo.fulfilled, (state, action) => {
            state.todos = state.todos.filter((item) => item._id !== action.payload);
        })
    }
});

export default todoSlice.reducer