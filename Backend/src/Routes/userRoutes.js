
import express from 'express';
import userController from '../controller/userController.js';
import upload from '../middleware/multer.js';
const router = express.Router();

router.get('/listclub', userController.clubList);
router.post('/userdetails', userController.userDetail);
router.post('/set-profile', upload.single("file") , userController.setProfileImage)
router.post('/userlist', userController.userList);
router.get('/allclubs', userController.listAllClub);
router.post('/listusers/memberDetails', userController.memberDetails);
router.post('/listusers/editMemberDetails', userController.editMemberDetails);
router.post('/listusers/deleteMember', userController.deactivateUser);
router.post('/listusers/removeMember', userController.removeClubUser);

export default router;