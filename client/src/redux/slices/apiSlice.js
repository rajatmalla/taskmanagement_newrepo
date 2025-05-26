import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// const API_URL = "/api";
const API_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-vercel-domain.vercel.app/api'
  : 'http://localhost:8800/api';

const baseQuery = fetchBaseQuery({ 
    baseUrl: API_URL,
    credentials: 'include',
    prepareHeaders: (headers, { getState }) => {
        const token = getState().auth.token;
        
        if (token) {
            headers.set('authorization', `Bearer ${token}`);
        }
        
        headers.set('Content-Type', 'application/json');
        return headers;
    }
});

// Add a wrapper to handle token refresh and errors
const baseQueryWithReauth = async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions);
    
    if (result.error) {
        if (result.error.status === 401) {
            api.dispatch({ type: 'auth/logout' });
            if (typeof window !== 'undefined') {
                window.location.href = '/login';
            }
        }
    }
    
    return result;
};

export const apiSlice = createApi({
    baseQuery: baseQueryWithReauth,
    tagTypes: ['Task', 'User', 'Team'],
  endpoints: (builder) => ({}),
});