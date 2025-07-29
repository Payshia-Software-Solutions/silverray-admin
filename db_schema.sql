-- This file contains the SQL schema for the application's database.

-- Defines the properties and characteristics of a category of room.
CREATE TABLE RoomTypes (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    descriptiveTitle VARCHAR(255),
    shortDescription TEXT,
    adults INT NOT NULL DEFAULT 1,
    children INT DEFAULT 0,
    roomSize VARCHAR(255), -- e.g., "450 sqft"
    pricePerNight DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) NOT NULL DEFAULT 'LKR',
    amenities JSON, -- e.g., ["king-bed", "wifi", "balcony"]
    images JSON, -- e.g., [{"src": "url", "alt": "text", "primary": true}]
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Represents an individual, physical room in the hotel.
CREATE TABLE Rooms (
    id VARCHAR(255) PRIMARY KEY,
    roomTypeId VARCHAR(255) NOT NULL,
    status ENUM('Available', 'Booked', 'Under Maintenance', 'Cleaning') NOT NULL DEFAULT 'Available',
    notes TEXT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (roomTypeId) REFERENCES RoomTypes(id) ON DELETE RESTRICT ON UPDATE CASCADE
);
