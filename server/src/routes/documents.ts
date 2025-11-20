import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import * as documentController from '../controllers/documentController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|pdf|doc|docx/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  }
});

router.get('/', authenticateToken, documentController.getAllDocuments);
router.get('/:id', authenticateToken, documentController.getDocumentById);
router.post('/upload', authenticateToken, upload.single('file'), documentController.uploadDocument);
router.post('/:id/sign', authenticateToken, documentController.signDocument);
router.put('/:id', authenticateToken, documentController.updateDocument);
router.delete('/:id', authenticateToken, documentController.deleteDocument);

export default router;
