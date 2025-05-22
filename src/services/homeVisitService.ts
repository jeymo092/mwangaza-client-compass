
import { query } from '../utils/db';
import { HomeVisit } from '../utils/types';
import { v4 as uuidv4 } from 'uuid';

// Get all home visits
export const getHomeVisits = async (): Promise<HomeVisit[]> => {
  try {
    const visits = await query<any[]>('SELECT * FROM home_visits ORDER BY date DESC');
    
    return visits.map(visit => ({
      id: visit.id,
      clientId: visit.clientId || visit.client_id,
      date: visit.date,
      conductedBy: visit.conductedBy || visit.conducted_by,
      summary: visit.summary,
      recommendations: visit.recommendations
    }));
  } catch (error) {
    console.error("Error fetching home visits:", error);
    return [];
  }
};

// Get home visits by client ID
export const getHomeVisitsByClientId = async (clientId: string): Promise<HomeVisit[]> => {
  try {
    const visits = await query<any[]>(
      'SELECT * FROM home_visits WHERE client_id = ? ORDER BY date DESC',
      [clientId]
    );
    
    return visits.map(visit => ({
      id: visit.id,
      clientId: visit.clientId || visit.client_id,
      date: visit.date,
      conductedBy: visit.conductedBy || visit.conducted_by,
      summary: visit.summary,
      recommendations: visit.recommendations
    }));
  } catch (error) {
    console.error("Error fetching home visits by client ID:", error);
    return [];
  }
};

// Add new home visit
export const addHomeVisit = async (homeVisit: Omit<HomeVisit, 'id'>): Promise<HomeVisit> => {
  try {
    const visitId = uuidv4();
    
    // Add directly to our localStorage mock database
    const visits = getLocalStorage('db_home_visits', []);
    const newVisit = {
      id: visitId,
      clientId: homeVisit.clientId,
      date: homeVisit.date,
      conductedBy: homeVisit.conductedBy,
      summary: homeVisit.summary,
      recommendations: homeVisit.recommendations
    };
    
    visits.push(newVisit);
    setLocalStorage('db_home_visits', visits);
    
    return newVisit;
  } catch (error) {
    console.error("Error adding home visit:", error);
    throw error;
  }
};

// Update existing home visit
export const updateHomeVisit = async (homeVisit: HomeVisit): Promise<HomeVisit> => {
  try {
    const visits = getLocalStorage('db_home_visits', []);
    const visitIndex = visits.findIndex((visit: any) => visit.id === homeVisit.id);
    
    if (visitIndex === -1) {
      throw new Error("Home visit not found");
    }
    
    visits[visitIndex] = {
      ...visits[visitIndex],
      date: homeVisit.date,
      conductedBy: homeVisit.conductedBy,
      summary: homeVisit.summary,
      recommendations: homeVisit.recommendations
    };
    
    setLocalStorage('db_home_visits', visits);
    return homeVisit;
  } catch (error) {
    console.error("Error updating home visit:", error);
    throw error;
  }
};

// Helper function to access localStorage - copied from db.ts to avoid circular dependencies
const getLocalStorage = (key: string, defaultValue: any[] = []) => {
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : defaultValue;
};

const setLocalStorage = (key: string, value: any) => {
  localStorage.setItem(key, JSON.stringify(value));
};
