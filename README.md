---

# Product Historic Changes System

## Overview

The Product Historic Changes System is a full-stack application developed using NestJS for the backend and connecting to a database of your choice. The main functionality of this system is to track changes made to fields in a collection and display them visually in the frontend. It implements a historical changes system that ensures all operations related to product changes are executed within a transaction, and it uniformly handles responses and errors across the application.

## Features

- **Historical Changes Tracking**: Tracks changes made to fields in a collection and stores them efficiently and securely in the database.
- **Transaction Management**: Uses interceptors to manage transactions for product change operations, ensuring all operations are executed within a transaction.
- **Uniform Response Handling**: Utilizes interceptors to handle responses and errors uniformly, providing consistent feedback to the user.
- **Swagger Documentation**: Automatically generates API documentation using Swagger for easy reference and testing of endpoints.
- **TypeScript**: Written entirely in TypeScript, ensuring type safety and improved development experience.
- **Design Patterns**: Implements various design patterns, including interceptors, facades, and dependency injection, showcasing understanding of software architecture principles.
- **SOLID Principles**: Adheres to SOLID principles in code design and implementation for improved maintainability and scalability.
---

## Installation

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/your-username/product-historic-changes-system.git
   ```

2. **Install Dependencies**:

   ```bash
   cd product-historic-changes-system
   npm install
   ```

3. **Set Environment Variables**:

   Create a `.env` file in the root directory and configure the following environment variables:

   ```plaintext
   # Server Configuration
   PORT=3000

   # Database Configuration
   DATABASE_HOST=your-database-host
   DATABASE_PORT=your-database-port
   DATABASE_USER=your-database-user
   DATABASE_PASSWORD=your-database-password
   DATABASE_NAME=your-database-name

   # JWT Configuration
   JWT_SECRET=your-jwt-secret
   ```

   Replace `your-database-host`, `your-database-port`, `your-database-user`, `your-database-password`, and `your-database-name` with the appropriate values for your database configuration. Additionally, replace `your-jwt-secret` with your preferred JWT secret key.

4. **Start the Application**:

   ```bash
   npm start
   ```

5. **Access the Application**:

   Open your web browser and navigate to `http://localhost:3000` to access the application.


## API Documentation

### Endpoints

1. **GET /products**
   - Retrieves a list of all products.
   - Parameters: None
   - Returns: Array of product objects.

2. **GET /products/:id**
   - Retrieves a specific product by its ID.
   - Parameters: Product ID in the URL path.
   - Returns: Details of the specified product.

3. **POST /products**
   - Creates a new product.
   - Parameters: Product data in the request body.
   - Returns: Details of the newly created product.

4. **PUT /products/:id**
   - Updates an existing product.
   - Parameters: Product ID in the URL path, updated product data in the request body.
   - Returns: Details of the updated product.

5. **GET /products/:productId/history**
   - Retrieves the historical changes for a specific product.
   - Parameters: Product ID in the URL path.
   - Returns: Array of historical change records for the specified product.

6. **GET /products/:productId/history/filter**
   - Retrieves historical changes for a specific product and field.
   - Parameters: Product ID in the URL path, field name in the query parameters.
   - Returns: Array of historical change records for the specified product and field.

### Authentication

- The API utilizes JWT (JSON Web Tokens) for authentication.
- Certain endpoints may require authentication to access, while others may be publicly accessible.
- Users can obtain a JWT token by logging in or registering with the application.

---

This overview provides a brief summary of the available endpoints, error handling approach, authentication mechanism, and the format of requests and responses in your API.
        

## Folder Structure

```
product-historic-changes-system/
├── src/
│   ├── controllers/
│   ├── dto/
│   ├── entities/
│   ├── facades/
│   ├── interceptors/
│   ├── middlewares/
│   ├── providers/
│   ├── services/
│   ├── app.module.ts
│   └── main.ts
├── test/
├── logs/
├── .env
├── .gitignore
├── package.json
└── README.md
```

## Contributing

Contributions are welcome! Feel free to fork the repository, make changes, and submit pull requests for review.

## License

This project is licensed under the [MIT License](LICENSE).

---

Feel free to customize the README.md file further based on your specific requirements and preferences.
