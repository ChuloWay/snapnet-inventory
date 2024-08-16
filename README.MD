# Snapnet Inventory

Snapnet Inventory is a backend service built with Node.js, Express, and Sequelize, using Mysql for managing inventory services.

## Installation

To set up the project locally, follow these steps:

1. **Clone the Repository**:

    ```sh
    git clone https://github.com/ChuloWay/snapnet-inventory
    cd snapnet-inventory
    ```

2. **Install Dependencies**:

    Make sure you have Node.js and npm installed. Then, install the necessary dependencies:

    ```sh
    npm install
    ```

3. **Create an Env File**:

    - Duplicate the `.env.example` file in the project root.
    - Rename the duplicated file to `.env`.
    - Open the `.env` file and set your variables as shown in the example file.

    ```sh
    cp .env.example .env
    ```

    Ensure to fill in the necessary values in the `.env` file for proper configuration.

4. **Run the Development Server**:

    ```sh
    npm run dev
    ```

    The backend server will be running at `http://localhost:3000`.


### Security

- **Authentication**: Uses JWT for secure authentication of API requests.
- **Authorization**: Implements role-based access control (RBAC) to restrict endpoints based on user roles.

## Technologies Used

- **Node.js**: JavaScript runtime for building scalable backend applications.
- **Express.js**: Fast, unopinionated, minimalist web framework for Node.js.
- **MYSQL**: SQL database for storing user data, Inventory details.
- **SEQUELISE**: Elegant ORM for Node.js applications.

## API DOCUMENTATION
[Postman Collection](https://documenter.getpostman.com/view/33585837/2sA3s7kUqt)


## Contributing

Contributions are welcome! Please fork the repository and submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License.

## Thank You
