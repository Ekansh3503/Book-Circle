import { useEffect, useState } from "react";
import { Box, CircularProgress } from "@mui/material";
import { SquarePlus } from "lucide-react";
import { useCookies } from "react-cookie";
import { useSelector } from "react-redux";
import { fetchUserBooks } from "../../services/bookService";
import BookList from "../../components/Listing/BookList";
import BookFormDialog from "../../components/Dialogs/BookFormDialog";
import Pagination from "../../components/Pagination/Pagination";

function UserBookList() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [emptyMessage, setEmptyMessage] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [cookies] = useCookies(["token"]);
  const clubId = useSelector((state) => state.clubSession.clubId);
  const token = cookies.token;

  const getBookData = async () => {
    setLoading(true);
    setError("");
    setEmptyMessage("");
    try {
      const response = await fetchUserBooks({ token, clubId, page: currentPage, limit: 10 });
      console.log("Fetched books:", response.data);
      if (response.data.success) {
        setBooks(response.data.books);
        setTotalResults(response.data.total);
        if (response.data.books.length === 0) {
          setEmptyMessage("No books listed.");
        }
      } else {
        setError("Failed to fetch books.");
      }
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getBookData();
  }, [currentPage, clubId]);

  const handleBookSubmit = () => {
    getBookData();
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleEdit = (book) => {
    setSelectedBook(book);
    setOpenDialog(true);
  };

  return (
    <Box className="bg-br-blue-light p-0 w-full rounded-lg overflow-hidden">
      <Box className="flex flex-row py-4 px-6 items-center bg-br-white">
        <div className="text-xl font-bold">My Books</div>
        <button
          className="bg-br-blue-medium cursor-pointer text-white px-4 py-2 rounded-lg hover:bg-br-blue-dark flex items-center ml-auto font-bold"
          onClick={() => setOpenDialog(true)}
        >
          <SquarePlus className="mr-2" />
          Add Book
        </button>
      </Box>

      {loading ? (
        <Box className="p-4 text-center bg-br-white">
          <CircularProgress />
        </Box>
      ) : (
        <>
          <BookList
            books={books}
            onEdit={handleEdit}
            error={error}
            emptyMessage={emptyMessage}
          />
          {!error && books.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalResults={totalResults}
              onPageChange={handlePageChange}
              className="mt-1"
            />
          )}
        </>
      )}

      <BookFormDialog
        open={openDialog}
        onClose={() => {
          setOpenDialog(false);
          setSelectedBook(null);
        }}
        onSubmit={handleBookSubmit}
        initialData={selectedBook}
      />
    </Box>
  );
}

export default UserBookList;
