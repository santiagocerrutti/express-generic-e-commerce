import { CartDaoMongo } from "../dao/db/cart.dao.mongo.js";
import { MessageDaoMongo } from "../dao/db/message.dao.mongo.js";
import { ProductDaoMongo } from "../dao/db/product.dao.mongo.js";
import { UserDaoMongo } from "../dao/db/user.dao.mongo.js";

export const CartsService = CartDaoMongo;

export const MessagesService = MessageDaoMongo;
// import { ProductDaoFile } from "../dao/file/product.dao.file.js";

export const ProductsService = ProductDaoMongo;
// export const ProductsService = ProductDaoFile;

export const UsersService = UserDaoMongo;
