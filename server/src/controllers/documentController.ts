import { Response } from 'express';
import { Document } from '../models';
import { AuthRequest } from '../middleware/auth';

export const getAllDocuments = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { documentType, status } = req.query;

    const where: any = { userId };

    if (documentType) {
      where.documentType = documentType;
    }

    if (status) {
      where.status = status;
    }

    const documents = await Document.findAll({
      where,
      order: [['uploadedAt', 'DESC']]
    });

    res.status(200).json({ documents });
  } catch (error) {
    console.error('Get documents error:', error);
    res.status(500).json({ error: 'Failed to get documents' });
  }
};

export const getDocumentById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    const document = await Document.findOne({
      where: { id, userId }
    });

    if (!document) {
      res.status(404).json({ error: 'Document not found' });
      return;
    }

    res.status(200).json({ document });
  } catch (error) {
    console.error('Get document error:', error);
    res.status(500).json({ error: 'Failed to get document' });
  }
};

export const uploadDocument = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const file = req.file;
    const { documentType, title, description, tags } = req.body;

    if (!file) {
      res.status(400).json({ error: 'No file uploaded' });
      return;
    }

    const document = await Document.create({
      userId: userId!,
      documentType,
      title: title || file.originalname,
      description,
      fileName: file.originalname,
      fileSize: file.size,
      fileUrl: `/uploads/${file.filename}`,
      mimeType: file.mimetype,
      uploadedAt: new Date(),
      tags: tags ? JSON.parse(tags) : [],
      status: 'pending'
    });

    res.status(201).json({ 
      message: 'Document uploaded successfully',
      document 
    });
  } catch (error) {
    console.error('Upload document error:', error);
    res.status(500).json({ error: 'Failed to upload document' });
  }
};

export const signDocument = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;
    const { signatureData } = req.body;

    const document = await Document.findOne({
      where: { id, userId }
    });

    if (!document) {
      res.status(404).json({ error: 'Document not found' });
      return;
    }

    await document.update({
      signatureData,
      signedAt: new Date(),
      status: 'signed'
    });

    res.status(200).json({ 
      message: 'Document signed successfully',
      document 
    });
  } catch (error) {
    console.error('Sign document error:', error);
    res.status(500).json({ error: 'Failed to sign document' });
  }
};

export const updateDocument = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;
    const documentData = req.body;

    const document = await Document.findOne({
      where: { id, userId }
    });

    if (!document) {
      res.status(404).json({ error: 'Document not found' });
      return;
    }

    await document.update(documentData);

    res.status(200).json({ 
      message: 'Document updated successfully',
      document 
    });
  } catch (error) {
    console.error('Update document error:', error);
    res.status(500).json({ error: 'Failed to update document' });
  }
};

export const deleteDocument = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    const document = await Document.findOne({
      where: { id, userId }
    });

    if (!document) {
      res.status(404).json({ error: 'Document not found' });
      return;
    }

    await document.destroy();

    res.status(200).json({ message: 'Document deleted successfully' });
  } catch (error) {
    console.error('Delete document error:', error);
    res.status(500).json({ error: 'Failed to delete document' });
  }
};
