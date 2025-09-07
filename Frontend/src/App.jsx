
import { Route, Routes } from 'react-router-dom'
import Login from './pages/Auth/Login'
import Homepage from './pages/Common/Homepage'
import SetPassword from './pages/Auth/SetPassword'
import ResetPassword from './pages/Auth/ResetPassword'
import ForgotPassword from './pages/Auth/ForgotPassword'
import ClubSelection from './pages/Auth/ClubSelection'
import PageNotFound from './pages/Common/PageNotFound'
import Dashboard from './pages/Common/Dashboard'
import BookListing from './pages/User/BookListing'
import BookDetails from './pages/User/BookDetails'
import MyBooks from './pages/User/MyBooks'
import MemberList from './pages/ClubAdmin/MemberList'
import TransactionList from './pages/ClubAdmin/TransactionList'
import ReviewList from './pages/ClubAdmin/ReviewList'
import ClubList from './pages/SuperAdmin/ClubList'
import ProfilePage from './pages/Common/ProfilePage'
import UserList from './pages/SuperAdmin/UserList'
import CategoryLanguageList from './pages/SuperAdmin/CategoryLanguageList'

function App() {
  return (
    <>
      <Routes>
        <Route path="/signin" element={<Login />} />
        <Route path="/set-password" element={<SetPassword />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path='/club-selection' element={<ClubSelection />} />
        <Route path='*' element={<PageNotFound />} />
        <Route path="/" element={<Homepage />} >
          <Route index element={<Dashboard />} />
          <Route path="books" element={<BookListing />} />
          <Route path="books/book-details" element={<BookDetails />} />

          <Route path="mybooks" element={<MyBooks />} />
          <Route path="clubmembers" element={<MemberList />} />
          <Route path="members" element={<UserList />} />
          <Route path="transactions" element={<TransactionList />} />
          <Route path="reviews" element={<ReviewList />} />
          <Route path="clubs" element={<ClubList />} />
          <Route path="category" element={<CategoryLanguageList />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>
      </Routes>
    </>
  )
}

export default App
