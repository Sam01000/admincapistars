import axios from 'axios';

// URL de l'API CAPISTARS principale
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://3000-iiird9f9g20znnr8k9xh4-fbdbf5ef.manusvm.computer';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Types
export interface User {
  id: number;
  openId: string;
  name: string | null;
  email: string | null;
  role: 'user' | 'admin';
  createdAt: string;
  updatedAt: string;
  lastSignedIn: string;
}

export interface SalesRep {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  code: string;
  territories: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  establishmentCount?: number;
}

export interface Establishment {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  isActive: boolean;
  salesRepId?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Client {
  id: number;
  userId: number;
  firstName: string;
  lastName: string;
  email: string | null;
  phone: string | null;
  capimilesPoints: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ActionLog {
  id: number;
  action: string;
  entityType: string;
  entityId: number;
  entityName: string;
  performedBy: string;
  createdAt: string;
}

export interface Stats {
  totalClients: number;
  totalEstablishments: number;
  totalSalesReps: number;
  activeClients: number;
  activeEstablishments: number;
  activeSalesReps: number;
  pendingValidation: number;
  monthlyRevenue: number;
  totalBookings: number;
}

// Helper pour appeler les procédures tRPC via HTTP
async function trpcCall<T>(procedure: string, input?: any, type: 'query' | 'mutation' = 'query'): Promise<T> {
  try {
    if (type === 'query') {
      const params = input ? `?input=${encodeURIComponent(JSON.stringify(input))}` : '';
      const response = await apiClient.get(`/api/trpc/${procedure}${params}`);
      return response.data.result.data;
    } else {
      const response = await apiClient.post(`/api/trpc/${procedure}`, input);
      return response.data.result.data;
    }
  } catch (error: any) {
    console.error(`tRPC call failed: ${procedure}`, error);
    throw error;
  }
}

// API functions
export const api = {
  // Stats
  getStats: async (): Promise<Stats> => {
    try {
      // Récupérer les données depuis plusieurs endpoints
      const [salesReps, establishments] = await Promise.all([
        trpcCall<SalesRep[]>('salesReps.list'),
        trpcCall<Establishment[]>('establishments.list'),
      ]);

      const activeSalesReps = salesReps.filter(s => s.isActive).length;
      const activeEstablishments = establishments.filter(e => e.isActive).length;
      const pendingValidation = salesReps.filter(s => !s.isActive).length + 
                                establishments.filter(e => !e.isActive).length;

      return {
        totalClients: 0,
        totalEstablishments: establishments.length,
        totalSalesReps: salesReps.length,
        activeClients: 0,
        activeEstablishments,
        activeSalesReps,
        pendingValidation,
        monthlyRevenue: 0,
        totalBookings: 0,
      };
    } catch (error) {
      console.error('Error fetching stats:', error);
      return {
        totalClients: 0,
        totalEstablishments: 0,
        totalSalesReps: 0,
        activeClients: 0,
        activeEstablishments: 0,
        activeSalesReps: 0,
        pendingValidation: 0,
        monthlyRevenue: 0,
        totalBookings: 0,
      };
    }
  },

  // Sales Reps
  getSalesReps: async (): Promise<SalesRep[]> => {
    try {
      return await trpcCall<SalesRep[]>('salesReps.getAll');
    } catch (error) {
      console.error('Error fetching sales reps:', error);
      return [];
    }
  },

  updateSalesRep: async (id: number, data: Partial<SalesRep>): Promise<boolean> => {
    try {
      await trpcCall('salesReps.update', { id, ...data }, 'mutation');
      return true;
    } catch (error) {
      console.error('Error updating sales rep:', error);
      return false;
    }
  },

  toggleSalesRepActive: async (id: number, isActive: boolean): Promise<boolean> => {
    try {
      await trpcCall('salesReps.toggleActive', { id, isActive }, 'mutation');
      return true;
    } catch (error) {
      console.error('Error toggling sales rep:', error);
      return false;
    }
  },

  deleteSalesRep: async (id: number): Promise<boolean> => {
    try {
      await trpcCall('salesReps.delete', { id }, 'mutation');
      return true;
    } catch (error) {
      console.error('Error deleting sales rep:', error);
      return false;
    }
  },

  // Establishments
  getEstablishments: async (): Promise<Establishment[]> => {
    try {
      return await trpcCall<Establishment[]>('establishments.list');
    } catch (error) {
      console.error('Error fetching establishments:', error);
      return [];
    }
  },

  updateEstablishment: async (id: number, data: Partial<Establishment>): Promise<boolean> => {
    try {
      await trpcCall('establishments.update', { id, ...data }, 'mutation');
      return true;
    } catch (error) {
      console.error('Error updating establishment:', error);
      return false;
    }
  },

  toggleEstablishmentActive: async (id: number, isActive: boolean): Promise<boolean> => {
    try {
      await trpcCall('establishments.update', { id, isActive }, 'mutation');
      return true;
    } catch (error) {
      console.error('Error toggling establishment:', error);
      return false;
    }
  },

  deleteEstablishment: async (id: number): Promise<boolean> => {
    try {
      await trpcCall('establishments.delete', { id }, 'mutation');
      return true;
    } catch (error) {
      console.error('Error deleting establishment:', error);
      return false;
    }
  },

  // Clients (via users table)
  getClients: async (): Promise<Client[]> => {
    // Les clients sont stockés dans la table users avec role='user'
    // Pour l'instant, retourner une liste vide
    return [];
  },

  updateClient: async (id: number, data: Partial<Client>): Promise<boolean> => {
    return false;
  },

  toggleClientActive: async (id: number, isActive: boolean): Promise<boolean> => {
    return false;
  },

  deleteClient: async (id: number): Promise<boolean> => {
    return false;
  },

  // Action Logs
  getActionLogs: async (): Promise<ActionLog[]> => {
    // Pour l'instant, retourner une liste vide
    // TODO: Implémenter la table action_logs
    return [];
  },

  logAction: async (action: string, entityType: string, entityId: number, entityName: string): Promise<void> => {
    // TODO: Implémenter l'enregistrement des actions
    console.log('Action logged:', { action, entityType, entityId, entityName });
  },
};
