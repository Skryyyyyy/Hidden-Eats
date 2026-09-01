/**
 * Maintenance Mode Configuration & Helpers
 */

export interface MaintenanceConfig {
  isEnabled: boolean;
  message: string;
  estimatedEndTime?: string;
  allowedRoles?: string[];
}

export const DEFAULT_MAINTENANCE_CONFIG: MaintenanceConfig = {
  isEnabled: false,
  message: 'Hidden Eats is currently undergoing scheduled platform upgrades to bring you faster hidden gem discoveries and real-time order tracking.',
  estimatedEndTime: 'Shortly',
  allowedRoles: ['admin', 'partner'],
};

// Check if a specific route is in maintenance
export function isRouteInMaintenance(pathname: string): boolean {
  if (typeof window !== 'undefined') {
    const override = localStorage.getItem('he_maintenance_mode');
    if (override === 'true') return true;
  }
  return process.env.NEXT_PUBLIC_MAINTENANCE_MODE === 'true';
}
