-- This SQL script creates the `hall_bookings` table to manage event and wedding hall reservations.
--
-- Table structure for `hall_bookings`
--

CREATE TABLE `hall_bookings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `booking_id` varchar(50) NOT NULL,
  `hall_id` varchar(50) NOT NULL,
  `customer_id` varchar(50) NOT NULL,
  `company_id` varchar(50) NOT NULL,
  `event_date` date NOT NULL,
  `start_time` time NOT NULL,
  `end_time` time NOT NULL,
  `number_of_guests` int(11) NOT NULL,
  `total_amount` decimal(10,2) NOT NULL,
  `amount_paid` decimal(10,2) DEFAULT 0.00,
  `balance_due` decimal(10,2) GENERATED ALWAYS AS (`total_amount` - `amount_paid`) STORED,
  `payment_status` enum('Paid','Pending','Due') NOT NULL DEFAULT 'Pending',
  `booking_status` enum('Confirmed','Pending','Cancelled','Completed') NOT NULL DEFAULT 'Pending',
  `special_requests` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `created_by` varchar(50) DEFAULT NULL,
  `updated_by` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `booking_id` (`booking_id`),
  KEY `hall_id` (`hall_id`),
  KEY `customer_id` (`customer_id`),
  KEY `company_id` (`company_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
