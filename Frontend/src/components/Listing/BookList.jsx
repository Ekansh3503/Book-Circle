import { Box } from "@mui/material";
import { MdOutlineEdit } from "react-icons/md";

const BookList = ({ books = [], onEdit, error = "", emptyMessage = "No books listed." }) => {
  return (
    <>
      {/* Column Headers */}
      <Box className="flex py-3 px-4 font-semibold mt-1 text-sm items-center bg-br-white">
        <div className="w-3/12">Title</div>
        <div className="w-1/12">Author</div>
        <div className="w-2/12">ISBN</div>
        <div className="w-1/12">Rating</div>
        <div className="w-1/12">Language</div>
        <div className="w-2/12">Category</div>
        <div className="w-1/12">Availability</div>
        <div className="w-1/12">Status</div>
        <div className="w-1/12 text-right">Action</div>
      </Box>

      {/* Error Message */}
      {error && (
        <Box className="px-4 py-3 text-red-600 bg-red-50 text-sm text-center mt-1">
          {error}
        </Box>
      )}

      {/* Empty Message */}
      {!error && books.length === 0 && (
        <Box className="px-4 py-3 text-br-blue-medium text-sm bg-blue-50 mt-1 text-center">
          {emptyMessage}
        </Box>
      )}

      {/* Book Items */}
      {!error &&
        books.length > 0 &&
        books.map((book, index) => (
          <Box
            key={book._id || index}
            className="flex py-3 px-4 text-sm items-center hover:bg-gray-50 mt-1 bg-br-white"
          >
            <div className="w-3/12 truncate">{book.title}</div>
            <div className="w-1/12 truncate">{book.author}</div>
            <div className="w-2/12 truncate">{book.ISBN}</div>
            <div className="w-1/12">{book.rating || 0}</div>
            <div className="w-1/12">{book.language?.LanguageName}</div>
            <div className="w-2/12">{book.category?.CategoryName}</div>
            <div className="w-1/12">
              <span
                className={`px-2 py-1 text-xs rounded-full ${
                  book.IsAvailable ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                }`}
              >
                {book.IsAvailable ? "Available" : "Not Available"}
              </span>
            </div>
            <div className="w-1/12">
              <span
                className={`px-2 py-1 text-xs rounded-full ${
                  book.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                }`}
              >
                {book.isActive ? "Active" : "Deactivated"} 
              </span>
            </div>
            <div className="w-1/12 justify-end flex gap-2">
              <button onClick={() => onEdit(book)}>
                <MdOutlineEdit className="p-2 bg-br-blue-medium cursor-pointer text-white rounded-lg" size={30} />
              </button>
            </div>
          </Box>
        ))}
    </>
  );
};

export default BookList;
