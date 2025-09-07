import axios from "axios";

export const fetchUserBooks = async ({ token, clubId, page = 1, limit = 10 }) => {
  try {
    const { data } = await axios.post(`http://localhost:3000/api/v1/book/mybooks`, {
      token,
      clubId,
      page,
      limit
    });
    
    return {
      data: {
        success: true,
        books: data.books || [],
        total: data.total || 0,
        currentPage: page,
        totalPages: Math.ceil((data.total || 0) / limit)
      }
    };
  } catch (error) {
    console.error('Error fetching user books:', error);
    throw new Error(error.response?.data?.message || "Failed to fetch user books");
  }
};

export const addBooks = async ({
    title,
    author,
    ISBN,
    languageId,
    categoryId, 
    token,
    clubId
  }) => {
    try {
      const { data } = await axios.post(`http://localhost:3000/api/v1/book/addbook`, {
        title,
        author,
        ISBN,
        languageId ,
        categoryId ,
        token,
        clubId
      });
      return data;
    } catch (error) {
      console.error(error);
      throw new Error("Failed to add book");
    }
  };

export const updateBookStatus = async ({ bookId, isActive, role, clubId }) => {
  try {
    const { data } = await axios.post(`http://localhost:3000/api/v1/book/deactivateBook`, {
      bookId,
      isActive: !isActive, // Toggle current status
      userRole: role, 
      clubId
    });
    return data;
  } catch (error) {
    console.error('Error updating book status:', error);
    throw new Error(error.response?.data?.message || "Failed to update book status");
  }
};

// for requesting a book
export const requestBook = async ({ bookId, clubId, token }) => {
  try {
    const { data } = await axios.post(`http://localhost:3000/api/v1/transaction/request`, {
      bookId,
      clubId,
      token
    });
    return data;
  } catch (error) {
    console.error('Error requesting book:', error);
    throw new Error(error.response?.data?.message || "Failed to request book");
  }
};
  
export const fetchBookList = async ({
  clubId,
  token,
  currentPage,
  resultsPerPage,
  searchQuery,
  filters,
  role,
  sortOptions
}) => {
  try {
    const response = await axios.get(
      `http://localhost:3000/api/v1/book/booklist/${clubId}`,
      {
        params: {
          page: currentPage,
          limit: resultsPerPage,
          search: searchQuery,
          status: filters.status,
          role: role,
          clubId: clubId,
          categories: JSON.stringify(filters.categories),
          languages: JSON.stringify(filters.languages),
          sortField: sortOptions.field,
          sortOrder: sortOptions.order,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching books:', error);
    throw new Error(error.response?.data?.message || "Failed to fetch books");
  }
};

// Cover URL fetching service
export const getBookCoverUrl = async (isbn) => {
  if (!isbn) return null;
  
  try {
    const cleanIsbn = isbn.replace(/-/g, "");
    const response = await axios.get(
      `https://www.googleapis.com/books/v1/volumes?q=isbn:${cleanIsbn}`
    );
    return response.data?.items?.[0]?.volumeInfo?.imageLinks?.thumbnail || null;
  } catch (error) {
    console.error("Error fetching cover:", error);
    return null;
  }
};

export const updateBook = async ({
  bookId,
  title,
  author,
  ISBN,
  languageId,
  categoryId,
  token,
  clubId
}) => {
  try {
    const { data } = await axios.post(`http://localhost:3000/api/v1/book/updatebook`, {
      bookId,
      title,
      author,
      ISBN,
      languageId,
      categoryId, 
      token,
      clubId
    }
  );
    return data;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to update book");
  }
};

export const fetchLanguages = async () => {
  try {
    const { data } = await axios.get("http://localhost:3000/api/v1/language/getalllanguage");
    if (data.success) {
      return data.languages.rows;
    }
    throw new Error(data.message || "Failed to fetch languages");
  } catch (error) {
    console.error('Error fetching languages:', error);
    throw new Error("Failed to fetch languages");
  }
};

export const fetchCategories = async () => {
  try {
    const { data } = await axios.get("http://localhost:3000/api/v1/category/getallcategory");
    if (data.success) {
      return data.categories.rows;
    }
    throw new Error(data.message || "Failed to fetch categories");
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw new Error("Failed to fetch categories");
  }
};