/**
 * Authentication Configuration
 * IMPORTANT: This is basic access protection only, not a production authentication system.
 * Credentials are stored client-side for demo/client delivery purposes only.
 */

export const AUTH_CONFIG = {
  credentials: [
    // Existing Pravakta credentials (kept for backward compatibility)
    { username: 'client', password: 'client@123', role: 'pravakta' },
    // Role-based credentials requested by client
    { username: 'pravakta', password: 'pravakta@2026', role: 'pravakta' },
    { username: 'tigers', password: 'gems@2026', role: 'tiger' }
  ] as const,
  storageLockKey: 'kbc_access_granted',
  roleStorageKey: 'kbc_selected_role',
  defaultRole: 'pravakta' as const,
};

export type UserRole = (typeof AUTH_CONFIG.credentials)[number]['role'];
