import clubuser from '../models/clubuser.js';
import club from '../models/club.js';
import user from '../models/user.js';
import jwt from '../jwt/jwt.js';
import cloudinary from '../utils/cloudinary.js';
import { Op } from 'sequelize';

const clubList = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({success: false, message: 'Unauthorized: No token provided' });
        }

        const token = authHeader.split(' ')[1]; // Get the token part

        if (!token) {
            return res.status(400).json({
                success: false,
                message: "Token is required"
            });
        }
        // Verify the token

        const userId = jwt.getUserIdFromToken(token)
        console.log("User ID : ", userId);

        // Correct usage of findAndCountAll
        const result = await clubuser.findAndCountAll({
            where: { userId: userId },
            attributes: ['clubId', 'role'],
            include: [
                {
                    model: club,
                    where: { club_status: "true" },
                    attributes: ['club_name'],
                }
            ]
        });

        const response = {
            success: true,
            listclubs: result.rows
        };
        res.status(200).json(response);

    } catch (error) {
        console.log('Club Member Listing Error', error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

const listAllClub = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: No Token Provided"
      });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Token is required"
      });
    }

    // Extract user ID from token (assumed custom helper)
    const userId = jwt.getUserIdFromToken(token);
    console.log("User ID:", userId);

    // Fetch clubs
    const result = await club.findAndCountAll({
      attributes: ['id', 'club_name'],
      where: {
        club_status: "true"
      },
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
      success: true,
      listclubs: result.rows
    });
    
  } catch (error) {
    console.error('Error fetching all clubs:', error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
};


const setProfileImage = async (req, res) => {
    try {
        const token = req.body.token;

        if (!token) {
            return res.status(400).json({
                success: false,
                message: "Token is required"
            });
        }
        // Verify the token

        const userId = jwt.getUserIdFromToken(token)
        console.log("User ID : ", userId);

        const findUser = await user.findOne({
            where: { id: parseInt(userId) }
        });

        if (!findUser) {
            console.log("User not found : ", findUser);
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const upload = await cloudinary.uploadBuffer(req.file.buffer, "bookcircle/user", userId);
        console.log("Upload : ", upload);

        findUser.profile_image = upload.url;
        await findUser.save();
        res.status(200).json({
            success: true,
            message: "Profile picture updated successfully",
            profile_image: findUser.profile_image
        });
    } catch (error) {
        console.error('Error fetching user details:', error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

const userDetail = async (req, res) => {
    try {
        const token = req.body.token;

        if (!token) {
            return res.status(400).json({
                success: false,
                message: "Token is required"
            });
        }
        // Verify the token

        const userId = jwt.getUserIdFromToken(token)
        console.log("User ID : ", userId);
        const userDetails = await user.findByPk(userId);

        if (!userDetails) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            user: userDetails
        });

    } catch (error) {
        console.error('Error fetching user details:', error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

const userList = async (req, res) => {
  try {
    const {
      search = '',
      clubs,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
      filterRole,
      status // expecting an array of booleans: [true], [false], or [true, false]
    } = req.body;

    const offset = (page - 1) * limit;
    const sortField = ['name', 'email', 'createdAt', 'updatedAt'].includes(sortBy)
      ? sortBy
      : 'createdAt';
    const order = ['ASC', 'DESC'].includes(sortOrder.toUpperCase())
      ? sortOrder.toUpperCase()
      : 'DESC';

    // Step 1: Determine applicable user IDs based on club/role filters
    let userIdFilter = null;
    if (filterRole || clubs) {
      const clubuserWhere = {};
      if (filterRole) {
        clubuserWhere.role = {
          [Op.in]: filterRole.split(',').map(r => r.trim())
        };
      }
      if (clubs) {
        clubuserWhere.clubId = {
          [Op.in]: clubs.split(',').map(id => id.trim())
        };
      }

      const filteredClubusers = await clubuser.findAll({
        where: clubuserWhere,
        attributes: ['userId'],
        group: ['userId']
      });

      const matchingUserIds = filteredClubusers.map(cu => cu.userId);
      if (matchingUserIds.length === 0) {
        // No users match the club/role criteria
        return res.status(200).json({
          success: true,
          totalItems: 0,
          totalPages: 0,
          currentPage: page,
          currentrows: 0,
          listusers: [],
          sortBy: sortField,
          sortOrder: order,
          filters: {
            role: filterRole || null,
            clubs: clubs || null,
            status: status || null
          }
        });
      }
      userIdFilter = { [Op.in]: matchingUserIds };
    }

    // Step 2: Build main user where condition
    const userWhereCondition = {
      deletedAt: null,
      ...(userIdFilter ? { id: userIdFilter } : {}),
      [Op.or]: [
        { name:     { [Op.iLike]: `%${search}%` } },
        { email:    { [Op.iLike]: `%${search}%` } },
        { phone_no: { [Op.iLike]: `%${search}%` } }
      ]
    };

    // Add status filter if provided
    if (Array.isArray(status) && status.length > 0) {
      // ensure we have booleans
      const bools = status.map(s => (s === true || s === 'true'));
      userWhereCondition.status = { [Op.in]: bools };
    }

    // Step 3: Fetch paginated users
    const users = await user.findAll({
      where: userWhereCondition,
      attributes: ['id','name','email','phone_no','status','profile_image','createdAt'],
      order: [[sortField, order]],
      offset,
      limit
    });

    const userIds = users.map(u => u.id);

    // Step 4: Fetch club associations for these users
    const clubuserWhere2 = {
      userId: { [Op.in]: userIds }
    };
    if (filterRole) {
      clubuserWhere2.role = {
        [Op.in]: filterRole.split(',').map(r => r.trim())
      };
    }
    if (clubs) {
      clubuserWhere2.clubId = {
        [Op.in]: clubs.split(',').map(id => id.trim())
      };
    }

    const clubusersData = await clubuser.findAll({
      where: clubuserWhere2,
      attributes: ['userId','clubId','role'],
      include: [{ model: club, attributes: ['club_name'] }]
    });

    // Step 5: Merge club data into user JSON
    const clubuserMap = {};
    for (const cu of clubusersData) {
      (clubuserMap[cu.userId] = clubuserMap[cu.userId] || []).push(cu);
    }
    const enrichedUsers = users.map(u => {
      const userJson = u.toJSON();
      userJson.clubusers = clubuserMap[u.id] || [];
      return userJson;
    });

    // Step 6: Total count (for pagination)
    const totalCount = await user.count({ where: userWhereCondition });

    // Return response
    return res.status(200).json({
      success: true,
      totalItems: totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
      currentrows: enrichedUsers.length,
      listusers: enrichedUsers,
      sortBy: sortField,
      sortOrder: order,
      filters: {
        role: filterRole || null,
        clubs: clubs || null,
        status: status || null
      }
    });

  } catch (error) {
    console.error('Error searching users:', error);
    return res.status(500).json({
      success: false,
      message: 'Error searching users',
      error: error.message
    });
  }
};

const memberDetails = async (req, res) => {
  try {
      const { userId, role } = req.body;

      if (role === undefined || role === null) {
          return res.status(400).json({
              success: false,
              message: "Role is required"
          });
      }

      if (role != 0) {
          return res.status(400).json({
              success: false,
              message: "This role is not authorized for this action"
          });
      }

      if (!userId) {
          return res.status(400).json({
              success: false,
              message: "User ID is required"
          });
      }

      const userData = await user.findOne({
          where: { id: userId },
          attributes: ['id', 'name', 'email', 'phone_no'],
          include: [
              {
                  model: clubuser,
                  include: [{ model: club, attributes: ['club_name', 'id'] }],
                  attributes: ['role', 'clubId']
              }
          ]
      });

      if (!userData) {
          return res.status(404).json({ success: false, message: "User not found" });
      }

      res.status(200).json({ success: true, user: userData });
  } catch (err) {
      console.error("Error fetching member details:", err);
      res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};


const editMemberDetails = async (req, res) => {
  try {
    const { role, userId, name, phone_no, updates } = req.body;

    if (role != 0) {
      return res.status(403).json({ success: false, message: "Unauthorized access" });
    }

    if (!userId) {
      return res.status(400).json({ success: false, message: "User ID is required" });
    }

    await user.update(
      { name, phone_no },
      { where: { id: userId } }
    );

    if (Array.isArray(updates)) {
      for (const entry of updates) {
        const { clubId, newRole, remove } = entry;

        if (remove) {
          await clubuser.destroy({ where: { userId, clubId } });
        } else {
          await clubuser.update(
            { role: newRole },
            { where: { userId, clubId } }
          );
        }
      }
    }

    res.status(200).json({ success: true, message: "Member details updated successfully" });
  } catch (err) {
    console.error("Error updating member details:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};  

const deactivateUser = async (req, res) => {
  try {
    const { userId, role } = req.body.userId;

    if (role != 0) {
      return res.status(403).json({ success: false, message: "Unauthorized access" });
    }

    if (!userId) {
      return res.status(400).json({ success: false, message: "User ID is required" });
    }
    const userData = await user.findOne({ where: { id: userId } });
    if (!userData) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    await user.update(
      { status: !userData.status },
      { where: { id: userId } }
    );

    res.status(200).json({ success: true, message: `User ${userData.status ? "Deactivated" : "Activated"} successfully` });
  } catch (err) {
    console.error("Error deactivating user:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}


const removeClubUser = async (req, res) => {
  try {
    const { userId, clubId, role } = req.body.userId;

    console.log("User ID : ", userId, "Club ID : ", clubId, "Role : ", role);

    if (role != 1) {
      return res.status(403).json({ success: false, message: "Unauthorized access" });
    }

    if (!userId || !clubId) {
      return res.status(400).json({ success: false, message: "User ID and Club ID are required" });
    }

    await clubuser.destroy({ where: { userId, clubId } });

    res.status(200).json({ success: true, message: "User removed from club successfully" });
  } catch (err) {
    console.error("Error removing user from club:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};


export default { clubList, userList, userDetail, setProfileImage, listAllClub, memberDetails, editMemberDetails, deactivateUser, removeClubUser };