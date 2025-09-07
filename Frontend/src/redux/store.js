import { configureStore } from '@reduxjs/toolkit'
import clubSessionSlice from './slices/clubSession/clubSessionSlice'

export const store = configureStore({
  reducer: {
    clubSession: clubSessionSlice
  },
})

