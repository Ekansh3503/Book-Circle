import React, { useEffect, useState } from 'react'
import { useCookies } from 'react-cookie';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar/Sidebar';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import { fetchClubData } from '../../services/clubService';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserData } from '../../services/userService';
import { CircularProgress } from '@mui/material';
import { getSession } from '../../services/useAuthRedirect';
import useInitializeSession from '../../hooks/useInitializeSession';

function Homepage() {

  // Call your custom session hook
  useInitializeSession();

  // Redux session state
  const { userProfile, clubName, role, isSessionFetched } = useSelector(
    (state) => state.clubSession
  );
  console.log("isSessionFetched", isSessionFetched);

  // state to handle the sidebar
  const [open, setOpen] = useState(false);
  const [activeOption, setActiveOption] = useState("Dashboard");


  return (
    <>
      {
        !isSessionFetched ? (
          <div className='w-full h-screen flex overflow-hidden justify-center items-center'>
          <CircularProgress />
          </div>
        ) : (
          <div className='w-full max-h-screen flex overflow-hidden'>
             {isSessionFetched && ( // Conditionally render Sidebar
            <div className={`${open ? "w-64" : "w-24"} flex-shrink-0 transition-all duration-300`}>
              <Sidebar role={role} barstate={open} barstatechange={setOpen} activeOption={activeOption} setActiveOption={setActiveOption} />
            </div>
          )}
          <div className={'w-full max-h-fit bg-br-blue-light overflow-y-auto'}>
            <div className={'w-full min-h-screen p-4 color space-y-4'}>
              {isSessionFetched && ( // Conditionally render Header
                <Header setActiveOption={setActiveOption} userProfile={userProfile} clubName={clubName} />
              )}
                <div className='main-content flex-grow'>
                  <Outlet />
                </div>
              </div>
              <Footer />
            </div>
          </div>
        )}
    </>
  )
}

export default Homepage
