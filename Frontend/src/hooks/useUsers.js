import { useState, useCallback } from "react";
import { fetchuserList } from "../services/userService";

export function useUsers() {
  const [users, setUsers] = useState({ data: [], total: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUsers = useCallback(async (params) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetchuserList(params);
      setUsers({ data: response.users, total: response.total });
      console.log("Users fetched successfully:", response.users);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  return { users, loading, error, fetchUsers };
}
