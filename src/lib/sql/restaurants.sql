-- =================================================================
--
-- This SQL script creates the tables for the Restaurant Management
-- feature of the hotel administration application.
--
-- It includes:
--   1. `restaurants` table to store venue details.
--   2. `restaurant_features` table to store available features.
--   3. `restaurant_feature_pivot` to link restaurants and features.
--
-- =================================================================

--
-- Table structure for table `restaurants`
--
CREATE TABLE `restaurants` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `restaurant_id` VARCHAR(255) NOT NULL UNIQUE COMMENT 'A unique string identifier for the restaurant, e.g., "main-restaurant"',
  `name` VARCHAR(255) NOT NULL,
  `description` TEXT,
  `capacity` INT,
  `status` ENUM('Active', 'Inactive', 'Seasonal') DEFAULT 'Active',
  `operating_hours` JSON COMMENT 'Stores operating hours, e.g., {"Monday": {"open": "09:00", "close": "22:00"}}',
  `images_url` TEXT COMMENT 'Stores a JSON array of image URLs',
  `company_id` VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_by` VARCHAR(255),
  `updated_by` VARCHAR(255)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Table structure for table `restaurant_features`
--
CREATE TABLE `restaurant_features` (
  `id` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `feature_id` varchar(255) NOT NULL UNIQUE,
  `feature_name` varchar(255) NOT NULL,
  `company_id` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `created_by` varchar(255) DEFAULT NULL,
  `updated_by` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Table structure for pivot table `restaurant_feature_pivot`
-- This table creates a many-to-many relationship between restaurants and features.
--
CREATE TABLE `restaurant_feature_pivot` (
    `restaurant_table_id` INT NOT NULL,
    `feature_table_id` INT NOT NULL,
    PRIMARY KEY (`restaurant_table_id`, `feature_table_id`),
    FOREIGN KEY (`restaurant_table_id`) REFERENCES `restaurants`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`feature_table_id`) REFERENCES `restaurant_features`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

