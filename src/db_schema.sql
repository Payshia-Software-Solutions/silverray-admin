-- This file contains the complete SQL schema for the application's database.
-- It follows 3rd Normal Form (3NF) to ensure data integrity and reduce redundancy.

--
-- Table structure for table `Roles`
--
CREATE TABLE Roles (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    permissions JSON, -- e.g., ["manage_users", "edit_rooms"]
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

--
-- Dumping data for table `Roles`
--
INSERT INTO Roles (id, name, description, permissions) VALUES
('super-admin', 'Super Admin', 'Full access to all system features', '["*"]'),
('booking-manager', 'Booking Manager', 'Manages rooms and reservations', '["manage_bookings", "manage_rooms"]'),
('restaurant-manager', 'Restaurant Manager', 'Manages dining and menus', '["manage_restaurant"]');

--
-- Table structure for table `Users`
--
CREATE TABLE Users (
    id VARCHAR(255) PRIMARY KEY,
    roleId VARCHAR(255) NOT NULL,
    fullName VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    passwordHash VARCHAR(255) NOT NULL,
    avatarUrl VARCHAR(2048),
    status ENUM('Active', 'Inactive') NOT NULL DEFAULT 'Active',
    lastLogin TIMESTAMP,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (roleId) REFERENCES Roles(id) ON DELETE RESTRICT
);

--
-- Table structure for table `Guests`
--
CREATE TABLE Guests (
    id VARCHAR(255) PRIMARY KEY,
    fullName VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(255),
    address TEXT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


--
-- Table structure for table `RoomTypes`
--
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

--
-- Table structure for table `Rooms`
--
CREATE TABLE Rooms (
    id VARCHAR(255) PRIMARY KEY,
    roomTypeId VARCHAR(255) NOT NULL,
    status ENUM('Available', 'Booked', 'Under Maintenance', 'Cleaning') NOT NULL DEFAULT 'Available',
    notes TEXT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (roomTypeId) REFERENCES RoomTypes(id) ON DELETE RESTRICT ON UPDATE CASCADE
);

--
-- Table structure for table `RoomBookings`
--
CREATE TABLE RoomBookings (
    id VARCHAR(255) PRIMARY KEY,
    guestId VARCHAR(255) NOT NULL,
    roomId VARCHAR(255) NOT NULL,
    checkInDate DATE NOT NULL,
    checkOutDate DATE NOT NULL,
    adults INT NOT NULL,
    children INT DEFAULT 0,
    totalAmount DECIMAL(10, 2) NOT NULL,
    amountPaid DECIMAL(10, 2) DEFAULT 0.00,
    currency VARCHAR(3) NOT NULL DEFAULT 'LKR',
    discountCode VARCHAR(255),
    paymentStatus ENUM('Paid', 'Pending', 'Due') NOT NULL DEFAULT 'Pending',
    paymentMethod ENUM('Credit Card', 'Cash', 'Bank Transfer'),
    bookingStatus ENUM('Confirmed', 'Pending', 'Cancelled') NOT NULL DEFAULT 'Pending',
    bookingSource ENUM('Online', 'Phone Call', 'Walk-in') NOT NULL DEFAULT 'Online',
    specialRequests TEXT,
    internalNotes TEXT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (guestId) REFERENCES Guests(id) ON DELETE RESTRICT,
    FOREIGN KEY (roomId) REFERENCES Rooms(id) ON DELETE RESTRICT,
    CONSTRAINT chk_dates CHECK (checkOutDate > checkInDate)
);

--
-- Table structure for table `Restaurants`
--
CREATE TABLE Restaurants (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    capacity INT,
    status ENUM('Active', 'Inactive', 'Seasonal') NOT NULL DEFAULT 'Active',
    operatingHours JSON,
    images JSON,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

--
-- Table structure for table `MenuItems`
--
CREATE TABLE MenuItems (
    id VARCHAR(255) PRIMARY KEY,
    restaurantId VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) NOT NULL DEFAULT 'LKR',
    category ENUM('Starter', 'Main Course', 'Dessert', 'Beverage') NOT NULL,
    status ENUM('Available', 'Unavailable', 'Seasonal') NOT NULL DEFAULT 'Available',
    dietaryInfo JSON,
    spiceLevel ENUM('Not Spicy', 'Mild', 'Medium', 'Hot') DEFAULT 'Mild',
    imageUrl VARCHAR(2048),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (restaurantId) REFERENCES Restaurants(id) ON DELETE CASCADE
);

--
-- Table structure for table `RestaurantReservations`
--
CREATE TABLE RestaurantReservations (
    id VARCHAR(255) PRIMARY KEY,
    restaurantId VARCHAR(255) NOT NULL,
    guestId VARCHAR(255) NOT NULL,
    reservationDate DATE NOT NULL,
    reservationTime TIME NOT NULL,
    durationMinutes INT,
    adults INT NOT NULL,
    children INT DEFAULT 0,
    tablePreference VARCHAR(255),
    notes TEXT,
    status ENUM('Confirmed', 'Pending', 'Cancelled', 'Seated') NOT NULL DEFAULT 'Pending',
    paymentStatus ENUM('Paid', 'Pending', 'Due at venue') NOT NULL DEFAULT 'Pending',
    bookingSource ENUM('Online', 'Phone Call', 'Walk-in') NOT NULL DEFAULT 'Online',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (restaurantId) REFERENCES Restaurants(id) ON DELETE CASCADE,
    FOREIGN KEY (guestId) REFERENCES Guests(id) ON DELETE RESTRICT
);


--
-- Table structure for table `WeddingPackages`
--
CREATE TABLE WeddingPackages (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    shortDescription TEXT,
    detailedDescription TEXT,
    price DECIMAL(12, 2) NOT NULL,
    currency VARCHAR(3) NOT NULL DEFAULT 'LKR',
    maxGuests INT,
    status ENUM('Active', 'Inactive', 'Seasonal') NOT NULL DEFAULT 'Active',
    inclusions JSON,
    associatedHallIds JSON,
    images JSON,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


--
-- Table structure for table `WeddingBookings`
--
CREATE TABLE WeddingBookings (
    id VARCHAR(255) PRIMARY KEY,
    guestId VARCHAR(255) NOT NULL,
    packageId VARCHAR(255) NOT NULL,
    hallId VARCHAR(255) NOT NULL,
    weddingDate DATE NOT NULL,
    weddingTime TIME,
    expectedGuests INT NOT NULL,
    totalPrice DECIMAL(12, 2) NOT NULL,
    amountPaid DECIMAL(12, 2) DEFAULT 0.00,
    paymentStatus ENUM('Deposit Paid', 'Full Paid', 'Pending') NOT NULL DEFAULT 'Pending',
    paymentMethod ENUM('Credit Card', 'Bank Transfer', 'Cash'),
    bookingStatus ENUM('Confirmed', 'Pending', 'Tentative', 'Cancelled') NOT NULL DEFAULT 'Pending',
    bookingSource ENUM('Website', 'Phone Call', 'Referral'),
    additionalServices JSON,
    internalNotes TEXT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (guestId) REFERENCES Guests(id) ON DELETE RESTRICT,
    FOREIGN KEY (packageId) REFERENCES WeddingPackages(id) ON DELETE RESTRICT
);

--
-- Table structure for table `Experiences`
--
CREATE TABLE Experiences (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    meetingPoint VARCHAR(255),
    shortDescription TEXT,
    detailedDescription TEXT,
    inclusions JSON,
    whatToBring JSON,
    duration VARCHAR(255),
    price DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) NOT NULL DEFAULT 'LKR',
    pricingBasis VARCHAR(255),
    bookingRequirements JSON,
    schedule JSON,
    minParticipants INT DEFAULT 1,
    maxParticipants INT,
    status ENUM('Active', 'Inactive', 'Seasonal') NOT NULL DEFAULT 'Active',
    images JSON,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

--
-- Table structure for table `ExperienceBookings`
--
CREATE TABLE ExperienceBookings (
    id VARCHAR(255) PRIMARY KEY,
    experienceId VARCHAR(255) NOT NULL,
    guestId VARCHAR(255) NOT NULL,
    experienceDate DATE NOT NULL,
    experienceTime TIME,
    adults INT NOT NULL,
    children INT DEFAULT 0,
    totalPrice DECIMAL(10, 2) NOT NULL,
    paymentStatus ENUM('Paid', 'Pending') NOT NULL DEFAULT 'Pending',
    bookingStatus ENUM('Confirmed', 'Cancelled') NOT NULL DEFAULT 'Confirmed',
    bookingSource VARCHAR(255),
    specialRequests TEXT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (experienceId) REFERENCES Experiences(id) ON DELETE CASCADE,
    FOREIGN KEY (guestId) REFERENCES Guests(id) ON DELETE RESTRICT
);
