import { useEffect, useState } from "react";
import { fetchClubList } from "../services/clubService"; // Import the service
import { useCookies } from "react-cookie";

const useSelectClub = () => {

    const [cookies] = useCookies(["token"]);
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchInfo = async () => {
        setIsLoading(true);

        try {
            const token = cookies.token;
            const response = await fetchClubList(token); // Using the service
            setData(response.listclubs || []);
        } catch (err) {
            console.error("Error fetching club list:", err);
            setError("Error fetching club list");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchInfo();
    }, []);

    const options = data.map((item) => {
        const roleCode = item.role;
        const role =
            roleCode === "0"
                ? "Super Admin"
                : roleCode === "1"
                    ? "Club Admin"
                    : roleCode === "2"
                        ? "Member"
                        : "No Role Assigned";

        return {
            clubId: item.clubId,
            value: item.club?.club_name || "Unknown Club",
            label: item.club?.club_name || "Unknown Club",
            role,
            roleCode,
            clubData: item,
        };
    });

    return { options, isLoading, error, refetch: fetchInfo };
};

export default useSelectClub;
