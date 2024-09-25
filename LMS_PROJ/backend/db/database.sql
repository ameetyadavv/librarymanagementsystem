CREATE DATABASE LibraryDB;

USE LibraryDB;

CREATE TABLE Users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    membership_type ENUM('6 months', '1 year', '2 years') NOT NULL DEFAULT '6 months',
    is_admin BOOLEAN DEFAULT FALSE
);

CREATE TABLE Books (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(100) NOT NULL,
    type ENUM('book', 'movie') NOT NULL DEFAULT 'book',
    available BOOLEAN DEFAULT TRUE
);

CREATE TABLE Transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    book_id INT,
    issue_date DATE,
    return_date DATE,
    fine DECIMAL(10, 2) DEFAULT 0.00,
    FOREIGN KEY (user_id) REFERENCES Users(id),
    FOREIGN KEY (book_id) REFERENCES Books(id)
);


ALTER TABLE Users ADD COLUMN password VARCHAR(255);