import React, { useEffect, useState } from 'react'
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import ClubDropdown from '../../components/Dropdowns/ClubDropdown';
import { setClubSession } from '../../services/SessionService';

function ClubSelection() {
    const navigate = useNavigate();
    const [cookies] = useCookies(['token']);
    const [club, setClub] = useState(0);

    const handleSubmit = async () => {
        console.log("Selected Club ID:", club.clubId);
        if (!club) {
            return;
        }

        try {
            const res = await setClubSession(club.clubId, club.role);

            if(res.success){
                navigate("/", { replace: true });
            } else {
                console.error("Failed to set Session");
            }
        } catch (error) {
            console.error("session set Error: ", error);
        }
    };

    useEffect(() => {
        if (!cookies.token) navigate("/signin")
    },[]);
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
                    <div className="items-center text-br-blue-medium  w-full max-w-md">
                        <p className="font-bold text-lg">Select Club</p>
                        <p className="text-br-blue-medium text-base">
                            Get access to a world where imagination never stops
                        </p>

                        <ClubDropdown setClub={setClub} />

                        <button
                            onClick={handleSubmit}
                            className="w-full bg-br-blue-medium text-white  mt-2 rounded-lg p-3 hover:bg-opacity-90 transition "
                        >
                            Enter
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ClubSelection
