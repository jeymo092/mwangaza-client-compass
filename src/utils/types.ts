
export type UserRole = "admin" | "social_worker" | "psychologist" | "educator";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface Subject {
  id: string;
  name: string;
  description?: string;
}

export interface Parent {
  id: string;
  name: string;
  contact: string;
  location: string;
  relationship: string;
}

export interface HomeVisit {
  id: string;
  date: string;
  conductedBy: string;
  summary: string;
  recommendations: string;
  clientId: string;
}

export interface AcademicRecord {
  id: string;
  clientId: string;
  subjectId: string;
  subjectName: string;
  score: number;
  grade: string;
  assessmentDate: string;
  comments?: string;
}

export interface Client {
  id: string;
  admissionNumber: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: "male" | "female" | "other";
  originalHome: string;
  street: string;
  admissionDate: string;
  parents: Parent[];
  academicRecords?: AcademicRecord[];
  homeVisits?: HomeVisit[];
  notes?: string;
}

export interface Department {
  id: string;
  name: string;
  description: string;
  staffCount: number;
}

export const departments = [
  { id: "admin", name: "Administration", description: "System administration and management", staffCount: 2 },
  { id: "social_work", name: "Social Work", description: "Client social support services", staffCount: 5 },
  { id: "psychology", name: "Psychology", description: "Mental health and counseling services", staffCount: 3 },
  { id: "education", name: "Education", description: "Academic progress and teaching", staffCount: 6 },
];

// Mock user data for demonstration
export const currentUser: User = {
  id: "1",
  name: "John Doe",
  email: "john.doe@mwangaza.org",
  role: "admin"
};

// Mock client data
export const mockClients: Client[] = [
  {
    id: "1",
    admissionNumber: "MWZ2023001",
    firstName: "Alex",
    lastName: "Kimani",
    dateOfBirth: "2008-05-15",
    gender: "male",
    originalHome: "Nairobi",
    street: "Eastleigh",
    admissionDate: "2023-01-15",
    parents: [
      {
        id: "p1",
        name: "Jane Kimani",
        contact: "+254712345678",
        location: "Nairobi, Eastleigh",
        relationship: "Mother"
      }
    ],
    notes: "Shows progress in behavioral therapy"
  },
  {
    id: "2",
    admissionNumber: "MWZ2023002",
    firstName: "Mary",
    lastName: "Wanjiku",
    dateOfBirth: "2010-09-21",
    gender: "female",
    originalHome: "Nakuru",
    street: "Bondeni",
    admissionDate: "2023-02-10",
    parents: [
      {
        id: "p2",
        name: "Peter Wanjiku",
        contact: "+254723456789",
        location: "Nakuru, Bondeni",
        relationship: "Father"
      },
      {
        id: "p3",
        name: "Sarah Wanjiku",
        contact: "+254734567890",
        location: "Nakuru, Bondeni",
        relationship: "Mother"
      }
    ],
    notes: "Needs extra support in mathematics"
  },
];

// Mock academic records
export const mockAcademicRecords: AcademicRecord[] = [
  {
    id: "a1",
    clientId: "1",
    subjectId: "s1",
    subjectName: "Mathematics",
    score: 75,
    grade: "B",
    assessmentDate: "2023-03-15",
    comments: "Showing improvement in algebra"
  },
  {
    id: "a2",
    clientId: "1",
    subjectId: "s2",
    subjectName: "English",
    score: 82,
    grade: "A",
    assessmentDate: "2023-03-15",
    comments: "Excellent comprehension skills"
  },
  {
    id: "a3",
    clientId: "2",
    subjectId: "s1",
    subjectName: "Mathematics",
    score: 65,
    grade: "C",
    assessmentDate: "2023-03-16",
    comments: "Needs additional support with fractions"
  },
];

// Mock home visits
export const mockHomeVisits: HomeVisit[] = [
  {
    id: "hv1",
    clientId: "1",
    date: "2023-04-10",
    conductedBy: "Jane Muthoni",
    summary: "Home environment is supportive. Parent engaged in client's progress.",
    recommendations: "Continue weekly check-ins with parent."
  },
  {
    id: "hv2",
    clientId: "2",
    date: "2023-04-12",
    conductedBy: "John Kamau",
    summary: "Home conditions have improved since last visit. New study space created.",
    recommendations: "Provide additional academic materials for home study."
  },
];

// Mock subjects
export const mockSubjects: Subject[] = [
  { id: "s1", name: "Mathematics", description: "Basic numeracy and mathematical concepts" },
  { id: "s2", name: "English", description: "Language skills and literacy" },
  { id: "s3", name: "Science", description: "Basic scientific concepts and experiments" },
  { id: "s4", name: "Social Studies", description: "History, geography and civic education" },
  { id: "s5", name: "Life Skills", description: "Practical skills for everyday living" },
];
