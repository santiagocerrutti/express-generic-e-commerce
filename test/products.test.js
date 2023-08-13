import chai from "chai";
import { after, before, describe, it } from "mocha";
import supertest from "supertest";
import mongoose from "mongoose";

const expect = chai.expect;
const requester = supertest("http://localhost:8080");

describe("ecommerce", function () {
  this.timeout(5000);

  let cookie = {};

  before(async function () {
    const loginResult = await requester.post("/api/sessions/login").send({
      email: "usuario@premium.com",
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

    const productsCollection = connection.collection("products");
    await productsCollection.findOneAndDelete({
      code: "test-product",
    });

    return Promise.resolve("done");
  });

  describe("/api/products", function () {
    it("should get all products", async function () {
      const { statusCode, _body, ok } = await requester
        .get("/api/products")
        .set("Cookie", [`${cookie.name}=${cookie.value}`]);

      expect(ok).to.be.equal(true);
      expect(statusCode).to.be.equal(200);

      expect(_body).to.haveOwnProperty("status");
      expect(_body.status).to.be.equal("SUCCESS");

      expect(_body).to.haveOwnProperty("payload");
      expect(_body.payload).to.be.instanceOf(Array);
      expect(_body.payload.length).to.be.greaterThan(0);
      expect(_body.payload[0]).to.be.instanceOf(Object);
      expect(_body.payload[0]).to.haveOwnProperty("_id");
      expect(_body.payload[0]).to.haveOwnProperty("title");
      expect(_body.payload[0]).to.haveOwnProperty("description");
      expect(_body.payload[0]).to.haveOwnProperty("price");
      expect(_body.payload[0]).to.haveOwnProperty("status");
      expect(_body.payload[0]).to.haveOwnProperty("stock");
      expect(_body.payload[0]).to.haveOwnProperty("category");
      expect(_body.payload[0]).to.haveOwnProperty("thumbnails");
    });

    it("should create one product", async function () {
      const { statusCode, _body, ok } = await requester
        .post("/api/products")
        .set("Cookie", [`${cookie.name}=${cookie.value}`])
        .send({
          title: "Producto de prueba",
          description:
            "Este es un producto agregado durante el testing de integración",
          code: "test-product",
          price: 600,
          stock: 60,
          status: true,
          category: "CATEGORY",
          thumbnails: [
            "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Image_created_with_a_mobile_phone.png/1280px-Image_created_with_a_mobile_phone.png",
          ],
        });

      expect(ok).to.be.equal(true);
      expect(statusCode).to.be.equal(201);

      expect(_body).to.haveOwnProperty("status");
      expect(_body.status).to.be.equal("CREATED");

      expect(_body).to.haveOwnProperty("payload");
      expect(_body.payload).to.be.instanceOf(Object);
      expect(_body.payload).to.haveOwnProperty("_id");
      expect(_body.payload).to.haveOwnProperty("title");
      expect(_body.payload).to.haveOwnProperty("description");
      expect(_body.payload).to.haveOwnProperty("price");
      expect(_body.payload).to.haveOwnProperty("status");
      expect(_body.payload).to.haveOwnProperty("stock");
      expect(_body.payload).to.haveOwnProperty("category");
      expect(_body.payload).to.haveOwnProperty("thumbnails");
      expect(_body.payload).to.haveOwnProperty("owner");
    });

    it("should not create product since payload is invalid", async function () {
      const { statusCode, _body, ok } = await requester
        .post("/api/products")
        .set("Cookie", [`${cookie.name}=${cookie.value}`])
        .send({
          description:
            "Este es un producto agregado durante el testing de integración",
          code: "test-product",
          price: 600,
          stock: 60,
          status: true,
          category: "CATEGORY",
          thumbnails: [
            "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Image_created_with_a_mobile_phone.png/1280px-Image_created_with_a_mobile_phone.png",
          ],
        });

      expect(ok).to.be.equal(false);
      expect(statusCode).to.be.equal(400);

      expect(_body).to.haveOwnProperty("status");
      expect(_body.status).to.be.equal("ERROR");

      expect(_body).to.haveOwnProperty("error");
    });
  });
});
