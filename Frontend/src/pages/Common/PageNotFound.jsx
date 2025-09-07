import React, { useEffect, useState } from 'react'
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import ClubDropdown from '../../components/Dropdowns/ClubDropdown';
import { setClubSession } from '../../services/SessionService';

function PageNotFound() {
    const navigate = useNavigate();
    
    const goHome = () => {
        navigate("/");
      };
    return (
        <div className="flex items-center justify-center w-full h-screen p-3">
            <div className="w-full lg:w-full h-full flex flex-col items-center bg-white py-3 px-2">
                <div
                    className="bg-br-blue-light items-center w-full py-6 px-4 text-2xl font-bold text-br-blue-medium rounded-2xl mb-4"
                    style={{ height: "auto" }}
                >
                    BookCircle
                </div>

                <div className=" flex items-center justify-center bg-br-blue-light w-full h-screen mt-4py-4 px-2 rounded-2xl">
                        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
                            <h1 className="text-6xl font-bold text-br-blue-dark">404</h1>
                            <h2 className="text-2xl font-semibold mt-4 text-gray-800">Page Not Found</h2>
                            <p className="mt-2 text-gray-500">
                                Oops! The page you're looking for doesn't exist.
                            </p>
                            <button
                                onClick={goHome}
                                className="mt-6 bg-br-blue-dark text-white px-6 py-2 rounded-lg hover:bg-br-blue-medium transition"
                            >
                                Go to Home
                            </button>
                        </div>
                </div>
            </div>
        </div>
    )
}

export default PageNotFound
