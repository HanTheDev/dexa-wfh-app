CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL, -- bcrypt hash
    full_name VARCHAR(100) NOT NULL,
    role ENUM('admin', 'employee') DEFAULT 'employee',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table: employees (master data karyawan)
CREATE TABLE employees (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT UNIQUE NOT NULL,
    employee_code VARCHAR(20) UNIQUE NOT NULL,
    position VARCHAR(100),
    department VARCHAR(100),
    phone VARCHAR(20),
    address TEXT,
    join_date DATE,
    photo_url VARCHAR(255), -- foto profile karyawan
    status ENUM('active', 'inactive', 'resigned') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_employee_code (employee_code),
    INDEX idx_status (status),
    INDEX idx_department (department)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table: attendances (data absensi)
CREATE TABLE attendances (
    id INT PRIMARY KEY AUTO_INCREMENT,
    employee_id INT NOT NULL,
    date DATE NOT NULL,
    clock_in DATETIME NOT NULL,
    clock_out DATETIME,
    photo_url VARCHAR(255) NOT NULL, -- foto bukti WFH
    notes TEXT,
    work_duration INT, -- dalam menit, calculated saat clock out
    status ENUM('present', 'late', 'absent') DEFAULT 'present',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE,
    UNIQUE KEY unique_employee_date (employee_id, date), -- prevent double attendance
    INDEX idx_date (date),
    INDEX idx_employee_date (employee_id, date),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- SEED DATA (untuk testing)
INSERT INTO users (email, password, full_name, role) VALUES
('admin@dexa.com', '$2b$10$rZ5fGzEKZ8pY.zP0xJxH5OYH8qQqJ8gYqZxZ5fGzEKZ8pY.zP0xJxH', 'Admin HRD', 'admin'),
('john.doe@dexa.com', '$2b$10$aZ5fGzEKZ8pY.zP0xJxH5OYH8qQqJ8gYqZxZ5fGzEKZ8pY.zP0xJxH', 'John Doe', 'employee'),
('jane.smith@dexa.com', '$2b$10$aZ5fGzEKZ8pY.zP0xJxH5OYH8qQqJ8gYqZxZ5fGzEKZ8pY.zP0xJxH', 'Jane Smith', 'employee');

INSERT INTO employees (user_id, employee_code, position, department, phone, join_date, status) VALUES
(2, 'EMP001', 'Software Engineer', 'IT', '081234567890', '2024-01-15', 'active'),
(3, 'EMP002', 'Product Manager', 'Product', '081234567891', '2024-02-01', 'active');
