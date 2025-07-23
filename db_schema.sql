-- Database Schema for the Hotel Management System
-- Designed for MySQL and follows 3rd Normal Form (3NF).

-- ---
-- 1. User and Access Control
-- ---

CREATE TABLE Roles (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    permissions JSON,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE Users (
    id VARCHAR(255) PRIMARY KEY,
    roleId VARCHAR(255),
    fullName VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    passwordHash VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'Active',
    lastLogin TIMESTAMP NULL,
    avatarUrl VARCHAR(255),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (roleId) REFERENCES Roles(id)
);

-- ---
-- 2. Central Guest Management
-- ---

CREATE TABLE Guests (
    id VARCHAR(255) PRIMARY KEY,
    fullName VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(50),
    address TEXT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ---
-- 3. Room Management & Bookings
-- ---

CREATE TABLE RoomTypes (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    descriptiveTitle VARCHAR(255),
    shortDescription TEXT,
    adults INT DEFAULT 2,
    children INT DEFAULT 0,
    roomSize JSON, -- { "width": 450, "height": 450, "unit": "sqft" }
    pricePerNight DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'USD',
    amenities JSON, -- ["king-bed", "wifi", "balcony"]
    images JSON, -- [{ "src": "url", "alt": "text", "hint": "hint", "primary": true }]
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE Rooms (
    id VARCHAR(255) PRIMARY KEY, -- e.g., "101", "205A"
    roomTypeId VARCHAR(255),
    status VARCHAR(50) DEFAULT 'Available', -- Available, Booked, Under Maintenance
    notes TEXT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (roomTypeId) REFERENCES RoomTypes(id)
);

CREATE TABLE RoomBookings (
    id VARCHAR(255) PRIMARY KEY,
    guestId VARCHAR(255),
    roomId VARCHAR(255),
    checkInDate DATE NOT NULL,
    checkOutDate DATE NOT NULL,
    adults INT NOT NULL,
    children INT DEFAULT 0,
    totalAmount DECIMAL(10, 2) NOT NULL,
    amountPaid DECIMAL(10, 2) DEFAULT 0.00,
    currency VARCHAR(10) DEFAULT 'USD',
    paymentStatus VARCHAR(50) DEFAULT 'Pending', -- Paid, Pending, Due
    bookingStatus VARCHAR(50) DEFAULT 'Pending', -- Confirmed, Pending, CheckedIn, CheckedOut, Cancelled
    bookingSource VARCHAR(50),
    specialRequests TEXT,
    internalNotes TEXT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (guestId) REFERENCES Guests(id),
    FOREIGN KEY (roomId) REFERENCES Rooms(id)
);

-- ---
-- 4. Experience Management
-- ---

CREATE TABLE Experiences (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    shortDescription TEXT,
    detailedDescription TEXT,
    duration VARCHAR(100),
    pricePerAdult DECIMAL(10, 2),
    pricePerChild DECIMAL(10, 2),
    currency VARCHAR(10) DEFAULT 'USD',
    maxParticipants INT,
    meetingPoint VARCHAR(255),
    inclusions JSON, -- ["Guided tour", "Refreshments"]
    whatToBring JSON, -- ["Comfortable shoes", "Sunscreen"]
    status VARCHAR(50) DEFAULT 'Inactive', -- Active, Inactive, Seasonal
    images JSON,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE ExperienceBookings (
    id VARCHAR(255) PRIMARY KEY,
    experienceId VARCHAR(255),
    guestId VARCHAR(255),
    experienceDate DATE NOT NULL,
    experienceTime TIME,
    adults INT NOT NULL,
    children INT DEFAULT 0,
    totalPrice DECIMAL(10, 2) NOT NULL,
    paymentStatus VARCHAR(50) DEFAULT 'Pending', -- Paid, Pending
    bookingStatus VARCHAR(50) DEFAULT 'Confirmed', -- Confirmed, Cancelled
    specialRequests TEXT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (experienceId) REFERENCES Experiences(id),
    FOREIGN KEY (guestId) REFERENCES Guests(id)
);

-- ---
-- 5. Restaurant Management
-- ---

CREATE TABLE Restaurants (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    capacity INT,
    status VARCHAR(50) DEFAULT 'Active', -- Active, Inactive, Seasonal
    operatingHours JSON, -- { "mon": "9am-10pm", "tue": "9am-10pm" }
    images JSON,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE MenuItems (
    id VARCHAR(255) PRIMARY KEY,
    restaurantId VARCHAR(255),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'USD',
    category VARCHAR(100), -- Starter, Main Course, Dessert
    status VARCHAR(50) DEFAULT 'Available', -- Available, Unavailable, Seasonal
    dietaryInfo JSON, -- ["Gluten-Free", "Vegan"]
    spiceLevel VARCHAR(50),
    image JSON, -- { "src": "url", "alt": "text", "hint": "hint" }
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (restaurantId) REFERENCES Restaurants(id) ON DELETE CASCADE
);

CREATE TABLE RestaurantReservations (
    id VARCHAR(255) PRIMARY KEY,
    restaurantId VARCHAR(255),
    guestId VARCHAR(255),
    reservationDate DATETIME NOT NULL,
    numberOfGuests INT NOT NULL,
    tableNumber VARCHAR(50),
    status VARCHAR(50) DEFAULT 'Pending', -- Confirmed, Pending, Cancelled, Seated
    notes TEXT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (restaurantId) REFERENCES Restaurants(id),
    FOREIGN KEY (guestId) REFERENCES Guests(id)
);


-- ---
-- 6. Wedding Management
-- ---

CREATE TABLE WeddingPackages (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'USD',
    maxGuests INT,
    inclusions JSON, -- ["Catering", "Decorations"]
    associatedHallIds JSON, -- ["grand-ballroom", "garden-pavilion"]
    status VARCHAR(50) DEFAULT 'Active',
    images JSON,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE WeddingBookings (
    id VARCHAR(255) PRIMARY KEY,
    guestId VARCHAR(255),
    packageId VARCHAR(255),
    hallId VARCHAR(255),
    weddingDate DATE NOT NULL,
    expectedGuests INT,
    totalPrice DECIMAL(10, 2),
    amountPaid DECIMAL(10, 2),
    paymentStatus VARCHAR(50) DEFAULT 'Pending', -- Deposit Paid, Full Paid, Pending
    bookingStatus VARCHAR(50) DEFAULT 'Pending', -- Confirmed, Pending, Cancelled
    additionalServices JSON,
    internalNotes TEXT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (guestId) REFERENCES Guests(id),
    FOREIGN KEY (packageId) REFERENCES WeddingPackages(id)
);
