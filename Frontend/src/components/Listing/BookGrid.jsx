import React, { useEffect, useState } from "react";
import axios from "axios";
import BookCard from './BookCard'
import { useSelector } from "react-redux";
import { Skeleton } from "@mui/material";
import { useCookies } from "react-cookie";
import Pagination from "../../components/Pagination/Pagination";
import { fetchBookList, getBookCoverUrl } from '../../services/bookService';

function BookGrid({ searchQuery, filters, sortOptions }) {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [cookies] = useCookies(['token']);
  const { clubId, role } = useSelector((state) => state.clubSession);
  const resultsPerPage = 10;

  const refreshBooks = () => {
    fetchBooks();
  };

  async function fetchBooks() {
    try {
      if (!clubId) {
        return;
      }

      const data = await fetchBookList({
        clubId,
        token: cookies.token,
        currentPage,
        resultsPerPage,
        searchQuery,
        filters,
        role,
        sortOptions
      });

      if (data.success) {
        setTotalCount(data.total);

        if (searchQuery && data.total === 0) {
          setBooks([]);
          setError("No books found matching your search");
          return;
        }

        if (data.total === 0) {
          setBooks([]);
          setError("No books found in this club. Start adding books to build your collection!");
          return;
        }

        if (data.books?.length) {
          const booksWithCovers = await Promise.all(
            data.books.map(async (book) => {
              const coverUrl = await getBookCoverUrl(book.ISBN);
              return { ...book, coverUrl };
            })
          );
          setBooks(booksWithCovers);
          setError(null);
        }
      } else {
        setError(data.message || "Failed to fetch books");
      }
      setLoading(false);
    } catch (error) {
      setError("Error fetching books");
      console.error(error);
    }
  }

  useEffect(() => {
    if (clubId) {
      fetchBooks();
    }
    setLoading(true);
  }, [clubId, currentPage, searchQuery, filters, sortOptions]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  if (error) return <div className="text-center py-8">Error: {error}</div>;

  return (
    <div className="w-full h-full bg-br-blue-light flex flex-col space-y-1">
      <div className="grid auto-rows-[410px] min-h-[901px] md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 2xl:grid-cols-5 gap-4 px-4 py-8 w-full bg-white rounded-tr-[var(--br-radius)]">
        {loading ? (
          // Skeleton loader when loading is true
          [...Array(resultsPerPage)].map((_, i) => (
            <div className="p-4 rounded-xl border border-br-gray-light shadow-sm w-full bg-white" style={{ minHeight: "410px" }}>
              {/* Image placeholder */}
              <Skeleton variant="rectangular" height={210} className="w-full rounded-md" />

              {/* Title */}
              <Skeleton variant="text" height={28} width="80%" className="mt-4" />

              {/* Author */}
              <Skeleton variant="text" height={20} width="60%" />

              {/* Rating */}
              <Skeleton variant="text" height={20} width="40%" />

              {/* Button */}
              <Skeleton variant="rectangular" height={36} className="mt-4 rounded-md w-full" />
            </div>
          ))
        ) : error ? (
          <div className="col-span-5 text-center py-8">
            <p className="text-gray-500 text-lg">{error}</p>
            {totalCount === 0 && !searchQuery && (
              <button className="mt-4 px-6 py-2 bg-br-blue text-white rounded-lg hover:bg-br-blue-dark">
                Add Your First Book
              </button>
            )}
          </div>
        ) : (
          books.map((book) => (
            <BookCard
              key={book.id}
              id={book.id}
              title={book.title}
              author={book.author}
              category={book.category.CategoryName}
              language={book.language.LanguageName}
              coverUrl={book.coverUrl}
              isAvailable={book.IsAvailable}
              rating={111}
              isActive={book.isActive}
              onStatusChange={refreshBooks}
            />
          ))
        )}
      </div>

      {totalCount > 0 && (
        <Pagination
          currentPage={currentPage}
          totalResults={totalCount}
          onPageChange={handlePageChange}
          styling="rounded-br-[var(--br-radius)]"
        />
      )}
    </div>

  );
}

export default BookGrid;
