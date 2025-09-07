import { useEffect, useState } from "react";
import { fetchAllClubs } from "../services/clubService";
import { useCookies } from "react-cookie";

const useSelectAllClub = () => {
  const [cookies] = useCookies(["token"]);
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchInfo = async () => {
    setIsLoading(true);
    try {
      const token = cookies.token;
      const response = await fetchAllClubs(token);
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

  console.log("Data from useSelectAllClub:", data);
  const options = data.map((item) => ({
    id: item.id,
    name: item.club_name || "Unknown Club",
  }));

  return { options, isLoading, error, refetch: fetchInfo };
};

export default useSelectAllClub;
