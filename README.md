# Express Generic E-commerce

## Description

Server Application to manage and purchase products. It provides a full platform to create, update and delete products and to create a shopping cart selecting products and purchase them.

The application is secured by JWT mechanism and has features for admin, premium and common users. It contains a view developed in plain javascript using Handlebars, where users can register, log in using email and password and social login with Github account. The common user can use the view to consult the Products; the purchase feature is not supported on the view.

There are three roles in the application:

- ADMIN who can use every endpoint of the application.

- PREMIUM use for the sellers, who can create and update their products and also shop products of other users.

- USER with limited permission. They view the products and create a cart to shop. A USER can become PREMIUM if they submit the requested documents and the admin approves them.

This applications is the result of a Backend Course about backend techniques and server configurations using Javascript as programming language, Node.js as runtime environment, and Express.js as web server.

### Features by Role

| Feature                   | Roles               | Description                                                                                                        |
|:------------------------- | ------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `getProducts`             | `ALL`               | Get all products. It accepts query params for pagination and filtering.                                            |
| `getProductByID`          | `ALL`               | Get product by id.                                                                                                 |
| `createProduct`           | `ADMIN, PREMIUM`    | Create new product. Products will be associated to the creator user.                                               |
| `updateProduct`           | `ADMIN, PREMIUM`    | Update product data.                                                                                               |
| `deleteProduct`           | `ADMIN, PREMIUM`    | Mark product as deleted. Send an email to the product owner informing that the product has been deleted.           |
| `getCarts`                | `ADMIN`             | Get all shopping carts.                                                                                            |
| `getCartById`             | `ADMIN, CART_OWNER` | Get cart by id.                                                                                                    |
| `createCart`              | `ALL`               | Create a new empty cart. The created cart will be associated to the user.                                          |
| `addProductToCart`        | `ADMIN, CART_OWNER` | Adds an available product to users cart with the quantity of 1.                                                    |
| `updateProductsOfCart`    | `ADMIN, CART_OWNER` | Replace the current list of products of a cart for a new one.                                                      |
| `updateProductOfCart`     | `ADMIN, CART_OWNER` | Update the product quantity of an existing product in a users cart.                                                |
| `deleteAllProductsOfCart` | `ADMIN, CART_OWNER` | Empty the the current list of products of a cart.                                                                  |
| `deleteProductOfCart`     | `ADMIN, CART_OWNER` | Deletes a product of a cart.                                                                                       |
| `purchaseCart`            | `ADMIN, CART_OWNER` | Purchase the cart. It updates the product stock and creates a new ticket with the purchase information.            |
| `register`                | `PUBLIC`            | Register as new user of the application.                                                                           |
| `login`                   | `ALL`               | Log in in the application using user credentials. Returns a valid JWT.                                             |
| `getCurrent`              | `ALL`               | Get logged user information.                                                                                       |
| `logout`                  | `ALL`               | Log out. Clears JWT client cookies.                                                                                |
| `requestNewPassword`      | `PUBLIC`            | Send a email to an existing user with a link where it can reset its password. The link contains a recoveryToken.   |
| `updatePassword`          | `PUBLIC`            | Update the password of a user with a valid recoveryToken.                                                          |
| `switchUserToPremium`     | `ADMIN`             | Change the role of a user. User role can be updated to premium only if the user has upload the required documents. |
| `uploadUserDocument`      | `ALL`               | Upload a document required to the user to use premium features.                                                    |
| `deleteInactiveUsers`     | `ADMIN`             | Deletes all users who have not logged in for more than two days.                                                   |

## Install and Run the Project

This application runs in node 18.20.0 and use a mongodb 7 for data persistence . Using a cloud provider is highly recommended. To run the application in production mode you need to:

1. Configure a mongodb version 7.0.8 or higher. You can use [Mongo Atlas](https://www.mongodb.com/atlas) or any other cloud provider of your preference.

2. Configure a deployment service that supports node 18.20.0 or higher. In this step you need to configure the environment variables declared in [this example](https://github.com/santiagocerrutti/express-generic-e-commerce/blob/main/.env.example).

You can try and test the application running in locally using docker-compose. In order to do that [docker](https://docs.docker.com/get-docker/) and [docker-compose](https://docs.docker.com/compose/install/) are required. To run the project this way, follow this instructions:

1. Clone this repository in your local machine. Check how to do it [here](https://docs.github.com/en/repositories/creating-and-managing-repositories/cloning-a-repository).

2. Create a `.env` file to declare environment variables. For the local execution file must be named as `.env.dev`.

3. Run the command:

```
docker-compose -f docker-compose.local.yml up
```

This will start the application on `http://localhost:8080`. Once running, you can check the available endpoints on `http://localhost:8080/apidocs`

## How to Use the Project

To start using the application you can use this endpoints

1. To create the admin user (with the credential set on the env vars `ADMIN_EMAIL`, `ADMIN_PASSWORD`) use the endpoint `POST {host}/mocks/admin`.

2. To generate fake data use the endpoint `POST {host}/mocks/init`. This will create a common user, a premium user, 20 products and two carts. The response will contain the data, including the user credentials. Remember that the passwords are store as hash, so you can't get again the password of the generated users.
