import chai from "chai";
import { after, before, describe, it } from "mocha";
import mongoose from "mongoose";
import supertest from "supertest";
import MUUID from "uuid-mongodb";

const expect = chai.expect;
const requester = supertest("http://localhost:8080");

describe("ecommerce", function () {
  this.timeout(5000);

  let cookie = {};
  let product = {};
  let newCart = {};

  before(async function () {
    const connection = await mongoose
      .createConnection(
        "mongodb+srv://coder-ecommerce-backend:01HNA3rnBPWOfngg@coderhousecluster.q3o8n6f.mongodb.net/ecommerce?retryWrites=true&w=majority"
      )
      .asPromise();

    const productsCollection = connection.collection("products");
    product = await productsCollection.findOne();
    product = {
      ...product,
      _id: product._id.toString(),
    };

    const loginResult = await requester.post("/api/sessions/login").send({
      email: "usuario@de-prueba.com",
      password: "P4S5W0RD",
    });

    const cookieResult = loginResult.headers["set-cookie"][0];
    cookie = {
      name: cookieResult.split("=")[0],
      value: cookieResult.split("=")[1],
    };
  });

  after(async function () {
    const connection = await mongoose
      .createConnection(
        "mongodb+srv://coder-ecommerce-backend:01HNA3rnBPWOfngg@coderhousecluster.q3o8n6f.mongodb.net/ecommerce?retryWrites=true&w=majority"
      )
      .asPromise();

    const cartsCollection = connection.collection("carts");

    await cartsCollection.findOneAndDelete({
      _id: MUUID.from(newCart._id),
    });

    return Promise.resolve("done");
  });

  describe("/api/carts", function () {
    it("should create an empty cart", async function () {
      const { statusCode, _body, ok } = await requester
        .post("/api/carts")
        .set("Cookie", [`${cookie.name}=${cookie.value}`]);

      expect(ok).to.be.equal(true);
      expect(statusCode).to.be.equal(201);

      expect(_body).to.haveOwnProperty("status");
      expect(_body.status).to.be.equal("CREATED");

      newCart = _body.payload;

      expect(_body).to.haveOwnProperty("payload");
      expect(_body.payload).to.be.instanceOf(Object);
      expect(_body.payload).to.haveOwnProperty("_id");
      expect(_body.payload).to.haveOwnProperty("products");
      expect(_body.payload.products).to.be.instanceOf(Array);
      expect(_body.payload.products).to.be.empty;
    });

    it("should add one product to cart", async function () {
      const { statusCode, _body, ok } = await requester
        .post(`/api/carts/${newCart._id}/products/${product._id}`)
        .set("Cookie", [`${cookie.name}=${cookie.value}`]);

      expect(ok).to.be.equal(true);
      expect(statusCode).to.be.equal(200);

      expect(_body).to.haveOwnProperty("status");
      expect(_body.status).to.be.equal("SUCCESS");

      expect(_body).to.haveOwnProperty("payload");
      expect(_body.payload).to.be.instanceOf(Object);
      expect(_body.payload).to.haveOwnProperty("_id");
      expect(_body.payload).to.haveOwnProperty("products");
      expect(_body.payload.products).to.be.instanceOf(Array);
      expect(_body.payload.products.length).to.equal(1);
      expect(_body.payload.products[0]).to.haveOwnProperty("quantity");
      expect(_body.payload.products[0]).to.haveOwnProperty("product");
      expect(_body.payload.products[0].product).to.equal(product._id);
      expect(_body.payload.products[0].quantity).to.equal(1);
    });

    it("should cadd increment product quantity in 1", async function () {
      const { statusCode, _body, ok } = await requester
        .post(`/api/carts/${newCart._id}/products/${product._id}`)
        .set("Cookie", [`${cookie.name}=${cookie.value}`]);

      expect(ok).to.be.equal(true);
      expect(statusCode).to.be.equal(200);

      expect(_body).to.haveOwnProperty("status");
      expect(_body.status).to.be.equal("SUCCESS");

      expect(_body).to.haveOwnProperty("payload");
      expect(_body.payload).to.be.instanceOf(Object);
      expect(_body.payload).to.haveOwnProperty("_id");
      expect(_body.payload).to.haveOwnProperty("products");
      expect(_body.payload.products).to.be.instanceOf(Array);
      expect(_body.payload.products.length).to.equal(1);
      expect(_body.payload.products[0]).to.haveOwnProperty("quantity");
      expect(_body.payload.products[0]).to.haveOwnProperty("product");
      expect(_body.payload.products[0].product).to.equal(product._id);
      expect(_body.payload.products[0].quantity).to.equal(2);
    });
  });
});
