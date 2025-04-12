# User Management API

A Node.js application using Express and MySQL for user registration, login, profile management, and account deletion.

---

## 🚀 Features

- **Registration**: Create a user with a profile photo (JPEG/PNG).
- **Login**: Authenticate and receive a JWT token.
- **Update**: Modify own profile data, including photo.
- **Delete**: Remove own account.
- **Profile View**: View own profile (excludes password).
- **Security**: Password hashing with bcrypt, JWT authentication, restricted access to own data.
- **Storage**: Local photo storage in `Uploads/`.
- **Database**: MySQL with transactions for data consistency.

---

## 🛠️ Tech Stack

- **Backend**: Node.js, Express
- **Database**: MySQL
- **Tools**:
  - Multer (file uploads)
  - bcrypt (password hashing)
  - jsonwebtoken (authentication)
  - Joi (input validation)
- **Deployment**: Docker, Docker Compose

---

## 📦 Prerequisites

- [Node.js](https://nodejs.org) (v18 or later)
- [MySQL](https://www.mysql.com) (v8.0 or later)
- [Docker](https://www.docker.com) (optional, for containerized setup)
- [Docker Compose](https://docs.docker.com/compose/) (optional)
- [Git](https://git-scm.com)

---

## ⚙️ Setup (Local)

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/user-management-api.git
   cd user-management-api
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Copy `.env.example` to `.env` and update with your MySQL credentials:
   ```env
   PORT=3000
   DATABASE_HOST=localhost
   DATABASE_PORT=3306
   DATABASE=user_app
   DATABASE_USERNAME=your_mysql_username
   DATABASE_PASSWORD=your_mysql_password
   JWT_SECRET=your_jwt_secret
   IMAGE_FOLDER=Uploads
   ```

4. **Set up MySQL**
   - Start your local MySQL server:
     ```bash
     sudo service mysql start  # Linux
     # or
     brew services start mysql  # macOS
     ```
   - Create the database and tables by running `init.sql`:
     ```bash
     mysql -u your_mysql_username -p < init.sql
     ```
     This creates the `user_app` database and `profiles`/`auths` tables. Alternatively, execute these commands manually:
     ```sql
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
     ```

5. **Prepare uploads folder**
   ```bash
   mkdir Uploads
   touch Uploads/.gitkeep
   ```

6. **Start the server**
   ```bash
   npm start
   ```
   The app will connect to MySQL and start at `http://localhost:3000`.

---

## 🐳 Setup (Docker)

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/user-management-api.git
   cd user-management-api
   ```

2. **Set up environment variables**
   Copy `.env.example` to `.env` and set `DATABASE_PASSWORD` and `JWT_SECRET`:
   ```env
   PORT=3000
   DATABASE_HOST=mysql
   DATABASE_PORT=3306
   DATABASE=user_app
   DATABASE_USERNAME=root
   DATABASE_PASSWORD=your_mysql_password
   JWT_SECRET=your_jwt_secret
   IMAGE_FOLDER=Uploads
   ```

3. **Run Docker Compose**
   ```bash
   docker-compose up --build
   ```
   This starts the app and MySQL containers, with `init.sql` automatically creating the database schema.

4. **Access the app**
   Visit: [http://localhost:3000](http://localhost:3000)

5. **Stop the containers**
   ```bash
   docker-compose down
   ```

---

## 📡 API Endpoints

All responses follow this structure:
```json
{
  "isSuccess": boolean,
  "message": string,
  "data": object | null
}
```

### 🔐 Register
**POST** `/register`  
**Content-Type**: `multipart/form-data`  
**Body**:
- `firstName` (string, required)
- `lastName` (string, required)
- `email` (string, email format, required)
- `password` (string, 3-30 alphanumeric characters, required)
- `nid` (integer, required)
- `age` (integer, ≥18, required)
- `currentMaritalStatus` (enum: `single`, `married`, `divorced`, `widowed`, required)
- `avatar` (file, JPEG/PNG, optional)

**Example**:
```bash
curl -X POST http://localhost:3000/register \
  -F "firstName=John" \
  -F "lastName=Doe" \
  -F "email=john@example.com" \
  -F "password=pass123" \
  -F "nid=123456" \
  -F "age=30" \
  -F "currentMaritalStatus=single" \
  -F "avatar=@/path/to/photo.jpg"
```

**Response** (200 OK):
```json
{
  "isSuccess": true,
  "message": "Record created successfully",
  "data": {
    "profileId": 1,
    "authToken": "jwt-token"
  }
}
```

### 🔑 Login
**POST** `/login`  
**Content-Type**: `application/json`  
**Body**:
```json
{
  "email": "john@example.com",
  "password": "pass123"
}
```

**Example**:
```bash
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"pass123"}'
```

**Response** (200 OK):
```json
{
  "isSuccess": true,
  "message": "Login successful",
  "data": {
    "accessToken": "jwt-token"
  }
}
```

### 👁️ View Profile
**GET** `/users/:id`  
**Headers**: `Authorization: Bearer <jwt-token>`

**Example**:
```bash
curl -X GET http://localhost:3000/users/1 \
  -H "Authorization: Bearer <jwt-token>"
```

**Response** (200 OK):
```json
{
  "isSuccess": true,
  "message": "Profile retrieved successfully",
  "data": {
    "id": 1,
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "nid": 123456,
    "age": 30,
    "currentMaritalStatus": "single",
    "profilePhoto": "photo-123456.jpg"
  }
}
```

### ✏️ Update Profile
**PUT** `/users/:id`  
**Headers**: `Authorization: Bearer <jwt-token>`  
**Content-Type**: `multipart/form-data`  
**Body**:
- `firstName` (string, optional)
- `lastName` (string, optional)
- `nid` (integer, optional)
- `age` (integer, optional)
- `currentMaritalStatus` (enum, optional)
- `avatar` (file, JPEG/PNG, optional)

**Example**:
```bash
curl -X PUT http://localhost:3000/users/1 \
  -H "Authorization: Bearer <jwt-token>" \
  -F "firstName=Jane" \
  -F "lastName=Doe" \
  -F "nid=123456" \
  -F "age=31" \
  -F "currentMaritalStatus=married" \
  -F "avatar=@/path/to/new-photo.jpg"
```

**Response** (200 OK):
```json
{
  "isSuccess": true,
  "message": "User updated successfully",
  "data": null
}
```

### ❌ Delete Account
**DELETE** `/users/:id`  
**Headers**: `Authorization: Bearer <jwt-token>`

**Example**:
```bash
curl -X DELETE http://localhost:3000/users/1 \
  -H "Authorization: Bearer <jwt-token>"
```

**Response** (200 OK):
```json
{
  "isSuccess": true,
  "message": "User deleted successfully",
  "data": null
}
```

### 🖼️ Update Profile Picture
**POST** `/users/image/:id`  
**Headers**: `Authorization: Bearer <jwt-token>`  
**Content-Type**: `multipart/form-data`  
**Body**:
- `avatar` (file, JPEG/PNG, required)

**Example**:
```bash
curl -X POST http://localhost:3000/users/image/1 \
  -H "Authorization: Bearer <jwt-token>" \
  -F "avatar=@/path/to/photo.jpg"
```

**Response** (200 OK):
```json
{
  "isSuccess": true,
  "message": "Profile picture updated successfully",
  "data": null
}
```

---

## 🧪 Testing

Use tools like:
- [Postman](https://www.postman.com)
- `curl`

**Steps**:
1. Register a user with a photo.
2. Login to get a JWT token.
3. Use the token to view, update, or delete the profile.
4. Test photo upload separately.

**Error Responses**:
- **400 Bad Request**: Invalid input (e.g., missing fields, wrong file type).
- **401 Unauthorized**: Missing or invalid JWT.
- **403 Forbidden**: Attempting to access another user’s data.
- **404 Not Found**: User ID doesn’t exist.
- **500 Internal Server Error**: Database or server issues.

---

## 📌 Notes

- **Uploads**: Photos are stored in `Uploads/` (persisted via Docker volume).
- **Security**: JWT tokens are verified against the database; passwords are hashed with bcrypt.
- **Database**: Transactions ensure data consistency for registration.
- **Routes**: No `/api` prefix; endpoints are `/register`, `/login`, `/users/:id`, etc.
- **Local Setup**: Requires manual database initialization (`init.sql` or SQL commands).
- **Docker**: Automatically initializes the database via `init.sql`.

---

## 📚 References

- [REST API Best Practices](https://stackoverflow.blog/2020/03/02/best-practices-for-rest-api-design/)
- [JavaScript Clean Code](https://github.com/ryanmcdermott/clean-code-javascript)
- [HTTP Status Codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)
- [Express.js](https://expressjs.com)
- [MySQL](https://dev.mysql.com/doc/)
- [Docker Compose](https://docs.docker.com/compose/)