-- This script creates the necessary tables for managing rooms and their types.

--
-- Table structure for table `room_types`
--
-- This table stores categories of rooms, like "Deluxe Double" or "King Suite".
-- This avoids duplicating information for rooms of the same type.
--
CREATE TABLE IF NOT EXISTS `room_types` (
  `id` VARCHAR(50) NOT NULL PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `descriptiveTitle` VARCHAR(255) DEFAULT NULL,
  `shortDescription` TEXT,
  `adults` INT NOT NULL DEFAULT 2,
  `children` INT NOT NULL DEFAULT 0,
  `roomSize` VARCHAR(50) DEFAULT NULL, -- e.g., "450 sqft"
  `pricePerNight` DECIMAL(10, 2) NOT NULL,
  `currency` VARCHAR(3) NOT NULL DEFAULT 'LKR',
  `images` JSON DEFAULT NULL, -- Store image paths as a JSON array
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `companyId` VARCHAR(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `room_types`
--
INSERT INTO `room_types` (`id`, `name`, `descriptiveTitle`, `shortDescription`, `adults`, `children`, `roomSize`, `pricePerNight`, `currency`, `companyId`) VALUES
('RT001', 'Deluxe Double Room', 'Deluxe Double Room with Balcony', 'A spacious room with a beautiful balcony view.', 2, 1, '450 sqft', 15000.00, 'LKR', 'C001'),
('RT002', 'King Suite', 'Luxury King Suite with Ocean View', 'An expansive suite offering premium amenities and a stunning ocean view.', 2, 2, '700 sqft', 25000.00, 'LKR', 'C001'),
('RT003', 'Premium Suite', 'Exclusive Premium Suite with Private Pool', 'The ultimate luxury experience with a private plunge pool and dedicated butler service.', 2, 0, '1200 sqft', 50000.00, 'LKR', 'C001');

--
-- Table structure for table `rooms`
--
-- This table represents individual, physical rooms in the hotel.
-- It links to a room type via the `roomTypeId`.
--
CREATE TABLE IF NOT EXISTS `rooms` (
  `id` VARCHAR(10) NOT NULL PRIMARY KEY, -- The physical room number, e.g., "101", "205A"
  `roomTypeId` VARCHAR(50) NOT NULL,
  `status` ENUM('Available', 'Booked', 'Under Maintenance', 'Cleaning') NOT NULL DEFAULT 'Available',
  `notes` TEXT,
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `companyId` VARCHAR(50) NOT NULL,
  FOREIGN KEY (`roomTypeId`) REFERENCES `room_types`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `rooms`
--
INSERT INTO `rooms` (`id`, `roomTypeId`, `status`, `companyId`) VALUES
('101', 'RT001', 'Available', 'C001'),
('102', 'RT001', 'Booked', 'C001'),
('201', 'RT002', 'Available', 'C001'),
('301', 'RT003', 'Under Maintenance', 'C001');
