
# Ticket Booking System Backend

Express + TypeScript backend for authentication and ticket booking APIs.

## 1. Project Setup

### Clone and install

```bash
git clone <your-repo-url>
cd "TIcket booking system"
pnpm install
```

### Environment variables

Create a .env file in project root:

```env
DATABASE_URL=your_neon_or_postgres_connection_string
JWT_ACCESS_SECRET=your_super_secret_key
```

### Push database schema

```bash
pnpm db:push
```

### Run in development

```bash
pnpm dev
```

Server runs on:

```text
http://localhost:3000
```

## 2. Auth Endpoints

Base path:

```text
/auth
```

### Register user

Method and path:

```text
POST /auth/register
```

Request body:

```json
{
	"name": "Gourav",
	"email": "gourav@example.com",
	"password": "your-password"
}
```

Success response:

```json
{
	"success": true,
	"message": "register done successfully",
	"data": {
		"user": {
			"name": "Gourav",
			"email": "gourav@example.com"
		}
	}
}
```

Duplicate email response:

```json
{
	"success": false,
	"message": "User already exists"
}
```

### Login user

Method and path:

```text
POST /auth/login
```

Request body:

```json
{
	"email": "gourav@example.com",
	"password": "your-password"
}
```

Success response:

```json
{
	"success": true,
	"message": "login successful",
	"data": {
		"token": "jwt-token-here"
	}
}
```

## 3. How Auth Works (Precise Flow)

### Register flow

1. Client sends POST /auth/register with name, email, password.
2. Zod validation checks request body shape.
3. Service hashes the password using bcrypt.
4. Service inserts user into users table.
5. If email already exists, database unique constraint throws error 23505.
6. Service maps this to HTTP 409 Conflict with message User already exists.
7. Controller sends HTTP 201 Created for successful registration.

### Login flow

1. Client sends POST /auth/login with email and password.
2. Zod validates input.
3. Service fetches user by email.
4. Service compares plain password with hashed password using bcrypt.compare.
5. If password is valid, service creates JWT access token.
6. Controller returns HTTP 200 with token.

### Protected route flow

1. Client sends Authorization header:

```text
Authorization: Bearer <token>
```

2. Auth middleware extracts token from header.
3. Middleware verifies token using JWT_ACCESS_SECRET.
4. If valid, request proceeds to protected controller.
5. If invalid or expired, API returns unauthorized response.

## 4. Quick API Test (cURL)

### Register

```bash
curl -X POST http://localhost:3000/auth/register \
	-H "Content-Type: application/json" \
	-d '{
		"name": "Gourav",
		"email": "gourav@example.com",
		"password": "12345678"
	}'
```

### Login

```bash
curl -X POST http://localhost:3000/auth/login \
	-H "Content-Type: application/json" \
	-d '{
		"email": "gourav@example.com",
		"password": "12345678"
	}'
```

### Access protected route

```bash
curl -X GET http://localhost:3000/dashboard \
	-H "Authorization: Bearer <paste-token>"
```

## 5. Important Notes

- Passwords are not stored in plain text. They are hashed with bcrypt before saving.
- Duplicate email protection is enforced by the database unique constraint on users.email.
- JWT token lifetime is currently 30 minutes.
