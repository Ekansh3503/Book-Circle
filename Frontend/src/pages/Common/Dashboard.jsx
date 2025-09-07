import React, { useEffect, useState } from 'react'
import Databox from '../../components/Databox/Databox';
import { useSelector } from 'react-redux';
import { useCookies } from 'react-cookie';
import { getDashboardStats } from '../../services/dashboardService';

function Dashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBooks: 0,
    totalClubs: 0,
    totalMembers: 0,
    totalTransactions: 0
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { role: userRole } = useSelector((state) => state.clubSession);
  const [cookies] = useCookies(['token']);
  const token = cookies.token;

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      if (!token || userRole === undefined) {
        setError("Authentication credentials missing");
        return;
      }

      const response = await getDashboardStats(token, userRole);

      if (response.success) {
        setStats(response.data);
        console.log(response.data);
        setError(null);
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      setError(error.message || "Failed to fetch dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, [token, userRole]);

  const renderStats = () => {
    if (userRole == 0) {
      return (
        <div className='flex w-full items-center justify-between space-x-4'>
          <div className="flex-1">
            <Databox number={stats.totalUsers} label="Total Users" />
          </div>
          <div className="flex-1">
            <Databox number={stats.totalBooks} label="Total Books" />
          </div>
          <div className="flex-1">
            <Databox number={stats.totalClubs} label="Total Clubs" />
          </div>
        </div>
      );
    } else if (userRole == 1) {
      return (
        <div className='flex w-full items-center justify-between space-x-4'>
          <div className="flex-1">
            <Databox number={stats.totalMembers} label="Total Members" />
          </div>
          <div className="flex-1">
            <Databox number={stats.totalBooks} label="Total Books" />
          </div>
          <div className="flex-1">
            <Databox number={stats.totalTransactions} label="Total Transactions" />
          </div>
        </div>
      );
    }
    return null;
  };

  if (loading) return <div>Loading...</div>;
  // if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className='w-full h-auto space-y-4'>
      {renderStats()}
    </div>
  );
}

export default Dashboard
