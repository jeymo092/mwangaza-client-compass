
import { query } from '../utils/db';
import { HomeVisit } from '../utils/types';
import { v4 as uuidv4 } from 'uuid';

// Get all home visits
export const getHomeVisits = async (): Promise<HomeVisit[]> => {
  const visits = await query<any[]>('SELECT * FROM home_visits ORDER BY date DESC');
  
  return visits.map(visit => ({
    id: visit.id,
    clientId: visit.client_id,
    date: visit.date,
    conductedBy: visit.conducted_by,
    summary: visit.summary,
    recommendations: visit.recommendations
  }));
};

// Get home visits by client ID
export const getHomeVisitsByClientId = async (clientId: string): Promise<HomeVisit[]> => {
  const visits = await query<any[]>(
    'SELECT * FROM home_visits WHERE client_id = ? ORDER BY date DESC',
    [clientId]
  );
  
  return visits.map(visit => ({
    id: visit.id,
    clientId: visit.client_id,
    date: visit.date,
    conductedBy: visit.conducted_by,
    summary: visit.summary,
    recommendations: visit.recommendations
  }));
};

// Add new home visit
export const addHomeVisit = async (homeVisit: Omit<HomeVisit, 'id'>): Promise<HomeVisit> => {
  const visitId = uuidv4();
  
  await query(
    `INSERT INTO home_visits (
      id, client_id, date, conducted_by, summary, recommendations
    ) VALUES (?, ?, ?, ?, ?, ?)`,
    [
      visitId,
      homeVisit.clientId,
      homeVisit.date,
      homeVisit.conductedBy,
      homeVisit.summary,
      homeVisit.recommendations
    ]
  );
  
  return {
    id: visitId,
    ...homeVisit
  };
};
