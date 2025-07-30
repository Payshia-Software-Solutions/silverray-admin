-- This script creates the tables necessary for managing room amenities.

--
-- Table structure for table `amenities`
--
-- This table stores a master list of all available amenities.
--
CREATE TABLE `amenities` (
  `id` VARCHAR(255) NOT NULL PRIMARY KEY COMMENT 'Unique identifier for the amenity (e.g., "king-bed")',
  `name` VARCHAR(255) NOT NULL COMMENT 'Display name of the amenity (e.g., "King-size Bed")',
  `description` TEXT NULL COMMENT 'Optional detailed description of the amenity.',
  `icon` VARCHAR(255) NULL COMMENT 'Optional icon name from a library like Lucide (e.g., "wifi").',
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Master list of all hotel amenities';

--
-- Table structure for table `room_amenities`
--
-- This is a join table to create a many-to-many relationship
-- between rooms and their assigned amenities.
--
CREATE TABLE `room_amenities` (
  `roomId` VARCHAR(255) NOT NULL COMMENT 'Foreign key to the rooms table.',
  `amenityId` VARCHAR(255) NOT NULL COMMENT 'Foreign key to the amenities table.',
  PRIMARY KEY (`roomId`, `amenityId`),
  FOREIGN KEY (`roomId`) REFERENCES `rooms`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (`amenityId`) REFERENCES `amenities`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Links rooms to their amenities';

--
-- Sample data for the `amenities` table
--
INSERT INTO `amenities` (`id`, `name`, `icon`) VALUES
('king-bed', 'King-size Bed', 'bed-double'),
('rain-shower', 'Rain Shower', 'shower-head'),
('luxury-linens', 'Luxury Linens', 'gem'),
('high-speed-wifi', 'High-speed Wi-Fi', 'wifi'),
('private-balcony', 'Private Balcony', 'sun'),
('nespresso', 'Nespresso Machine', 'coffee'),
('climate-control', 'Climate Control', 'thermometer'),
('smart-tv', '55" Smart TV', 'tv'),
('in-room-safe', 'In-room Safe', 'safe'),
('mini-bar', 'Mini Bar', 'glass-water'),
('work-desk', 'Work Desk', 'briefcase'),
('room-service', 'Room Service', 'concierge-bell');
