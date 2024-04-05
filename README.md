# Express Generic E-commerce

## Description

Server Application to manage and purchase products. It provides a full platform to create, update and delete products and to create a shopping cart selecting products and purchase them.

The application is secured by JWT mechanism and has features for admin, premium and common users. It contains a view developed in plain javascript using Handlebars, where users can register, log in using email and password and social login with Github account. The common user can use the view to consult the Products and (create a cart?); the purchase feature is not supported on the view.

This applications is the result of a Backend Course about backend techniques and server configurations using Javascript as programming language, Node.js as runtime environment, and Express.js as web server.

### Features by Role

| Feature                   | Roles               | Description                                                                                                         |
|:------------------------- | ------------------- | ------------------------------------------------------------------------------------------------------------------- |
| `getProducts`             | `ALL`               | Gets all products. It accepts query params for pagination and filtering.                                            |
| `getProductByID`          | `ALL`               | Gets product by id.                                                                                                 |
| `createProduct`           | `ADMIN, PREMIUM`    | Creates new product. Products will be associated to the creator user.                                               |
| `updateProduct`           | `ADMIN, PREMIUM`    | Update product data.                                                                                                |
| `deleteProduct`           | `ADMIN, PREMIUM`    | Delete product from database.                                                                                       |
| `getCarts`                | `ADMIN`             | Get all shopping carts.                                                                                             |
| `getCartById`             | `ADMIN, CART_OWNER` | Get cart by id.                                                                                                     |
| `createCart`              | `ALL`               | Creates a new empty cart. The created cart will be associated to the user.                                          |
| `addProductToCart`        | `ADMIN, CART_OWNER` | Adds an available product to users cart with the quantity of 1.                                                     |
| `updateProductsOfCart`    | `ADMIN, CART_OWNER` | Replace the current list of products of a cart for a new one.                                                       |
| `updateProductOfCart`     | `ADMIN, CART_OWNER` | Updates the product quantity of an existing product in a users cart.                                                |
| `deleteAllProductsOfCart` | `ADMIN, CART_OWNER` | Empties the the current list of products of a cart.                                                                 |
| `deleteProductOfCart`     | `ADMIN, CART_OWNER` | Deletes a product of a cart.                                                                                        |
| `purchaseCart`            | `ADMIN, CART_OWNER` | Purchases the cart. It updates the product stock and creates a new ticket with the purchase information.            |
| `register`                | `PUBLIC`            | Register as new user of the application.                                                                            |
| `login`                   | `ALL`               | Logs in in the application using user credentials. Returns a valid JWT.                                             |
| `getCurrent`              | `ALL`               | Gets logged user information.                                                                                       |
| `logout`                  | `ALL`               | Logs out. Clears JWT client cookies.                                                                                |
| `requestNewPassword`      | `PUBLIC`            | Sends a email to an existing user with a link where it can reset its password. The link contains a recoveryToken.   |
| `updatePassword`          | `PUBLIC`            | Update the password of a user with a valid recoveryToken.                                                           |
| `switchUserToPremium`     | `ADMIN`             | Changes the role of a user. User role can be updated to premium only if the user has upload the required documents. |
| `uploadUserDocument`      | `ALL`               | Uploads a document required to the user to use premium features.                                                    |

## Install and Run the Project

This project can be run locally using docker-compose. To run the project, follow this instructions:

1. Clone the repo

2. Crear un archivo .env con el nombre de .env.local

3. Crear los contenedores con Docker Compose

4. Para consultar los endpoints disponibles acceder a {}/(poner acá la URL del swagger y adjuntar una captura de pantalla)

## How to Use the Project

1. Explicar como popular el project local con el script

2. Explicar las vistas y agregar algunas capturas de pantalla.
