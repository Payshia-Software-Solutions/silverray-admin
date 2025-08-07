
CREATE TABLE wedding_packages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    package_name VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'Active',
    short_description TEXT,
    detailed_description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    max_guests INT,
    inclusions JSON,
    associated_hall_ids TEXT,
    image_urls JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
