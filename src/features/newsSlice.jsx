import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const NEWS_API_URL = 'https://newsapi.org/v2/top-headlines';
const API_KEY_NEWS = 'a564c6ba854346d58e2867844bf31874';

export const fetchNews = createAsyncThunk('news/fetchNews', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${NEWS_API_URL}?country=us`, {
      headers: {
        'X-Api-Key': API_KEY_NEWS,
      },
    });
    return response.data.articles;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const fetchFilteredNews = createAsyncThunk(
  'news/fetchFilteredNews',
  async ({ author, dateRange }, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();

      if (author) params.append('q', author);
      if (dateRange[0]) params.append('from', dateRange[0]);
      if (dateRange[1]) params.append('to', dateRange[1]);

      const response = await axios.get(`${NEWS_API_URL}?${params.toString()}&country=us`, {
        headers: {
          'X-Api-Key': API_KEY_NEWS,
        },
      });
      return response.data.articles;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const searchNews = createAsyncThunk('news/searchNews', async (keyword, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${NEWS_API_URL}?q=${keyword}&country=us`, {
      headers: {
        'X-Api-Key': API_KEY_NEWS,
      },
    });
    return response.data.articles;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

const newsSlice = createSlice({
  name: 'news',
  initialState: {
    articles: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearResults(state) {
      state.articles = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNews.fulfilled, (state, action) => {
        state.loading = false;
        state.articles = action.payload;
      })
      .addCase(fetchNews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchFilteredNews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFilteredNews.fulfilled, (state, action) => {
        state.loading = false;
        state.articles = action.payload;
      })
      .addCase(fetchFilteredNews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(searchNews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchNews.fulfilled, (state, action) => {
        state.loading = false;
        state.articles = action.payload;
      })
      .addCase(searchNews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearResults } = newsSlice.actions;

export default newsSlice.reducer;
