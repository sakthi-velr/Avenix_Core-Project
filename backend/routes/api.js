const express = require('express');
const router = express.Router();
const multer = require('multer');

// Configure Multer storage in memory
const upload = multer({ storage: multer.memoryStorage() });

// Middleware
const authenticateAdmin = require('../middleware/auth');

// Controllers
const authController = require('../controllers/authController');
const projectController = require('../controllers/projectController');
const reviewController = require('../controllers/reviewController');
const statController = require('../controllers/statController');
const contactController = require('../controllers/contactController');
const uploadController = require('../controllers/uploadController');

// 1. Auth routes
router.post('/admin/auth/login', authController.login);
router.get('/admin/auth/verify', authenticateAdmin, authController.verifyToken);

// 2. Project routes (Public & Admin)
router.get('/projects', projectController.getProjects);
router.post('/admin/projects', authenticateAdmin, projectController.createProject);
router.put('/admin/projects/reorder', authenticateAdmin, projectController.reorderProjects);
router.put('/admin/projects/:slug', authenticateAdmin, projectController.updateProject);
router.delete('/admin/projects/:slug', authenticateAdmin, projectController.deleteProject);

// 3. Stats routes (Public & Admin)
router.get('/stats', statController.getStats);
router.put('/admin/stats', authenticateAdmin, statController.updateStats);

// 4. Review routes (Public & Admin)
router.get('/reviews', reviewController.getPublicReviews);
router.post('/reviews', reviewController.submitReview);
router.get('/admin/reviews', authenticateAdmin, reviewController.getAdminReviews);
router.put('/admin/reviews/:id/approve', authenticateAdmin, reviewController.approveReview);
router.put('/admin/reviews/:id/hide', authenticateAdmin, reviewController.hideReview);
router.delete('/admin/reviews/:id', authenticateAdmin, reviewController.deleteReview);

// 5. Contact inquiries (Public & Admin)
router.post('/contact', contactController.submitInquiry);
router.get('/admin/inquiries', authenticateAdmin, contactController.getInquiries);
router.delete('/admin/inquiries/:id', authenticateAdmin, contactController.deleteInquiry);

// 6. Image Upload
router.post('/admin/upload', authenticateAdmin, upload.single('file'), uploadController.uploadImage);

module.exports = router;
