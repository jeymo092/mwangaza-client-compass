
-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS mwangaza_db;
USE mwangaza_db;

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(100) NOT NULL,
  role ENUM('admin', 'social_worker', 'psychologist', 'educator') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Clients table
CREATE TABLE IF NOT EXISTS clients (
  id VARCHAR(36) PRIMARY KEY,
  admission_number VARCHAR(20) NOT NULL UNIQUE,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  date_of_birth DATE NOT NULL,
  gender ENUM('male', 'female', 'other') NOT NULL,
  original_home VARCHAR(100) NOT NULL,
  street VARCHAR(100) NOT NULL,
  admission_date DATE NOT NULL,
  status ENUM('active', 'successful_reintegration', 'early_reintegration', 'discharge', 'referral') DEFAULT 'active',
  aftercare_details JSON,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Parents table
CREATE TABLE IF NOT EXISTS parents (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  contact VARCHAR(50) NOT NULL,
  location VARCHAR(100) NOT NULL,
  relationship VARCHAR(50) NOT NULL,
  client_id VARCHAR(36) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
);

-- Subjects table
CREATE TABLE IF NOT EXISTS subjects (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Academic records table
CREATE TABLE IF NOT EXISTS academic_records (
  id VARCHAR(36) PRIMARY KEY,
  client_id VARCHAR(36) NOT NULL,
  subject_id VARCHAR(36) NOT NULL,
  score DECIMAL(5,2) NOT NULL,
  grade VARCHAR(5) NOT NULL,
  assessment_date DATE NOT NULL,
  comments TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE,
  FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE
);

-- Home visits table
CREATE TABLE IF NOT EXISTS home_visits (
  id VARCHAR(36) PRIMARY KEY,
  client_id VARCHAR(36) NOT NULL,
  date DATE NOT NULL,
  conducted_by VARCHAR(100) NOT NULL,
  summary TEXT NOT NULL,
  recommendations TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
);

-- Insert default subjects
INSERT INTO subjects (id, name, description) VALUES 
('s1', 'Mathematics', 'Basic numeracy and mathematical concepts'),
('s2', 'English', 'Language skills and literacy'),
('s3', 'Science', 'Basic scientific concepts and experiments'),
('s4', 'Social Studies', 'History, geography and civic education'),
('s5', 'Life Skills', 'Practical skills for everyday living');

-- Create an admin user (password: admin123)
INSERT INTO users (id, name, email, password, role) VALUES 
('1', 'Admin User', 'admin@mwangaza.org', '$2a$10$xVqQkR8S/clZ3MnFLDu4oehe0zP7KYe4TyWlzjT.RDkU9YCgRlhVW', 'admin');
