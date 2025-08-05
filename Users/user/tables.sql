
-- Main table to store information about each dining venue
CREATE TABLE `restaurants` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `venue_id` VARCHAR(255) NOT NULL UNIQUE, -- e.g., "main-restaurant"
  `name` VARCHAR(255) NOT NULL,
  `description` TEXT,
  `capacity` INT,
  `status` ENUM('Active', 'Inactive', 'Seasonal') DEFAULT 'Inactive',
  `operating_hours` JSON, -- Storing as JSON for structured data e.g., {"Monday": {"open": "09:00", "close": "22:00"}, ...}
  `images` JSON, -- Storing as JSON array of objects e.g., [{"src": "url", "alt": "text"}, ...]
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table to store all possible features/amenities for restaurants
CREATE TABLE `restaurant_features` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `feature_id` VARCHAR(255) NOT NULL UNIQUE, -- e.g., "ocean-view"
  `feature_name` VARCHAR(255) NOT NULL,
  `description` TEXT,
  `is_active` BOOLEAN DEFAULT TRUE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Pivot table to link restaurants with their features (many-to-many relationship)
CREATE TABLE `restaurant_feature_pivot` (
  `restaurant_id` INT NOT NULL,
  `feature_id` INT NOT NULL,
  PRIMARY KEY (`restaurant_id`, `feature_id`),
  FOREIGN KEY (`restaurant_id`) REFERENCES `restaurants`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`feature_id`) REFERENCES `restaurant_features`(`id`) ON DELETE CASCADE
);

