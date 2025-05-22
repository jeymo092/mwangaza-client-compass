
import { query } from '../utils/db';
import { Client, Parent, ClientStatus, AftercareProgramDetails } from '../utils/types';
import { v4 as uuidv4 } from 'uuid';

// Get all clients
export const getClients = async (): Promise<Client[]> => {
  try {
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
          admissionNumber: client.admissionNumber || client.admission_number,
          firstName: client.firstName || client.first_name,
          lastName: client.lastName || client.last_name,
          dateOfBirth: client.dateOfBirth || client.date_of_birth,
          gender: client.gender,
          originalHome: client.originalHome || client.original_home,
          street: client.street,
          admissionDate: client.admissionDate || client.admission_date,
          intake: client.intake,
          status: client.status || "active",
          aftercareDetails: client.aftercareDetails || null,
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
  } catch (error) {
    console.error("Error fetching clients:", error);
    return [];
  }
};

// Get client by ID
export const getClientById = async (id: string): Promise<Client | null> => {
  try {
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
      admissionNumber: client.admissionNumber || client.admission_number,
      firstName: client.firstName || client.first_name,
      lastName: client.lastName || client.last_name,
      dateOfBirth: client.dateOfBirth || client.date_of_birth,
      gender: client.gender,
      originalHome: client.originalHome || client.original_home,
      street: client.street,
      admissionDate: client.admissionDate || client.admission_date,
      intake: client.intake,
      status: client.status || "active",
      aftercareDetails: client.aftercareDetails || null,
      notes: client.notes,
      parents: parents.map(p => ({
        id: p.id,
        name: p.name,
        contact: p.contact,
        location: p.location,
        relationship: p.relationship
      }))
    };
  } catch (error) {
    console.error("Error fetching client:", error);
    return null;
  }
};

// Add new client
export const addClient = async (client: Omit<Client, 'id'>): Promise<Client> => {
  try {
    const clientId = uuidv4();
    
    // Insert client - in our mock version, we save the object directly to localStorage
    await query(
      `INSERT INTO clients (
        id, admission_number, first_name, last_name, date_of_birth, 
        gender, original_home, street, admission_date, intake, notes, 
        status, aftercare_details
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
        client.intake || null,
        client.notes || null,
        client.status || "active",
        client.aftercareDetails ? JSON.stringify(client.aftercareDetails) : null
      ]
    );
    
    // Insert parents directly to our mock storage
    if (client.parents && client.parents.length > 0) {
      const parents = getLocalStorage('db_parents');
      
      for (const parent of client.parents) {
        const parentId = uuidv4();
        parents.push({
          id: parentId,
          name: parent.name,
          contact: parent.contact,
          location: parent.location,
          relationship: parent.relationship,
          clientId: clientId
        });
      }
      
      setLocalStorage('db_parents', parents);
    }
    
    // Get the client with parents (this should work with our mock db)
    const newClient = await getClientById(clientId);
    return newClient as Client;
  } catch (error) {
    console.error("Error adding client:", error);
    throw error;
  }
};

// Update client status and aftercare details
export const updateClientStatus = async (
  clientId: string, 
  status: ClientStatus, 
  aftercareDetails?: AftercareProgramDetails
): Promise<Client | null> => {
  try {
    // Get the existing client data
    const clients = getLocalStorage('db_clients', []);
    const clientIndex = clients.findIndex((c: any) => c.id === clientId);
    
    if (clientIndex === -1) {
      console.error("Client not found");
      return null;
    }
    
    // Update the client's status and aftercare details
    clients[clientIndex] = {
      ...clients[clientIndex],
      status: status,
      aftercareDetails: aftercareDetails || null
    };
    
    // Save back to localStorage
    setLocalStorage('db_clients', clients);
    
    // Return the updated client
    return await getClientById(clientId);
  } catch (error) {
    console.error("Error updating client status:", error);
    return null;
  }
};

// Update client notes - added for social workers
export const updateClientNotes = async (clientId: string, notes: string): Promise<Client | null> => {
  try {
    const clients = getLocalStorage('db_clients', []);
    const clientIndex = clients.findIndex((c: any) => c.id === clientId);
    
    if (clientIndex === -1) {
      console.error("Client not found");
      return null;
    }
    
    // Update only the notes field
    clients[clientIndex] = {
      ...clients[clientIndex],
      notes: notes
    };
    
    setLocalStorage('db_clients', clients);
    return await getClientById(clientId);
  } catch (error) {
    console.error("Error updating client notes:", error);
    return null;
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
