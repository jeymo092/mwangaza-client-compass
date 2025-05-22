
import { query } from '../utils/db';
import { Client, Parent } from '../utils/types';
import { v4 as uuidv4 } from 'uuid';

// Get all clients
export const getClients = async (): Promise<Client[]> => {
  const clients = await query<any[]>('SELECT * FROM clients');
  
  // For each client, get their parents
  const clientsWithParents = await Promise.all(
    clients.map(async (client) => {
      const parents = await query<Parent[]>(
        'SELECT * FROM parents WHERE client_id = ?',
        [client.id]
      );
      
      return {
        id: client.id,
        admissionNumber: client.admission_number,
        firstName: client.first_name,
        lastName: client.last_name,
        dateOfBirth: client.date_of_birth,
        gender: client.gender,
        originalHome: client.original_home,
        street: client.street,
        admissionDate: client.admission_date,
        intake: client.intake,
        notes: client.notes,
        parents: parents.map(p => ({
          id: p.id,
          name: p.name,
          contact: p.contact,
          location: p.location,
          relationship: p.relationship
        }))
      };
    })
  );
  
  return clientsWithParents;
};

// Get client by ID
export const getClientById = async (id: string): Promise<Client | null> => {
  const clients = await query<any[]>('SELECT * FROM clients WHERE id = ?', [id]);
  
  if (clients.length === 0) {
    return null;
  }
  
  const client = clients[0];
  
  // Get parents
  const parents = await query<Parent[]>(
    'SELECT * FROM parents WHERE client_id = ?',
    [id]
  );
  
  return {
    id: client.id,
    admissionNumber: client.admission_number,
    firstName: client.first_name,
    lastName: client.last_name,
    dateOfBirth: client.date_of_birth,
    gender: client.gender,
    originalHome: client.original_home,
    street: client.street,
    admissionDate: client.admission_date,
    intake: client.intake,
    notes: client.notes,
    parents: parents.map(p => ({
      id: p.id,
      name: p.name,
      contact: p.contact,
      location: p.location,
      relationship: p.relationship
    }))
  };
};

// Add new client
export const addClient = async (client: Omit<Client, 'id'>): Promise<Client> => {
  const clientId = uuidv4();
  
  // Insert client
  await query(
    `INSERT INTO clients (
      id, admission_number, first_name, last_name, date_of_birth, 
      gender, original_home, street, admission_date, intake, notes
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      clientId,
      client.admissionNumber,
      client.firstName,
      client.lastName,
      client.dateOfBirth,
      client.gender,
      client.originalHome,
      client.street,
      client.admissionDate,
      client.intake,
      client.notes || null
    ]
  );
  
  // Insert parents
  if (client.parents && client.parents.length > 0) {
    for (const parent of client.parents) {
      const parentId = uuidv4();
      await query(
        `INSERT INTO parents (
          id, name, contact, location, relationship, client_id
        ) VALUES (?, ?, ?, ?, ?, ?)`,
        [
          parentId,
          parent.name,
          parent.contact,
          parent.location,
          parent.relationship,
          clientId
        ]
      );
    }
  }
  
  // Get the client with parents
  const newClient = await getClientById(clientId);
  return newClient as Client;
};
