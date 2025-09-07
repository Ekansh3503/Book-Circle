import { Op, fn, col } from 'sequelize';
import sequelize from '../config/db.js';
import club from '../models/club.js';
import book from '../models/book.js';
import clubuser from '../models/clubuser.js';
import cloudinary from '../utils/cloudinary.js';


const createClub = async (req, res) => {
    try {
        const { club_name, club_contact_email, club_location } = req.body;

        const findClub = await club.findOne({
            where: {
                [Op.or]: [
                    { club_name: club_name },
                    { club_contact_email: club_contact_email }
                ]
            }
        });

        if (findClub) {
            return res.status(409).json({ success: false, message: "Club Details are already in use" })
        }

        const upload = await cloudinary.uploadBuffer(req.file.buffer, "bookcircle/club", club_name);
        const newClub = await club.create({
            club_name: club_name,
            club_contact_email: club_contact_email,
            club_thumbnail_url: upload.secure_url,
            club_status: "true",
            club_location: club_location,
        });

        if (!newClub) {
            return res.status(400).json({
                success: true,
                message: "failed to create the club",
            })
        }

        res.status(201).json({
            success: true,
            message: "Club Creation Successful"
        })
    } catch (error) {
        console.error('Club Creation Error: ', error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}

const updateClub = async (req, res) => {
    try {
        const { clubId, club_name, club_contact_email, club_location, thumbnail_url } = req.body;

        const findClub = await club.findOne({
            where: {
                id: clubId,
            }
        });

        if (!findClub) {
            return res.status(404).json({ success: false, message: "Club not found" });
        }

        const existingClub = await club.findOne({
            where: {
                [Op.or]: [
                    {
                        club_name: {
                            [Op.iLike]: club_name
                        }
                    },
                    { club_contact_email: {
                        [Op.iLike]: club_contact_email
                    } }
                ],
                id: { [Op.ne]: clubId }
            }
        });

        if (existingClub) {
            return res.status(409).json({ success: false, message: "Club Details are already in use" });
        }

        // Handle thumbnail URL logic
        let thumbnailUrl = findClub.club_thumbnail_url;

        if (thumbnail_url) {
            // If URL is provided in body, use that
            thumbnailUrl = thumbnail_url;
        } else if (req.file) {
            // If no URL but file is provided, upload the file
            const upload = await cloudinary.uploadBuffer(req.file.buffer, "bookcircle/club", club_name);
            thumbnailUrl = upload.secure_url;
        }
        // If neither URL nor file is provided, keep existing thumbnail

        await club.update({
            club_name: club_name,
            club_contact_email: club_contact_email,
            club_thumbnail_url: thumbnailUrl,
            club_location: club_location,
        }, {
            where: {
                id: clubId
            }
        });

        res.status(200).json({
            success: true,
            message: "Club Update Successful"
        });
    } catch (error) {
        console.error('Club Update Error: ', error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

const listClub = async (req, res) => {
    try {
        const role = req.body.role;
        const page = parseInt(req.query.page) || 1;
        const limit = 10;
        const offset = (page - 1) * limit;
        const search = req.query.search || "";
        const sortField = req.query.sortField || "createdAt";
        const sortOrder = req.query.sortOrder || "DESC";
        const status = req.query.status;
        const memberCount = req.query.memberCount;
        const bookCount = req.query.bookCount;

        if (role === undefined) {
            return res.status(400).json({
                success: false,
                message: "role is required"
            });
        }
        else if (role == 1 || role == 2) {
            return res.status(400).json({ success: false, message: "You are not authorized to access this page" });
        }

        const whereClause = {
            [Op.and]: [
                {
                    [Op.or]: [
                        { club_name: { [Op.iLike]: `%${search}%` } },
                        { club_location: { [Op.iLike]: `%${search}%` } }
                    ]
                }
            ]
        };

        if (status) {
            const statusValues = status.split(',');
            if (
                !(statusValues.includes('active') && statusValues.includes('inactive')) &&
                statusValues.length > 0
            ) {
                if (statusValues.includes('active')) {
                    whereClause[Op.and].push({ club_status: 'true' });
                } else if (statusValues.includes('inactive')) {
                    whereClause[Op.and].push({ club_status: 'false' });
                }
            }
        }

        const allClubs = await club.findAll({
            where: whereClause,
            include: [
                {
                    model: clubuser,
                    as: 'clubusers',
                    attributes: [],
                    required: false
                },
                {
                    model: book,
                    as: 'books',
                    attributes: [],
                    required: false
                }
            ],
            attributes: {
                include: [
                    [sequelize.fn('COUNT', sequelize.fn('DISTINCT', sequelize.col('clubusers.id'))), 'total_members'],
                    [sequelize.fn('COUNT', sequelize.fn('DISTINCT', sequelize.col('books.id'))), 'total_books']
                ]
            },
            group: ['club.id'],
            order: [[sortField, sortOrder]],
            subQuery: false
        });

        let filteredClubs = [...allClubs];


        if (memberCount) {
            const selectedSizes = memberCount.split(',');
        
            filteredClubs = filteredClubs.filter(club => {
                const count = parseInt(club.get('total_members'));
                return selectedSizes.some(size => {
                    switch (size) {
                        case 'small':
                            return count >= 0 && count <= 10;
                        case 'medium':
                            return count >= 11 && count <= 50;
                        case 'large':
                            return count >= 51;
                        default:
                            return false;
                    }
                });
            });
        }
        

        if (bookCount) {
            const selectedBookCounts = bookCount.split(',');
        
            filteredClubs = filteredClubs.filter(club => {
                const count = parseInt(club.get('total_books'));
        
                return selectedBookCounts.some(type => {
                    switch (type) {
                        case 'zero':
                            return count === 0;
                        case 'hasBooks':
                            return count >= 1;
                        case 'manyBooks':
                            return count > 50;
                        default:
                            return false;
                    }
                });
            });
        }        

        const totalFiltered = filteredClubs.length;

        const paginatedClubs = filteredClubs.slice(offset, offset + limit);

        res.status(200).json({
            success: true,
            page,
            limit,
            total: totalFiltered,
            listclub: {
                count: totalFiltered,
                rows: paginatedClubs
            }
        });

    } catch (error) {
        console.log('Club Member Listing Error', error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

const clubdetails = async (req, res) => {
    try {
        const clubId = req.body.clubId;

        if (!clubId) {
            return res.status(400).json({ success: false, message: "Club ID is required" });
        }

        const clubDetails = await club.findByPk(clubId)

        if (clubDetails) {
            res.status(200).json({ success: true, message: "Club Details Fetched Successfully", club: clubDetails })
        } else {
            res.status(404).json({ success: false, message: "Club Not Found" })
        }
    } catch (error) {
        console.error('Club Details Fetching Error: ', error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}


const deactivateClub = async (req, res) => {
    try {
        const clubId = req.body.clubId.id;

        if (!clubId) {
            return res.status(400).json({ success: false, message: "Club ID is required" });
        }

        const clubDetails = await club.findByPk(clubId)

        if (clubDetails) {
            await club.update({ club_status: !clubDetails.club_status }, { where: { id: clubId } })

            const statusMessage = clubDetails.club_status ? "inactived" : "actived";

            res.status(200).json({ success: true, message: `Club ${statusMessage} Successfully` })
        } else {
            res.status(404).json({ success: false, message: "Club Not Found" })
        }
    } catch (error) {
        console.error('Club Deactivation Error: ', error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}

export default { createClub, updateClub, listClub, clubdetails, deactivateClub }
