import express from 'express';
import clubController from '../controller/clubController.js';
import upload from '../middleware/multer.js';

const router = express.Router();

// Existing club routes
router.post('/listclub', clubController.listClub);
router.post('/createclub', upload.single("file"), clubController.createClub);
router.post('/clubdetails', clubController.clubdetails);
router.post('/deleteclub', clubController.deactivateClub);
router.post('/updateclub', upload.single("file"), clubController.updateClub);

// Select a club and store it in session
router.post('/select', (req, res) => {
    const { clubId, role } = req.body;

    if (clubId === undefined || role === undefined) {
        return res.status(400).json({ success: false, message: 'clubId and role are required' });
    }

    req.session.clubId = clubId;
    req.session.role = role;

    res.status(200).json({ success: true, message: 'Club selected successfully' });
});

router.get('/check', (req, res) => {
    res.status(200).json({ status: true, clubId: req.session.clubId, role: req.session.role});
})
// Switch/clear current club selection
router.post('/switchclub', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.log(error); 
            return res.status(500).json({ success: false, message: 'Failed to destroy session' });
        }
        console.log("success");
        res.status(200).json({ success: true, message: 'Session destroyed' });
    });
});

export default router