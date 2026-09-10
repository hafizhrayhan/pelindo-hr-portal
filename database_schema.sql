-- DDL: Membuat tabel untuk Sistem Manajemen Cuti Pegawai
CREATE TABLE departments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE employees (
    id VARCHAR(20) PRIMARY KEY,
    full_name VARCHAR(150) NOT NULL,
    department_id INT,
    annual_leave_quota INT DEFAULT 12,
    FOREIGN KEY (department_id) REFERENCES departments(id)
);

CREATE TABLE leave_requests (
    id VARCHAR(50) PRIMARY KEY,
    employee_id VARCHAR(20) NOT NULL,
    leave_type ENUM('Cuti Tahunan', 'Izin Sakit', 'Izin Khusus') NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    reason TEXT,
    status ENUM('Pending', 'Approved', 'Rejected') DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employees(id)
);

-- DML: Contoh Query Join untuk melihat data di Dashboard HR
SELECT 
    lr.id AS request_id, 
    e.full_name, 
    d.name AS department, 
    lr.leave_type, 
    lr.status 
FROM leave_requests lr
JOIN employees e ON lr.employee_id = e.id
JOIN departments d ON e.department_id = d.id
WHERE lr.status = 'Pending'
ORDER BY lr.created_at DESC;