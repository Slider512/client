import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Task } from '../../models';

export const fetchTasks = createAsyncThunk('tasks/fetchTasks', async () => {
  const response = await fetch('/api/tasks');
  return (await response.json()) as Task[];
});

const tasksSlice = createSlice({
  name: 'tasks',
  initialState: {
    items: [] as Task[],
    loading: false,
    error: null as string | null,
  },
  reducers: {
    addTask(state, action) {
      state.items.push(action.payload);
    },
    deleteTask(state, action) {
      state.items = state.items.filter((task) => task.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to fetch tasks';
        state.loading = false;
      });
  },
});

export const { addTask, deleteTask } = tasksSlice.actions;
export default tasksSlice.reducer;