import { Op } from "sequelize";
import book from "../models/book.js";
import transaction from "../models/transaction.js";
import jwt from "../jwt/jwt.js";
import category from "../models/category.js";
import language from "../models/language.js";
import location from "../models/location.js"

const TransactionController = {
    borrowRequest: async (req, res) => {
        try {

            const { bookId, clubId, token } = req.body;
            const borrowerId = jwt.getUserIdFromToken(token);

            if (!borrowerId) {
                console.log("Error in authenticating User");
                return res.status(403).json({
                    success: false,
                    message: "Access forbidden"
                })
            }


            if (!bookId || !borrowerId) {
                return res.status(400).json({
                    success: false,
                    message: "Book ID and User ID are required"
                });
            }

            const checkbook = await book.findOne({
                where: {
                    id: bookId,
                }
            });
            // console.log("Checkbook", checkbook);

            if (!checkbook) {
                return res.status(404).json({
                    success: false,
                    message: "Book not available"
                });
            }

            const alreadyRequested = await transaction.findOne({
                where: {
                    bookId: bookId,
                    borrowerId: borrowerId,
                    status: {
                        [Op.in]: ['1', '2', '4', '5', '6']
                    }
                }
            });

            if (alreadyRequested) {
                return res.status(400).json({
                    success: false,
                    message: "You have already requested this book"
                });
            }

            // Transaction when the book is at the owner.
            if (checkbook.IsAvailable === true && checkbook.locationId == null) {

                const NewTransaction = await transaction.create({
                    bookId: checkbook.id,
                    lenderId: checkbook.userId,
                    borrowerId: borrowerId,
                    clubId: clubId,
                    status: 1,
                    RequestDate: await new Date()
                })

                if (!NewTransaction) {
                    console.error('Error creating transaction');
                    return res.status(500).json({
                        success: false,
                        message: "Internal Server Error"
                    });
                } else {
                    res.status(200).json({
                        success: true,
                        message: "Borrow request sent successfully",
                        transaction: NewTransaction
                    });
                }
            }
            // Transaction when the book is at the club.
            else if (checkbook.IsAvailable === true && checkbook.locationId != null) {
                // Transaction when the book is at the club.
                const NewTransaction = await transaction.create({
                    bookId: checkbook.id,
                    lenderId: checkbook.userId,
                    borrowerId: borrowerId,
                    clubId: clubId,
                    status: 4,
                    RequestDate: new Date()
                })

                if (!NewTransaction) {
                    console.error('Error creating transaction');
                    return res.status(500).json({
                        success: false,
                        message: "Internal Server Error"
                    });
                } else {
                    res.status(200).json({
                        success: true,
                        message: "Borrow request sent successfully",
                        transaction: NewTransaction
                    });
                }

            } else if (checkbook.IsAvailable === false && checkbook.locationId == null) {
                // Transaction when the book is borrowed by someone else.

                const PreviousTransaction = await transaction.findOne({
                    where: {
                        bookId: bookId,
                        status: {
                            [Op.in]: ['2', '4', '5']
                        }
                    }
                });

                if (!PreviousTransaction) {
                    return res.status(404).json({
                        success: false,
                        message: "Transaction not found"
                    });
                }


                const NewTransaction = await transaction.create({
                    bookId: checkbook.id,
                    lenderId: PreviousTransaction.borrowerId,
                    borrowerId: borrowerId,
                    clubId: clubId,
                    status: 1,
                    RequestDate: new Date()
                })

                if (!NewTransaction) {
                    console.error('Error creating transaction');
                    return res.status(500).json({
                        success: false,
                        message: "Internal Server Error"
                    });
                } else {
                    res.status(200).json({
                        success: true,
                        message: "Borrow request sent successfully",
                        transaction: NewTransaction
                    });
                }

            }


        } catch (error) {
            console.error('Error processing borrow request: ', error);
            res.status(500).json({
                success: false,
                message: "Internal Server Error"
            });
        }
    },


    RequestApproval: async (req, res) => {
        try {
            const { transactionId, token } = req.body;

            const userId = jwt.getUserIdFromToken(token);
            if (!userId) {
                console.log("Error in authenticating User");
                return res.status(403).json({
                    success: false,
                    message: "Access forbidden"
                })
            }


            if (!transactionId) {
                return res.status(400).json({
                    success: false,
                    message: "Transaction ID and status are required"
                });
            }



            const transactionToUpdate = await transaction.findOne({
                where: {
                    id: transactionId
                }
            });

            if (!transactionToUpdate) {
                return res.status(404).json({
                    success: false,
                    message: "Transaction not found"
                });
            }

            // Check if the user is the lender of the transaction
            if (transactionToUpdate.lenderId !== userId) {
                return res.status(403).json({
                    success: false,
                    message: "You are not authorized to approve this transaction"
                });
            }
            const fetchBook = await book.findOne({
                where: {
                    id: transactionToUpdate.bookId
                }
            })

            if (!fetchBook) {
                console.log("cannot fetch the book you want to approve");
                res.status(500).json({
                    success: false,
                    message: "Internal Server Error"
                })
            }


            const PreviousTransaction = await transaction.findOne({
                where: {
                    bookId: transactionToUpdate.bookId,
                    borrowerId: transactionToUpdate.lenderId,
                    status: {
                        [Op.in]: ['2', '4']
                    }
                }
            });
            console.log("Previous Transaction", PreviousTransaction);
            if (PreviousTransaction) {
                console.log("The book is not picked yet");
                return res.status(400).json({
                    success: false,
                    message: "The book is not picked yet"
                });
            }



            fetchBook.IsAvailable = false;
            fetchBook.locationId = null;

            // Update the book's availability status

            transactionToUpdate.status = 2;

            const updatedTransaction = await transactionToUpdate.save();
            const updatedBook = await fetchBook.save();



            if (updatedTransaction && updatedBook) {
                const otherRequests = await transaction.findAll({
                    where: {
                        bookId: transactionToUpdate.bookId,
                        lenderId: transactionToUpdate.lenderId,
                        RequestDate: {
                            [Op.gt]: transactionToUpdate.RequestDate // Requests with a newer RequestDate
                        },
                        status: '1'
                    }
                });

                // Update lenderId of these requests to the borrowerId of the approved transaction
                for (let request of otherRequests) {
                    request.lenderId = transactionToUpdate.borrowerId;
                    await request.save();
                }

                res.status(200).json({
                    success: true,
                    message: "Transaction status updated successfully",
                    transaction: updatedTransaction
                });
            } else {
                res.status(500).json({
                    success: false,
                    message: "Internal Server Error"
                });
            }
        } catch (error) {
            console.error('Error updating transaction status:', error);
            res.status(500).json({
                success: false,
                message: "Internal Server Error"
            });
        }
    },


    BookDropped: async (req, res) => {
        try {
            const { transactionId, token } = req.body;
            const userId = jwt.getUserIdFromToken(token);
            if (!userId) {
                console.log("Error in authenticating User");
                return res.status(403).json({
                    success: false,
                    message: "Access forbidden"
                })
            }
            if (!transactionId) {
                return res.status(400).json({
                    success: false,
                    message: "Transaction ID and status are required"
                });
            }

            const transactionToUpdate = await transaction.findOne({
                where: {
                    id: transactionId
                }
            });

            // Check if the user is the lender of the transaction
            if (transactionToUpdate.lenderId !== userId) {
                return res.status(403).json({
                    success: false,
                    message: "You are not authorized to approve this transaction"
                });
            }

            const locationinfo = await location.findOne({
                where: {
                    clubId: transactionToUpdate.clubId
                }
            })

            const bookinfo = await book.findOne({
                where: {
                    id: transactionToUpdate.bookId
                }
            })

            if (!locationinfo || !bookinfo) {
                console.log("Cannot find the location or book");
                return res.status(500).json({
                    success: false,
                    message: "Internal Server Error"
                });
            }

            const PreviousTransaction = await transaction.findOne({
                where: {
                    bookId: transactionToUpdate.bookId,
                    borrowerId: transactionToUpdate.lenderId,
                    status: {
                        [Op.in]: ['5']
                    }
                }
            });

            // console.log("previous Transaction", PreviousTransaction)

            bookinfo.locationId = locationinfo.id; // setting the book location to central location of the club
            transactionToUpdate.status = 4;

            const updatedTransaction = await transactionToUpdate.save();
            const updatedBook = await bookinfo.save();

            if (updatedTransaction && updatedBook) {

                if (PreviousTransaction) {
                    PreviousTransaction.status = 7;
                    await PreviousTransaction.save();
                }

                res.status(200).json({
                    success: true,
                    message: "Transaction status updated successfully",
                    transaction: updatedTransaction
                });
            } else {
                res.status(500).json({
                    success: false,
                    message: "Internal Server Error"
                });
            }

        } catch (error) {
            console.error('Error updating transaction status:', error);
            res.status(500).json({
                success: false,
                message: "Internal Server Error"
            });
        }
    },

    BookPicked: async (req, res) => {
        try {
            const { transactionId, token } = req.body;

            const userId = jwt.getUserIdFromToken(token);
            if (!userId) {
                console.log("Error in authenticating User");
                return res.status(403).json({
                    success: false,
                    message: "Access forbidden"
                })
            }
            if (!transactionId) {
                return res.status(400).json({
                    success: false,
                    message: "Transaction ID and status are required"
                });
            }
            const transactionToUpdate = await transaction.findOne({
                where: {
                    id: transactionId
                }
            });
            // Check if the user is the lender of the transaction
            if (transactionToUpdate.borrowerId !== userId) {
                return res.status(403).json({
                    success: false,
                    message: "You are not authorized to approve this transaction"
                });
            }

            const bookinfo = await book.findOne({
                where: {
                    id: transactionToUpdate.bookId
                }
            })
            if (!bookinfo) {
                console.log("Cannot find the book");
                return res.status(500).json({
                    success: false,
                    message: "Internal Server Error"
                });
            }

            bookinfo.locationId = null; // setting the book location to null
            bookinfo.IsAvailable = false; // setting the book location to null

            transactionToUpdate.status = 5; // Assuming 5 is the status for Book Picked
            transactionToUpdate.pickupDate = new Date();

            const updatedTransaction = await transactionToUpdate.save();
            const updatedBook = await bookinfo.save();

            if (updatedTransaction && updatedBook) {
                res.status(200).json({
                    success: true,
                    message: "Transaction status updated successfully",
                    transaction: updatedTransaction
                });
            } else {
                res.status(500).json({
                    success: false,
                    message: "Internal Server Error"
                });
            }

        } catch (error) {
            console.log("Error in updating transaction status", error);
            res.status(500).json({
                success: false,
                message: "Internal Server Error"
            });
        }
    },

    getBorrowedBooks: async (req, res) => {
        try {
            const { token, page = 1, limit = 10 } = req.body;

            // console.log(token)
            const userId = jwt.getUserIdFromToken(token);

            if (!userId) {
                console.log("Error in authenticating User");
                return res.status(403).json({
                    success: false,
                    message: "Access Forbidden"
                })
            }
            // console.log("user Id ", userId);

            const total = await transaction.count({
                where: {
                    borrowerId: userId,
                    status: {
                        [Op.in]: ['5', '6']
                    }
                }
            });

            // Pagination calculation
            const offset = (parseInt(page) - 1) * parseInt(limit);


            const BorrowedBookList = await transaction.findAll({
                where: {
                    borrowerId: userId,
                    status: {
                        [Op.in]: ['5', '6']
                    }
                }, include: [
                    {
                        model: book,
                        as: 'book'
                    }
                ],
                limit: limit,
                offset: offset,
                order: [['createdAt', 'DESC']]
            });

            if (!BorrowedBookList) {
                console.log('cannot fetch the borrowed book list');
                return res.status(500).json({
                    success: false,
                    message: "Internal Server Error"
                });
            }

            return res.status(200).json({
                success: true,
                list: BorrowedBookList,
                total,
                currentPage: page,
                totalPages: Math.ceil(total / limit)
            })

        } catch (error) {
            console.log("Errror in the borrowed book list section", error);
            res.status(500).json({
                success: false,
                message: "Internal Server Error"
            });
        }
    },

    getBorrowingTransactionList: async (req, res) => {
        try {
            const { token, page = 1, limit = 10 } = req.body;

            // console.log(token)
            const userId = jwt.getUserIdFromToken(token);

            if (!userId) {
                console.log("Error in authenticating User");
                return res.status(403).json({
                    success: false,
                    message: "Access Forbidden"
                })
            }
            // console.log("user Id ", userId);

            const total = await transaction.count({
                where: {
                    borrowerId: userId,
                    status: {
                        [Op.in]: ['1', '2', '4']
                    }
                }
            });

            const offset = (parseInt(page) - 1) * parseInt(limit);


            const BorrowedBookList = await transaction.findAll({
                where: {
                    borrowerId: userId,
                    status: {
                        [Op.in]: ['1', '2', '4']
                    }
                }, include: [
                    {
                        model: book,
                        as: 'book',
                        include: [
                            {
                                model: category,
                                as: 'category',
                                attributes: ['id', 'CategoryName']
                            },
                            {
                                model: language,
                                as: 'language',
                                attributes: ['id', 'LanguageName']
                            },
                            {
                                model: location,
                                as: 'location',
                                attributes: ['id', 'location']
                            }
                        ]
                    }
                ],
                limit: parseInt(limit),
                offset: offset,
                order: [['createdAt', 'DESC']]
            });

            if (!BorrowedBookList) {
                console.log('cannot fetch the borrowed book list');
                return res.status(500).json({
                    success: false,
                    message: "Internal Server Error"
                });
            }

            return res.status(200).json({
                success: true,
                list: BorrowedBookList,
                total,
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / limit)
            })

        } catch (error) {
            console.log("Errror in the borrowed book list section", error);
            res.status(500).json({
                success: false,
                message: "Internal Server Error"
            });
        }
    },

    getLendingTransactionList: async (req, res) => {
        try {
            const { token, page = 1, limit = 10 } = req.body;

            // console.log(token)
            const userId = jwt.getUserIdFromToken(token);

            if (!userId) {
                console.log("Error in authenticating User");
                return res.status(403).json({
                    success: false,
                    message: "Access Forbidden"
                })
            }
            // console.log("user Id ", userId);

            const total = await transaction.count({
                where: {
                    lenderId: userId,
                    status: {
                        [Op.in]: ['1', '2']
                    }
                }
            });

            const offset = (parseInt(page) - 1) * parseInt(limit);


            const LendedBookList = await transaction.findAll({
                where: {
                    lenderId: userId,
                    status: {
                        [Op.in]: ['1', '2']
                    }
                }, include: [
                    {
                        model: book,
                        as: 'book',
                        include: [
                            {
                                model: category,
                                as: 'category',
                                attributes: ['id', 'CategoryName']
                            },
                            {
                                model: language,
                                as: 'language',
                                attributes: ['id', 'LanguageName']
                            }
                        ]
                    }
                ],
                order: [['RequestDate', 'ASC']],
                limit: parseInt(limit),
                offset: offset
            });

            if (!LendedBookList) {
                console.log('cannot fetch the lended book list');
                return res.status(500).json({
                    success: false,
                    message: "Internal Server Error"
                });
            }

            const oldestRequest = [];
            const seenBooks = new Set();

            LendedBookList.forEach(transaction => {
                const bookId = transaction.book.id;
                if (!seenBooks.has(bookId)) {
                    seenBooks.add(bookId);
                    oldestRequest.push(transaction);
                }
            });

            return res.status(200).json({
                success: true,
                list: oldestRequest,
                total,
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / limit)
            })

        } catch (error) {
            console.log("Errror in the borrowed book list section", error);
            res.status(500).json({
                success: false,
                message: "Internal Server Error"
            });
        }
    },


    getBorrowingHistory: async (req, res) => {
        try {
            const { token, page = 1, limit = 10 } = req.body;

            const userId = jwt.getUserIdFromToken(token);

            if (!userId) {
                console.log("Error in Authenticating User");
                return res.status(403).json({
                    success: false,
                    message: "Access Forbidden"
                })
            }

            const total = await transaction.count({
                where: {
                    borrowerId: userId,
                    status: '7'
                }
            });

            const offset = (page - 1) * limit;


            const borrowingHistory = await transaction.findAll({
                where: {
                    borrowerId: userId,
                    status: '7'
                }, include: [
                    {
                        model: book,
                        as: 'book',
                        include: [
                            {
                                model: category,
                                as: 'category',
                                attributes: ['id', 'CategoryName']
                            },
                            {
                                model: language,
                                as: 'language',
                                attributes: ['id', 'LanguageName']
                            }
                        ]
                    }
                ],
                limit: parseInt(limit),
                offset: offset,
                order: [['createdAt', 'DESC']]
            });

            if (!borrowingHistory) {
                console.log('cannot fetch the borrowing History');
                return res.status(500).json({
                    succes: false,
                    message: "Internal Server Error"
                });
            }

            return res.status(200).json({
                success: true,
                list: borrowingHistory,
                total,
                currentPage: page,
                totalPages: Math.ceil(total / limit)
            })

        } catch (error) {
            console.log("Error in fetching the borrowing History", error);
            res.status(500).json({
                success: false,
                message: "Internal Server Error"
            });
        }
    },

    requestcancel: async (req, res) => {
        try {
            const { transactionId, token } = req.body;
            const userId = jwt.getUserIdFromToken(token);
            if (!userId) {
                console.log("Error in authenticating User");
                return res.status(403).json({
                    success: false,
                    message: "Access forbidden"
                })
            }
            if (!transactionId) {
                return res.status(400).json({
                    success: false,
                    message: "Transaction ID are required"
                });
            }
            const transactionToUpdate = await transaction.findOne({
                where: {
                    id: transactionId
                }
            });
            // Check if the user is the borrower of the transaction
            if (transactionToUpdate.borrowerId !== userId) {

                return res.status(403).json({
                    success: false,
                    message: "You are not authorized to cancel this transaction"
                });
            }
            transactionToUpdate.status = 3; // Assuming 3 is the status for cancelled
            const updatedTransaction = await transactionToUpdate.save();
            if (updatedTransaction) {
                res.status(200).json({
                    success: true,
                    message: "Transaction status updated successfully",
                    transaction: updatedTransaction
                });
            } else {
                res.status(500).json({
                    success: false,
                    message: "Internal Server Error"
                });
            }
        } catch (error) {
            console.log("Error in updating transaction status", error);
            res.status(500).json({
                success: false,
                message: "Internal Server Error"
            });
        }
    },

    initiateReturnBook: async (req, res) => {
        try {
            const { transactionId, token } = req.body;
            const userId = jwt.getUserIdFromToken(token);
            if (!userId) {
                console.log("Error in authenticating User");
                return res.status(403).json({
                    success: false,
                    message: "Access forbidden"
                })
            }
            if (!transactionId) {
                return res.status(400).json({
                    success: false,
                    message: "Transaction ID and status are required"
                });
            }
            const transactionToUpdate = await transaction.findOne({
                where: {
                    id: transactionId
                }
            });
            // Check if the user is the lender of the transaction
            if (transactionToUpdate.borrowerId !== userId) {
                return res.status(403).json({
                    success: false,
                    message: "You are not authorized to approve this transaction"
                });
            }

            transactionToUpdate.status = 6; // Assuming 6 is the status for Book Return initiated

            const updatedTransaction = await transactionToUpdate.save();

            if (updatedTransaction) {
                res.status(200).json({
                    success: true,
                    message: "Transaction status updated successfully",
                    transaction: updatedTransaction
                });
            } else {
                res.status(500).json({
                    success: false,
                    message: "Internal Server Error"
                });
            }

        } catch (error) {
            console.log("Error in updating transaction status", error);
            res.status(500).json({
                success: false,
                message: "Internal Server Error"
            });
        }
    },




    returnBook: async (req, res) => {
        try {
            const { transactionId, token } = req.body;

            const userId = jwt.getUserIdFromToken(token);
            if (!userId) {
                console.log("Error in authenticating User");
                return res.status(403).json({
                    success: false,
                    message: "Access forbidden"
                })
            }
            if (!transactionId) {
                return res.status(400).json({
                    success: false,
                    message: "Transaction ID and status are required"
                });
            }

            const transactionToUpdate = await transaction.findOne({
                where: {
                    id: transactionId
                }
            });

            // Check if the user is the Borrower of the transaction
            if (transactionToUpdate.borrowerId !== userId) {
                return res.status(403).json({
                    success: false,
                    message: "You are not authorized to approve this transaction"
                });
            }

            const bookinfo = await book.findOne({
                where: {
                    id: transactionToUpdate.bookId
                }
            })
            if (!bookinfo) {
                console.log("Cannot find the book");
                return res.status(500).json({
                    success: false,
                    message: "Internal Server Error"
                });
            }

            const locationinfo = await location.findOne({
                where: {
                    clubId: transactionToUpdate.clubId
                }
            })
            if (!locationinfo) {
                console.log("Cannot find the location");
                return res.status(500).json({
                    success: false,
                    message: "Internal Server Error"
                });
            }


            // Fetch all pending requests for this book where the current user is the lender
            const pendingRequests = await transaction.findAll({
                where: {
                    bookId: bookinfo.id,
                    lenderId: userId,
                    status: {
                        [Op.in]: ['1', '2', '4'] // Pending, Approved, or Book Dropped
                    } // Requested
                },
                order: [['RequestDate', 'ASC']] // Oldest first
            });

            if (pendingRequests.length > 0) {
                const oldestRequest = pendingRequests[0];

                // Update the oldest request
                oldestRequest.status = 4; // Dropped at central location
                await oldestRequest.save();

                // Update book info
                bookinfo.locationId = locationinfo.id;
                bookinfo.IsAvailable = false;
                await bookinfo.save();

                // Update all other requests
                const otherRequests = pendingRequests.slice(1);
                for (const req of otherRequests) {
                    req.lenderId = oldestRequest.borrowerId;
                    await req.save();
                }

            } else {
                // No requests – return to central location and mark as available
                bookinfo.locationId = locationinfo.id;
                bookinfo.IsAvailable = true;
                await bookinfo.save();
            }

            // Finalize the return
            transactionToUpdate.status = 7; // Returned
            transactionToUpdate.returnDate = new Date();
            await transactionToUpdate.save();

            res.status(200).json({
                success: true,
                message: "Transaction status updated successfully",
                transaction: transactionToUpdate
            });


        } catch (error) {
            console.log("Error in updating transaction status", error);
            res.status(500).json({
                success: false,
                message: "Internal Server Error"
            });
        }
    },



}




export default TransactionController;