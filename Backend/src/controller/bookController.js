import jwt from "../jwt/jwt.js";
import book from "../models/book.js";
import category from "../models/category.js";
import language from "../models/language.js";
import { Op, Sequelize } from 'sequelize';
import user from '../models/user.js';
import club from '../models/club.js';
import clubuser from '../models/clubuser.js';
import transaction from '../models/transaction.js';

const booklist = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const search = req.query.search || '';
    const status = req.query.status || 'all';
    const categories = req.query.categories ? JSON.parse(req.query.categories) : [];
    const languages = req.query.languages ? JSON.parse(req.query.languages) : [];
    const clubId = parseInt(req.query.clubId);
    const role = req.query.role;
    const sortField = req.query.sortField || 'title';
    const sortOrder = req.query.sortOrder || 'ASC';

    const allowedSortFields = ['title', 'createdAt', 'IsAvailable'];
    const allowedSortOrders = ['ASC', 'DESC'];


    if (!allowedSortFields.includes(sortField)) {
      return res.status(400).json({
        success: false,
        message: "Invalid sort field"
      });
    }

    if (!allowedSortOrders.includes(sortOrder)) {
      return res.status(400).json({
        success: false,
        message: "Invalid sort order"
      });
    }
    let whereClause = {
      ...(search.trim() !== '' && {
        [Op.or]: [
          { title: { [Op.iLike]: `%${search}%` } },
          { author: { [Op.iLike]: `%${search}%` } }
        ]
      }),
      ...(status !== 'all' && {
        IsAvailable: status === 'available'
      }),
      ...(categories.length > 0 && {
        categoryId: {
          [Op.in]: categories
        }
      }),
      ...(languages.length > 0 && {
        languageId: {
          [Op.in]: languages
        }
      }),
    };

    if (role != 0) {
      if (!clubId) {
        return res.status(400).json({
          success: false,
          message: "Club ID is required"
        });
      }
      whereClause = {
        ...whereClause,
        clubId: clubId
      };
    }

    if (role == 2) {
      whereClause.isActive = true;
    }

    const { count, rows: books } = await book.findAndCountAll({
      where: whereClause,
      attributes: ['id', 'userId', 'title', 'ISBN', 'author', 'IsAvailable', 'createdAt', 'isActive'],
      include: [
        {
          model: category,
          attributes: ['CategoryName']
        },
        {
          model: language,
          attributes: ['LanguageName']
        }
      ],
      order: [[sortField, sortOrder]],
      offset: offset,
      limit: limit
    });

    return res.status(200).json({
      success: true,
      total: count,
      page: page,
      limit: limit,
      sortField: sortField,
      sortOrder: sortOrder,
      books: books
    });

  } catch (error) {
    console.error('Error fetching book details:', error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
};

const addBooks = async (req, res) => {
  try {
    const { title, author, ISBN, clubId, token, categoryId, languageId } = req.body;

    if (!title || !author || !ISBN || !clubId || !token || !categoryId || !languageId) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    const userId = jwt.getUserIdFromToken(token);


    const newBook = await book.create({
      title: title,
      author: author,
      ISBN: ISBN,
      clubId: clubId,
      userId: userId,
      categoryId: categoryId,
      languageId: languageId,
      IsAvailable: true
    });

    if (newBook) {
      return res.status(201).json({
        success: true,
        message: "Book added successfully",
        book: newBook
      });
    }
  } catch (error) {
    console.error('Error adding book:', error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
}

const getDashboardStats = async (req, res) => {
  try {
    const { token, userRole } = req.body;

    if (!token || userRole == undefined) {
      return res.status(400).json({
        success: false,
        message: "Token or User role is required"
      });
    }

    const userId = jwt.getUserIdFromToken(token);

    // Super Admin Statistics
    if (userRole == 0) {
      const totalUsers = await user.count();
      const totalBooks = await book.count();
      const totalClubs = await club.count();

      return res.status(200).json({
        success: true,
        data: {
          totalUsers,
          totalBooks,
          totalClubs
        }
      });
    }
    // Club Admin Statistics
    else if (userRole == 1) {
      const clubData = await clubuser.findOne({
        where: { userId: userId }
      });

      if (!clubData) {
        return res.status(404).json({
          success: false,
          message: "Club not found"
        });
      }

      const clubId = clubData.clubId;

      const totalMembers = await clubuser.count({
        where: { clubId: clubId }
      });

      const totalBooks = await book.count({
        where: { clubId: clubId }
      });

      const totalTransactions = await transaction.count({
        where: { clubId: clubId }
      });

      return res.status(200).json({
        success: true,
        data: {
          totalMembers,
          totalBooks,
          totalTransactions
        }
      });
    } else {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access"
      });
    }

  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
};



const myBooks = async (req, res) => {
  try {
    const clubId = req.body.clubId;
    const token = req.body.token;
    const page = parseInt(req.body.page) || 1;
    const limit = parseInt(req.body.limit) || 10;
    const offset = (page - 1) * limit;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Token is required"
      });
    }

    const userId = jwt.getUserIdFromToken(token);

    // Get total count for pagination
    const totalCount = await book.count({
      where: {
        userId: userId,
        clubId: clubId
      }
    });

    const fetchBooks = await book.findAll({
      where: {
        userId: userId,
        clubId: clubId
      },
      attributes: ['id', 'userId', 'title', 'ISBN', 'author', 'IsAvailable', 'createdAt', 'isActive'],
      include: [
        {
          model: category,
          attributes: ['id', 'CategoryName']
        },
        {
          model: language,
          attributes: ['id', 'LanguageName']
        }
      ],
      limit: limit,
      offset: offset,
      order: [['createdAt', 'DESC']] // Default sorting by newest first
    });

    const response = {
      success: true,
      message: "Books fetched successfully",
      books: fetchBooks,
      total: totalCount,
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit)
    };
    return res.status(200).json(response);

  } catch (error) {
    console.error('Error fetching my books:', error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
}

// For activating or deactivating a book
export const toggleBookStatus = async (req, res) => {
  try {
    const {bookId, userRole, clubId, isActive} = req.body; 
    console.log('toggleBookStatus called with:', req.body);

     if (typeof isActive != 'boolean') {
      return res.status(400).json({
        success: false,
        message: "Invalid or missing 'isActive' value in request body (must be true or false)."
      });
    }

    // Allow only Super Admin (role 0) or Club Admin (role 1)
    if (userRole != 0 && userRole != 1) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized: Only Super Admins or Club Admins can deactivate books."
      });
    }

    // Find the book
    const bookToDeactivate = await book.findOne({ where: { id: bookId } });

    if (!bookToDeactivate) {
      return res.status(404).json({
        success: false,
        message: "Book not found."
      });
    }

    if (userRole == 1 && clubId && bookToDeactivate.clubId != parseInt(clubId)) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized: Book does not belong to your club."
      });
    }

    // Prevent deactivation if book is in active borrow stages
    if (!isActive) { 
      const activeBorrow = await transaction.findOne({
        where: {
          bookId,
          status: { [Op.in]: ['2', '4', '5', '6'] }
        }
      });

      if (activeBorrow) {
        return res.status(400).json({
          success: false,
          message: "Cannot Deactivate: Book is currently in an active borrow cycle."
        });
      }

      // Cancel all pending requests
      await transaction.update(
        { status: '3' }, 
        {
          where: {
            bookId,
            status: '1' 
          }
        }
      );
    }

    await book.update(
      { isActive: isActive },
      { where: { id: bookId } }
    );

    return res.status(200).json({
      success: true,
      message: `Book ${isActive ? 'reactivated' : 'deactivated'} successfully.`
    });

  } catch (error) {
    console.error('Error updating book status:', error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
};

export const updateBook = async (req, res) => {
  const {
    token,
    bookId,
    title,
    author,
    ISBN,
    languageId,
    categoryId,
    clubId,
  } = req.body;

  if (!token || !bookId || !title || !author || !languageId || !categoryId || !clubId) {
    return res.status(400).json({ success: false, message: "Missing required fields" });
  }

  try {
    const userId = jwt.getUserIdFromToken(token);

    const User = await user.findByPk(userId);

    if (!User) {
      return res.status(401).json({ success: false, message: "Invalid user" });
    }

    const [updatedRows] = await book.update(
      {
        title,
        author,
        ISBN,
        languageId,
        categoryId,
      },
      {
        where: {
          id: bookId,
          clubId: clubId,
        },
      }
    );

    if (updatedRows === 0) {
      return res.status(404).json({ success: false, message: "Book not found or no changes made" });
    }

    return res.status(200).json({ success: true, message: "Book updated successfully" });
  } catch (error) {
    console.error("Error in updateBook:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export default { booklist, addBooks, myBooks, getDashboardStats, toggleBookStatus, updateBook };