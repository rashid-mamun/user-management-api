CREATE DATABASE IF NOT EXISTS user_app;
USE user_app;

CREATE TABLE profiles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  firstName VARCHAR(255) NOT NULL,
  lastName VARCHAR(255) NOT NULL,
  nid INT NOT NULL,
  profilePhoto VARCHAR(255),
  age INT NOT NULL,
  currentMaritalStatus ENUM('single', 'married', 'divorced', 'widowed') NOT NULL
);

CREATE TABLE auths (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  auth_token VARCHAR(255),
  profileId INT NOT NULL,
  FOREIGN KEY (profileId) REFERENCES profiles(id) ON DELETE CASCADE
);