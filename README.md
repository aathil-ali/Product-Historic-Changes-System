Sure, here's a detailed README.md file for your Nest.js application:

```
# My Nest.js Application

## Description

This is a Nest.js application for managing products. It includes user authentication, product management, and product change history functionalities.

## Installation

### Prerequisites

- Node.js (version >= 12.0.0)
- npm (version >= 6.0.0)
- MySQL database server

### Steps

1. Clone the repository:

   ```bash
   git clone <repository-url>
   ```

2. Navigate to the project directory:

   ```bash
   cd my-nest-app
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Create a `.env` file in the root directory of the project with the following environment variables:

   ```plaintext
   DB_HOST=localhost
   DB_PORT=3306
   DB_USERNAME=root
   DB_PASSWORD=password
   DB_DATABASE=product
   DATABASE_TYPE=mysql
   JWT_KEY="eGBOG71bm8jzjsYAszOOPzuIfs"
   DEBUG=typeorm
   ```

   Adjust the values according to your database configuration and JWT secret key.

5. Start the application:

   ```bash
   npm start
   ```

   Alternatively, you can run the application in development mode with hot-reload:

   ```bash
   npm run start:dev
   ```

   The application will be running at `http://localhost:3000`.

## Usage

### User Authentication

- Register a new user: `POST /auth/register`
- Login with a registered user: `POST /auth/login`

### Product Management

- Get all products: `GET /products`
- Get a product by ID: `GET /products/:id`
- Create a new product: `POST /products`
- Update a product by ID: `PUT /products/:id`

### Product Change History

- Get historical changes for a specific product: `GET /products/:productId/history`
- Get historical changes for a specific product and field: `GET /products/:productId/history/filter`

## Testing

Unit tests and integration tests are available in the `test` directory. You can run the tests using the following command:

```bash
npm test
```

## Contributing

Contributions are welcome! Feel free to submit bug reports, feature requests, or pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
```

Replace `<repository-url>` with the URL of your Git repository. Adjust the content and instructions according to your application's specifics.