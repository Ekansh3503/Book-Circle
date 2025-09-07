import React, { useState, useEffect } from "react";
import { Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, Snackbar } from "@mui/material";
import { MdEdit } from "react-icons/md";
import { TiDelete } from "react-icons/ti";
import { MdOutlineDone } from "react-icons/md";
import { useSelector } from "react-redux";
import defaultProfile from "../../assets/clubLogo.png";
import { deactivateUser, fetchuserList } from "../../services/userService";
import EditMember from "../Dialogs/EditMember";
import { getMemberDetails } from "../../services/userService";
import MuiAlert from "@mui/material/Alert";
import { ChevronUp } from "lucide-react";
import ColumnFilterDropdown from "../Dropdowns/ColumnFilterDropdown";
import { useCookies } from "react-cookie";
import { fetchAllClubs } from "../../services/clubService";


const roleMap = {
  0: "Super Admin",
  1: "Clubadmin",
  2: "Member",
};

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});


const Users = ({
  currentPage,
  onTotalResults,
  sortOptions,
  searchQuery,
  filters,
  onSort,
  onFilter,
}) => {
  const { role } = useSelector((state) => state.clubSession);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editLoading, setEditLoading] = useState(false);

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUserToToggle, setSelectedUserToToggle] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [cookies] = useCookies(["token"]);
  const token = cookies.token;
  const [clubList, setClubList] = useState([]);
  const [clubLoading, setClubLoading] = useState(false);


  const loadUsers = async () => {
    try {
      setLoading(true);

      const params = {
        page: currentPage,
      };

      if (searchQuery?.trim()) params.search = searchQuery.trim();
      if (sortOptions?.field) params.sortBy = sortOptions.field;
      if (sortOptions?.order) params.sortOrder = sortOptions.order;

      if (filters?.status?.length) params.status = filters.status;
      if (filters?.role?.length) params.filterRole = filters.role.join(",");
      if (filters?.clubs?.length) params.clubs = filters.clubs.join(",");

      const result = await fetchuserList(params, role);

      console.log("User List Result: ", result);
      if (result.success) {
        setUsers(result.users);
        onTotalResults(result.total);
      } else {
        setUsers([]);
        onTotalResults(0);
        setError("Something went wrong.");
      }
    } catch (err) {
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = async (userId) => {
    try {
      setEditLoading(true);
      const response = await getMemberDetails(userId, role);

      if (response.success) {
        setSelectedUser(response.user);
        setOpenEdit(true);
      } else {
        console.error("Failed to fetch user details:", response.message);
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
    } finally {
      setEditLoading(false);
    }
  };

  const handleToggleStatusClick = (user) => {
    setSelectedUserToToggle(user);
    setOpenDialog(true);
  };

  const handleConfirmToggleStatus = async () => {
    try {
      const res = await deactivateUser({ userId: selectedUserToToggle.id, role });
      setSnackbar({
        open: true,
        message: res.message || "Status updated",
        severity: "success",
      });
      setOpenDialog(false);
      setSelectedUserToToggle(null);
      loadUsers();
    } catch (err) {
      const msg = err?.response?.data?.message || "Failed to update status";
      setSnackbar({ open: true, message: msg, severity: "error" });
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedUserToToggle(null);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleColumnSort = (field) => {
    const newOrder = sortOptions.field === field && sortOptions.order === "ASC" ? "DESC" : "ASC";
    const newSortOptions = {
      field,
      order: newOrder
    };
    onSort(newSortOptions);
  }

  useEffect(() => {
    const fetchClubs = async () => {
      if (role !== 1) { // if not club admin
        setClubLoading(true);
        try {
          const res = await fetchAllClubs(token);
          setClubList(res.listclubs || []);
        } catch (err) {
          console.error("Failed to fetch clubs", err);
        } finally {
          setClubLoading(false);
        }
      }
    };
    fetchClubs();
  }, [role, token]);

  useEffect(() => {
    loadUsers();
  }, [currentPage, sortOptions, searchQuery, filters]);

  return (
    <Box className="p-0 w-full overflow-x-auto">
      {/* Header row */}
      <Box className="bg-white flex flex-row items-center justify-between py-4 px-4 text-sm font-semibold text-br-gray-dark mb-1 rounded-t-2xl shadow-sm">
        <div className="w-2/11 flex flex-row justify-between items-center cursor-pointer pr-2" onClick={() => handleColumnSort('name')}>
          <span className={`${sortOptions.field === 'name' ? 'text-br-blue-dark' : ''}`}>
            Name
          </span>
          <div className="flex flex-col ml-1 justify-end">
            <ChevronUp size={16} className={`${sortOptions.field === 'name' && sortOptions.order === 'ASC' ? 'text-br-blue-dark' : 'text-gray-400'} transition-transform duration-200`} />
            <ChevronUp size={16} className={`${sortOptions.field === 'name' && sortOptions.order === 'DESC' ? 'text-br-blue-dark' : 'text-gray-400'} transform rotate-180 transition-transform duration-200`} />
          </div>
        </div>
        <Divider orientation="vertical" flexItem className="mx-4" />
        <div className="w-2/11 px-2">Email</div>
        <Divider orientation="vertical" flexItem className="mx-4" />
        <div className="w-1/11 px-2">Phone</div>
        <Divider orientation="vertical" flexItem className="mx-4" />
        <div className="w-1/11 align-center px-2">
          <ColumnFilterDropdown
            label="Status"
            options={[
              { id: true, label: "Active" },
              { id: false, label: "Inactive" }
            ]}
            selectedValues={filters.status || []}
            onChange={(values) => onFilter({ ...filters, status: values })}
          />
        </div>
        <Divider orientation="vertical" flexItem className="mx-4" />
        <div className="w-1/11 px-2">
          <ColumnFilterDropdown
            label="Clubs"
            loading={clubLoading}
            options={
              role === 1
                ? [{ id: String(filters.clubs?.[0] || ""), label: "Your Club" }]
                : clubList.map((c) => ({
                  id: String(c.id),
                  label: c.club_name,
                }))
            }
            selectedValues={filters.clubs || []}
            onChange={(values) => onFilter({ ...filters, clubs: values })}
            disabled={role === 1} // lock filter if club admin
          />
        </div>

        <Divider orientation="vertical" flexItem className="mx-4" />
        <div className="w-1/11 px-2">
          <ColumnFilterDropdown
            label="Role"
            options={[
              { id: "0", label: "Super Admin" },
              { id: "1", label: "Club Admin" },
              { id: "2", label: "Member" }
            ]}
            selectedValues={filters.role || []}
            onChange={(values) => onFilter({ ...filters, role: values })}
          />
        </div>
        <Divider orientation="vertical" flexItem className="mx-4" />
        <div className="w-1/11 flex items-center justify-between cursor-pointer px-2" onClick={() => handleColumnSort('createdAt')}>
          <span className={`${sortOptions.field === 'createdAt' ? 'text-br-blue-dark' : ''} `}>
            Joined At
          </span>
          <div className="flex flex-col justify-end">
            <ChevronUp size={16} className={`${sortOptions.field === 'createdAt' && sortOptions.order === 'ASC' ? 'text-br-blue-dark' : 'text-gray-400'} transition-transform duration-200`} />
            <ChevronUp size={16} className={`${sortOptions.field === 'createdAt' && sortOptions.order === 'DESC' ? 'text-br-blue-dark' : 'text-gray-400'} transform rotate-180 transition-transform duration-200`} />
          </div>
        </div>
        <Divider orientation="vertical" flexItem className="mx-4" />
        <div className="w-2/11 text-right">Actions</div>
      </Box>

      {/* Data rows */}
      <div className="space-y-1">
        {loading ? (
          <Box className="p-6 text-center bg-white">
            <CircularProgress />
          </Box>
        ) : error ? (
          <Box className="p-6 text-center bg-white text-red-600">
            {error.message || String(error)}
          </Box>
        ) : !users || users.length === 0 ? (
          <Box className="bg-white p-6 text-center">No users found.</Box>
        ) : (
          users.map((user) => (
            <Box
              key={user.id}
              className="bg-white flex flex-row items-center py-4 px-4 text-sm hover:shadow-sm transition-shadow duration-150"
            >

              {/* User Info */}
              <div className="w-2/11 font-medium">{user.name}</div>
              <div className="w-2/11 truncate">{user.email}</div>
              <div className="w-1/11">{user.phone_no}</div>
              <div className="w-1/11 capitalize font-semibold">
                <span
                  className={`px-2 py-1 rounded-full text-xs 
                                ${user.status
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                    }`}
                >
                  {user.status ? "Active" : "Inactive"}
                </span>
              </div>

              <div className="w-2/11">
                {user.clubusers.map((cu) => (
                  <div
                    key={cu.clubId}
                    className="flex flex-row items-center space-x-2 bg-br-blue-light rounded-xl p-2 mb-1"
                  >
                    <div className="w-1/2" key={cu.clubId}>
                      {cu.club?.club_name || "—"}
                    </div>

                    <div className="w-1/2 text-sm text-gray-500">
                      {roleMap[cu.role] || "—"}
                    </div>
                  </div>
                ))}
              </div>

              {/* Member From */}
              <div className="w-1/11 text-center">
                {new Date(user.createdAt).toLocaleDateString()}
              </div>

              {/* Actions */}
              <div className="w-2/11 flex justify-end space-x-3">
                <button
                  className={`cursor-pointer px-2 py-2 bg-br-blue-dark text-white rounded-lg hover:bg-br-blue-medium transition-colors duration-200 flex items-center gap-1 ${editLoading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  onClick={() => handleEditClick(user.id)}
                  disabled={editLoading}
                >
                  {editLoading ? (
                    <CircularProgress size={18} color="inherit" />
                  ) : (
                    <MdEdit size={18} />
                  )}
                </button>
                <button
                  onClick={() => handleToggleStatusClick(user)}
                  className={`flex px-2 py-2 cursor-pointer text-white gap-1 rounded-lg transition-colors duration-200 items-center ${user.status
                    ? "bg-[var(--color-br-red-medium)] hover:bg-red-400"
                    : "bg-[var(--color-br-green-medium)] hover:bg-green-400"
                    }`}
                >
                  {user.status ? (
                    <TiDelete size={18} />
                  ) : (
                    <MdOutlineDone size={18} />
                  )}
                </button>
              </div>
            </Box>
          ))
        )}
      </div>

      {selectedUser && (
        <EditMember
          open={openEdit}
          onClose={() => {
            setOpenEdit(false);
            setSelectedUser(null);
          }}
          userData={selectedUser}
          onSave={async (formData) => {
            await loadUsers();
          }}
        />
      )}

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>
          Confirm {selectedUserToToggle?.status ? "Deactivation" : "Activation"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to{" "}
            {selectedUserToToggle?.status ? "deactivate" : "activate"} "
            {selectedUserToToggle?.name}"?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            color={selectedUserToToggle?.status ? "error" : "success"}
            onClick={handleConfirmToggleStatus}
          >
            {selectedUserToToggle?.status ? "Deactivate" : "Activate"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Users;
