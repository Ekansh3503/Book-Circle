import React, { useEffect, useState } from 'react'
import MuiAlert from '@mui/material/Alert';
import { Box, CircularProgress, Rating } from '@mui/material';
import { getreviewbyuserid } from '../../services/reviewService';
import { useCookies } from 'react-cookie';
import { Edit } from 'lucide-react';
import { MdOutlineEdit } from 'react-icons/md';


const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function UserReviewList() {

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cookies] = useCookies(['token']);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    type: 'success'
  });

  const [reviews, setReviews] = useState([]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await getreviewbyuserid(cookies.token);
      if (response.success) {
        setReviews(response.reviews);
      } else {
        setError(response.message || 'Failed to fetch reviews');
      }
    } catch (err) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchReviews();
  }, []);


  return (
    <Box className="w-full min-h-screen bg-br-blue-light flex justify-center">
      <Box className="w-full">
        <Box className="flex flex-row items-center justify-between py-4 px-4 w-full bg-br-white">
          <div className="text-xl font-bold text-br-blue-dark ">My Book Reviews</div>
        </Box>
        <Box sx={{ borderBottom: 2, borderColor: "divider" }} className="w-full" />

        {loading ? (
          <Box className="p-6 flex justify-center bg-br-white"><CircularProgress /></Box>
        ) : error ? (
          <Box className="p-6 text-center text-red-600 text-base font-semibold bg-br-white">{error}</Box>
        ) : reviews.length === 0 ? (
          <Box className="text-gray-400 text-center py-6 text-base bg-br-white">No reviews found</Box>
        ) : (
          <Box className="w-full bg-br-white rounded-b-xl">
            {reviews.map((review, idx) => (
              <React.Fragment key={review._id}>
                <Box className="flex flex-row items-center p-6 bg-transparent group w-full">
                  <Box className="flex flex-col items-start w-11/12 space-y-1">
                    <div className="font-semibold text-base text-br-blue-dark group-hover:text-br-blue-medium transition-colors">{review.book.title}</div>
                    <Rating
                      name="size-large"
                      value={review.rating}
                      size="small"
                      readOnly
                      className="mb-1"
                    />
                    <div className="font-medium text-sm text-br-blue-medium">{review.reviewTitle}</div>
                    <div className="font-roboto text-gray-700 text-sm">{review.reviewText}</div>
                  </Box>
                  <Box className="flex flex-col items-end justify-center w-2/12 h-full">
                    <button
                      title="Edit Review"
                      className="group/edit relative flex items-center justify-center px-2 h-full bg-br-blue-dark rounded-xl hover:bg-br-blue-medium transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-br-blue-light focus:ring-offset-2 cursor-pointer"
                      style={{ minHeight: 48 }}
                    >
                      <span className="absolute inset-0 rounded-xl"></span>
                      <MdOutlineEdit 
                        className="relative z-10 p-2 text-br-white"
                        size={32} 
                      />
                    </button>
                  </Box>
                </Box>
                {idx !== reviews.length - 1 && (
                  <Box className="w-full h-px bg-br-blue-light my-2" />
                )}
              </React.Fragment>
            ))}
          </Box>
        )}
        {snackbar.open && (
          <Alert
            severity={snackbar.type}
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            className="absolute top-4 right-4"
          >
            {snackbar.message}
          </Alert>
        )}
      </Box>
    </Box>
  )
}

export default UserReviewList
