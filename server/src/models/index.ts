// Central export point for all models
import User from './User';
import Profile from './Profile';
import MedicalRecord from './MedicalRecord';
import Appointment from './Appointment';
import Document from './Document';
import BodyScan from './BodyScan';
import Pet from './Pet';
import VeteranProfile from './VeteranProfile';
import HealthMetrics from './HealthMetrics';

// Export all models
export {
  User,
  Profile,
  MedicalRecord,
  Appointment,
  Document,
  BodyScan,
  Pet,
  VeteranProfile,
  HealthMetrics
};

// Model initialization function
export const initializeModels = async (): Promise<void> => {
  try {
    // Models are already initialized during import
    console.log('✅ All models initialized successfully');
  } catch (error) {
    console.error('❌ Model initialization failed:', error);
    throw error;
  }
};

export default {
  User,
  Profile,
  MedicalRecord,
  Appointment,
  Document,
  BodyScan,
  Pet,
  VeteranProfile,
  HealthMetrics
};
