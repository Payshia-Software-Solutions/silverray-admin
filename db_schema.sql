-- Full Database Schema for Silver Ray Admin

-- -----------------------------------------------------
-- Table `Roles`
-- -----------------------------------------------------
CREATE TABLE Roles (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    permissions JSON,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


-- -----------------------------------------------------
-- Table `Users`
-- -----------------------------------------------------
CREATE TABLE Users (
    id VARCHAR(255) PRIMARY KEY,
    roleId VARCHAR(255) NOT NULL,
    fullName VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    passwordHash VARCHAR(255) NOT NULL,
    status ENUM('Active', 'Inactive') NOT NULL DEFAULT 'Active',
    lastLogin TIMESTAMP,
    avatarUrl VARCHAR(2048),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (roleId) REFERENCES Roles(id)
);


-- -----------------------------------------------------
-- Table `Guests`
-- -----------------------------------------------------
CREATE TABLE Guests (
    id VARCHAR(255) PRIMARY KEY,
    fullName VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(255),
    address TEXT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


-- -----------------------------------------------------
-- Table `RoomTypes`
-- -----------------------------------------------------
CREATE TABLE RoomTypes (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    descriptiveTitle VARCHAR(255),
    shortDescription TEXT,
    adults INT NOT NULL,
    children INT NOT NULL,
    roomSize JSON,
    pricePerNight DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) NOT NULL DEFAULT 'LKR',
    amenities JSON,
    images JSON,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


-- -----------------------------------------------------
-- Table `Rooms`
-- -----------------------------------------------------
CREATE TABLE Rooms (
    id VARCHAR(255) PRIMARY KEY,
    roomTypeId VARCHAR(255) NOT NULL,
    status ENUM('Available', 'Booked', 'Under Maintenance', 'Cleaning') NOT NULL DEFAULT 'Available',
    notes TEXT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (roomTypeId) REFERENCES RoomTypes(id) ON DELETE CASCADE
);


-- -----------------------------------------------------
-- Table `RoomBookings`
-- -----------------------------------------------------
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
    paymentStatus ENUM('Paid', 'Pending', 'Due') NOT NULL DEFAULT 'Pending',
    bookingStatus ENUM('Confirmed', 'Pending', 'CheckedIn', 'CheckedOut', 'Cancelled') NOT NULL DEFAULT 'Pending',
    bookingSource ENUM('Web', 'Phone', 'Walk-in') NOT NULL DEFAULT 'Web',
    specialRequests TEXT,
    internalNotes TEXT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (guestId) REFERENCES Guests(id) ON DELETE RESTRICT,
    FOREIGN KEY (roomId) REFERENCES Rooms(id) ON DELETE RESTRICT,
    CONSTRAINT chk_booking_dates CHECK (checkOutDate > checkInDate)
);


-- -----------------------------------------------------
-- Table `Experiences`
-- -----------------------------------------------------
CREATE TABLE Experiences (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    shortDescription TEXT,
    detailedDescription TEXT,
    duration VARCHAR(255),
    pricePerAdult DECIMAL(10, 2),
    pricePerChild DECIMAL(10, 2),
    currency VARCHAR(3) NOT NULL DEFAULT 'LKR',
    maxParticipants INT,
    meetingPoint VARCHAR(255),
    inclusions JSON,
    whatToBring JSON,
    status ENUM('Active', 'Inactive', 'Seasonal') NOT NULL DEFAULT 'Active',
    images JSON,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- -----------------------------------------------------
-- Table `ExperienceBookings`
-- -----------------------------------------------------
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
    specialRequests TEXT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (experienceId) REFERENCES Experiences(id) ON DELETE CASCADE,
    FOREIGN KEY (guestId) REFERENCES Guests(id) ON DELETE RESTRICT
);


-- -----------------------------------------------------
-- Table `Restaurants`
-- -----------------------------------------------------
CREATE TABLE Restaurants (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    capacity INT,
    status ENUM('Active', 'Inactive', 'Seasonal') NOT NULL DEFAULT 'Active',
    operatingHours JSON,
    images JSON,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


-- -----------------------------------------------------
-- Table `MenuItems`
-- -----------------------------------------------------
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


-- -----------------------------------------------------
-- Table `RestaurantReservations`
-- -----------------------------------------------------
CREATE TABLE RestaurantReservations (
    id VARCHAR(255) PRIMARY KEY,
    restaurantId VARCHAR(255) NOT NULL,
    guestId VARCHAR(255) NOT NULL,
    reservationDate DATE NOT NULL,
    reservationTime TIME NOT NULL,
    numberOfGuests INT NOT NULL,
    tableNumber VARCHAR(255),
    status ENUM('Confirmed', 'Pending', 'Cancelled', 'Seated') NOT NULL DEFAULT 'Pending',
    notes TEXT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (restaurantId) REFERENCES Restaurants(id) ON DELETE RESTRICT,
    FOREIGN KEY (guestId) REFERENCES Guests(id) ON DELETE RESTRICT
);


-- -----------------------------------------------------
-- Table `WeddingPackages`
-- -----------------------------------------------------
CREATE TABLE WeddingPackages (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(12, 2) NOT NULL,
    currency VARCHAR(3) NOT NULL DEFAULT 'LKR',
    maxGuests INT,
    inclusions JSON,
    associatedHallIds JSON,
    status ENUM('Active', 'Inactive') NOT NULL DEFAULT 'Active',
    images JSON,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


-- -----------------------------------------------------
-- Table `WeddingBookings`
-- -----------------------------------------------------
CREATE TABLE WeddingBookings (
    id VARCHAR(255) PRIMARY KEY,
    guestId VARCHAR(255) NOT NULL,
    packageId VARCHAR(255) NOT NULL,
    hallId VARCHAR(255),
    weddingDate DATE NOT NULL,
    expectedGuests INT NOT NULL,
    totalPrice DECIMAL(12, 2) NOT NULL,
    amountPaid DECIMAL(12, 2) DEFAULT 0.00,
    paymentStatus ENUM('Deposit Paid', 'Full Paid', 'Pending') NOT NULL DEFAULT 'Pending',
    bookingStatus ENUM('Confirmed', 'Pending', 'Cancelled') NOT NULL DEFAULT 'Pending',
    additionalServices JSON,
    internalNotes TEXT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (guestId) REFERENCES Guests(id) ON DELETE RESTRICT,
    FOREIGN KEY (packageId) REFERENCES WeddingPackages(id) ON DELETE RESTRICT
);
