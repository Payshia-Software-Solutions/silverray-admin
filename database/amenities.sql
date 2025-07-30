-- =================================================================
-- SQL Script for creating Amenities and Room-to-Amenity links
-- =================================================================

--
-- Table structure for table `amenities`
-- Description: Stores the master list of all available amenities.
--
CREATE TABLE `amenities` (
  `id` varchar(50) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `icon` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


--
-- Table structure for table `room_amenities`
-- Description: A join table to create a many-to-many relationship
--              between the `rooms` table and the `amenities` table.
--
CREATE TABLE `room_amenities` (
  `room_id` varchar(10) NOT NULL,
  `amenity_id` varchar(50) NOT NULL,
  PRIMARY KEY (`room_id`,`amenity_id`),
  KEY `amenity_id` (`amenity_id`),
  CONSTRAINT `room_amenities_ibfk_1` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `room_amenities_ibfk_2` FOREIGN KEY (`amenity_id`) REFERENCES `amenities` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


--
-- Sample data for table `amenities`
-- Description: Inserts the default amenities shown in the application UI.
--
INSERT INTO `amenities` (`id`, `name`, `description`, `icon`) VALUES
('climate-control', 'Climate Control', 'Individually controlled air conditioning and heating.', 'thermometer'),
('high-speed-wifi', 'High-speed Wi-Fi', 'Complimentary high-speed wireless internet access.', 'wifi'),
('in-room-safe', 'In-room Safe', 'Secure safe for storing valuables.', 'safe'),
('king-bed', 'King-size Bed', 'Spacious and comfortable king-size bed.', 'bed-double'),
('luxury-linens', 'Luxury Linens', 'High-thread-count premium bed linens.', 'sheets'),
('mini-bar', 'Mini Bar', 'Stocked mini-bar with a selection of beverages and snacks.', 'glass-water'),
('nespresso', 'Nespresso Machine', 'In-room Nespresso machine with complimentary capsules.', 'coffee'),
('private-balcony', 'Private Balcony', 'Private balcony with outdoor seating.', 'sun'),
('rain-shower', 'Rain Shower', 'Luxurious walk-in rain shower.', 'shower-head'),
('room-service', 'Room Service', '24/7 in-room dining service.', 'utensils-crossed'),
('smart-tv', '55" Smart TV', 'Large flat-screen Smart TV with streaming services.', 'tv'),
('work-desk', 'Work Desk', 'Dedicated work space with a desk and chair.', 'briefcase');

