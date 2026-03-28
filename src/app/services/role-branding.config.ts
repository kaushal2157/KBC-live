import { UserRole } from '../auth/config/auth.config';

export interface RoleBrandingConfig {
  heading: string;
  organizationName: string;
  logoPath: string;
  kbcLogoPath: string;
  questionsFile: string;
}

export const ROLE_BRANDING_CONFIG: Record<UserRole, RoleBrandingConfig> = {
  pravakta: {
    heading: 'Kon Banega English Kaa',
    organizationName: 'Pravakta Academy',
    logoPath: 'pravakta-logo.png',
    kbcLogoPath: 'kbc_logo.png',
    questionsFile: 'questions.json'
  },
  tiger: {
    heading: 'Kon Banega GEMS',
    organizationName: 'Tiger School',
    logoPath: 'tiger logo.jpeg',
    kbcLogoPath: 'kbc_logo.png',
    questionsFile: 'tigerQuestions.json'
  }
};
