import React, { useState, useEffect } from "react";
import { fetchAllClubs } from "../../services/clubService";
import { useCookies } from "react-cookie";

const UserFilters = ({
  onClose,
  initialFilters,
  isClubAdmin = false,
  clubId: myClubId
}) => {
  const [filters, setFilters] = useState({
    status: Array.isArray(initialFilters?.status) ? initialFilters.status : [],
    role:   Array.isArray(initialFilters?.role)   ? initialFilters.role   : [],
    clubs:  Array.isArray(initialFilters?.clubs)  ? initialFilters.clubs  : [],
  });

  const [cookies] = useCookies(["token"]);
  const token = cookies.token;

  const [clubList, setClubList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isClubAdmin) {
      setLoading(true);
      fetchAllClubs(token)
        .then(res => setClubList(res.listclubs || []))
        .catch(console.error)
        .finally(() => setLoading(false));
    } else {
      // Lock club to club admin's own
      setFilters(f => ({ ...f, clubs: [String(myClubId)] }));
    }
  }, [isClubAdmin, myClubId, token]);

  const toggleFilterValue = (key, value) =>
    setFilters(prev => {
      const exists = prev[key].includes(value);
      return {
        ...prev,
        [key]: exists
          ? prev[key].filter(v => v !== value)
          : [...prev[key], value]
      };
    });

  const handleSeeResults = () => {
    const out = { ...filters };
    if (isClubAdmin) out.clubs = [String(myClubId)];
    onClose(out);
  };

  // Build options dynamically
  const statusOptions = [
    { id: true,  label: "Active" },
    { id: false, label: "Inactive" }
  ];

  const baseRoleOptions = [
    { id: "0", label: "Super Admin" },
    { id: "1", label: "Club Admin" },
    { id: "2", label: "Member" }
  ];

  const roleOptions = isClubAdmin
    ? baseRoleOptions.filter(opt => opt.id !== "0")
    : baseRoleOptions;

  const clubOptions = isClubAdmin
    ? [{ id: String(myClubId), label: "Your Club" }]
    : clubList.map(c => ({ id: String(c.id), label: c.club_name }));

  const filterOptions = { status: statusOptions, role: roleOptions, clubs: clubOptions };

  const sectionTitles = { status: "Status", role: "Role", clubs: "Clubs" };

  return (
    <div className="bg-white w-62 p-5 px-8 border border-br-blue-light rounded-xl space-y-3 z-10">
      <h1 className="text-xl font-bold">Filters</h1>
      <hr className="border-t" />

      {Object.entries(filterOptions).map(([key, options], idx) => (
        <div key={key} className="space-y-2">
          {idx > 0 && <hr className="border-t" />}
          <h2 className="text-lg font-semibold">{sectionTitles[key]}</h2>
          <div className="flex flex-col space-y-2 max-h-40 overflow-y-auto">
            {key === "clubs" && !isClubAdmin && loading ? (
              <p className="text-sm text-gray-500">Loading clubs...</p>
            ) : (
              options.map(opt => (
                <label key={opt.id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={filters[key].includes(opt.id)}
                    onChange={() => toggleFilterValue(key, opt.id)}
                    disabled={key === "clubs" && isClubAdmin}
                  />
                  <span>{opt.label}</span>
                </label>
              ))
            )}
          </div>
        </div>
      ))}

      <button
        onClick={handleSeeResults}
        className="bg-br-blue-medium text-white px-4 py-2 rounded w-full hover:bg-br-blue-dark transition duration-200"
      >
        Apply Filters
      </button>
    </div>
  );
};

export default UserFilters;
