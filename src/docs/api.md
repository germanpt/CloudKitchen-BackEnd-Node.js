# Cloud Kitchen API Documentation

Welcome to the Cloud Kitchen Backend API documentation. This project provides a comprehensive set of APIs for managing chefs, customers, meals, orders, and AI-powered branding.

## Base URL
`http://localhost:3000/api`

---

## 1. Authentication Module
Handles user registration, login, and session retrieval.

### Register User
Create a new account (Chef, Customer, or Admin).

- **URL:** `/auth/register`
- **Method:** `POST`
- **Auth Required:** No
- **Mandatory Fields:** `email`, `password`, `role`, `firstName`, `lastName`
- **Optional Fields:** `phone`
- **Request Body Example:**
```json
{
  "email": "chef@example.com",
  "password": "password123",
  "role": "chef",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "01234567890"
}
```
- **Success Response:**
```json
{
  "success": true,
  "statusCode": 201,
  "data": { "user": { ... }, "token": "..." },
  "message": "User registered successfully"
}
```

### Login User
Authenticate and receive a JWT token.

- **URL:** `/auth/login`
- **Method:** `POST`
- **Auth Required:** No
- **Mandatory Fields:** `email`, `password`, `role`
- **Request Body Example:**
```json
{
  "email": "chef@example.com",
  "password": "password123",
  "role": "chef"
}
```
- **Success Response:**
```json
{
  "success": true,
  "statusCode": 200,
  "data": { "user": { ... }, "token": "..." },
  "message": "Logged in successfully"
}
```

### Get Current User
Retrieve profile of the authenticated user.

- **URL:** `/auth/me`
- **Method:** `GET`
- **Auth Required:** Yes (Bearer Token)
- **Success Response:**
```json
{
  "success": true,
  "statusCode": 200,
  "data": { ... },
  "message": "User retrieved successfully"
}
```

---

## 2. Chef Profile Module
Manage chef-specific details and branding.

### Update Profile
Update chef's kitchen details and personal info.

- **URL:** `/chefs/profile`
- **Method:** `PUT`
- **Auth Required:** Yes (Chef role)
- **Optional Fields:** `firstName`, `lastName`, `phone`, `kitchenName`, `slogan`, `description`
- **Request Body Example:**
```json
{
  "kitchenName": "Mario's Italian Kitchen",
  "slogan": "The taste of Rome",
  "description": "Authentic homemade pasta and sauces."
}
```

### Generate AI Kitchen Branding
Get AI-generated suggestions for kitchen name, slogan, and description.

- **URL:** `/chefs/kitchen-branding`
- **Method:** `POST`
- **Auth Required:** Yes (Chef role)
- **Mandatory Fields:** `cookingStyles` (Array), `signatureDish`, `story`
- **Request Body Example:**
```json
{
  "cookingStyles": ["Italian", "Mediterranean"],
  "signatureDish": "Seafood Risotto",
  "story": "I spent 10 years in coastal Italy learning traditional recipes."
}
```
- **Success Response:**
```json
{
  "success": true,
  "statusCode": 200,
  "data": {
    "kitchenNames": "...",
    "slogans": "...",
    "description": "..."
  }
}
```

---

## 3. Chef Verification Module
Submit and manage identity verification documents.

### Submit Verification Request
Upload documents for admin review. Uses local storage.

- **URL:** `/verification-request`
- **Method:** `POST`
- **Auth Required:** Yes (Chef role)
- **Body Type:** `multipart/form-data`
- **Mandatory Files:** 
  - `nationalIdImage` (1 file)
  - `healthCertificateImage` (1 file)
- **Success Response:** Returns relative paths to stored files and `pending` status.

### Get Verification Status
Check the status of your verification request.

- **URL:** `/verification-request/status`
- **Method:** `GET`
- **Auth Required:** Yes (Chef role)
- **Success Response:**
```json
{
  "success": true,
  "data": {
    "status": "pending",
    "nationalIdImage": "http://localhost:3000/uploads/chef-verifications/...",
    "healthCertificateImage": "http://localhost:3000/uploads/chef-verifications/..."
  }
}
```

### Update Status (Admin Only)
Admin can approve or fail a verification request.

- **URL:** `/verification-request/:id/status`
- **Method:** `PATCH`
- **Auth Required:** Yes (Admin role)
- **Mandatory Fields:** `status` (`pending`, `approved`, `failed`)
- **Request Body Example:**
```json
{ "status": "approved" }
```

---

## 4. Meals Module
Full CRUD for managing kitchen meals.

### Get All Meals
Retrieve all active meals (supports filtering via query params).

- **URL:** `/meals`
- **Method:** `GET`
- **Auth Required:** No

### Get Meal By ID
Retrieve details of a specific meal.

- **URL:** `/meals/:id`
- **Method:** `GET`
- **Auth Required:** No

### Create Meal
Add a new meal to the kitchen.

- **URL:** `/meals`
- **Method:** `POST`
- **Auth Required:** Yes (Chef role)
- **Body Type:** `multipart/form-data`
- **Mandatory Fields:** `name`, `description`, `price`, `category`, `mealImages` (1-3 files)
- **Optional Fields:** `ingredients` (JSON Array string)
- **Success Response:** Returns meal details with full image URLs.

### Update Meal
Update an existing meal.

- **URL:** `/meals/:id`
- **Method:** `PUT`
- **Auth Required:** Yes (Chef owner only)
- **Body Type:** `multipart/form-data`
- **Optional Fields:** All creation fields.

### Delete Meal
Remove a meal from the kitchen.

- **URL:** `/meals/:id`
- **Method:** `DELETE`
- **Auth Required:** Yes (Chef owner only)

### Update Meal Status
Toggle meal visibility.

- **URL:** `/meals/:id/status`
- **Method:** `PATCH`
- **Auth Required:** Yes (Chef owner only)
- **Mandatory Fields:** `status` (`active`, `inactive`)

---

## Common Error Responses

### 400 Bad Request
Missing fields or validation error.
```json
{
  "success": false,
  "message": "Missing required fields",
  "missingFields": ["email"]
}
```

### 401 Unauthorized
Invalid or missing token.
```json
{
  "success": false,
  "message": "Not authorized, token missing"
}
```

### 403 Forbidden
Role mismatch or ownership violation.
```json
{
  "success": false,
  "message": "You are not authorized to update this meal"
}
```

### 404 Not Found
Resource does not exist.
```json
{
  "success": false,
  "message": "Meal not found"
}
```
