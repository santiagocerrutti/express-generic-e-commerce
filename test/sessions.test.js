import chai from "chai";
import { after, describe, it } from "mocha";
import mongoose from "mongoose";
import supertest from "supertest";

const expect = chai.expect;
const requester = supertest("http://localhost:8080");

describe("ecommerce", function () {
  this.timeout(5000);

  let cookie = {};

  after(async function () {
    const connection = await mongoose
      .createConnection(
        "mongodb+srv://coder-ecommerce-backend:01HNA3rnBPWOfngg@coderhousecluster.q3o8n6f.mongodb.net/ecommerce?retryWrites=true&w=majority"
      )
      .asPromise();

    const usersCollection = connection.collection("users");
    await usersCollection.findOneAndDelete({
      email: "usuario@sessions.com",
    });

    return Promise.resolve("done");
  });

  describe("/api/sessions", function () {
    it("should register new user", async function () {
      const { statusCode, _body, ok } = await requester
        .post("/api/sessions/register")
        .send({
          first_name: "Usuario",
          last_name: "Session",
          email: "usuario@sessions.com",
          password: "P4S5W0RD",
          date_of_birth: "1992-12-02",
        });
      expect(ok).to.be.equal(true);
      expect(statusCode).to.be.equal(201);

      expect(_body).to.haveOwnProperty("status");
      expect(_body.status).to.be.equal("CREATED");

      expect(_body).to.haveOwnProperty("payload");
      expect(_body.payload).to.not.be.empty;
    });

    it("should sing up user", async function () {
      const { statusCode, _body, ok, headers } = await requester
        .post("/api/sessions/login")
        .send({
          email: "usuario@sessions.com",
          password: "P4S5W0RD",
        });

      expect(ok).to.be.equal(true);
      expect(statusCode).to.be.equal(200);

      expect(_body).to.haveOwnProperty("status");
      expect(_body.status).to.be.equal("SUCCESS");

      expect(_body).to.haveOwnProperty("payload");
      expect(_body.payload).to.not.be.empty;

      expect(headers).to.haveOwnProperty("set-cookie");
      expect(headers["set-cookie"][0]).include("AuthJwt");

      const cookieResult = headers["set-cookie"][0];
      cookie = {
        name: cookieResult.split("=")[0],
        value: cookieResult.split("=")[1],
      };
    });

    it("should return current user", async function () {
      const { statusCode, _body, ok } = await requester
        .get("/api/sessions/current")
        .set("Cookie", [`${cookie.name}=${cookie.value}`]);

      expect(ok).to.be.equal(true);
      expect(statusCode).to.be.equal(200);

      expect(_body).to.haveOwnProperty("status");
      expect(_body.status).to.be.equal("SUCCESS");

      expect(_body).to.haveOwnProperty("payload");
      expect(_body.payload).to.be.instanceOf(Object);
      expect(_body.payload).to.haveOwnProperty("user");
      expect(_body.payload.user).to.be.instanceOf(Object);

      expect(_body.payload.user).to.haveOwnProperty("first_name");
      expect(_body.payload.user).to.haveOwnProperty("last_name");
      expect(_body.payload.user).to.haveOwnProperty("email");
      expect(_body.payload.user).to.haveOwnProperty("date_of_birth");
      expect(_body.payload.user).to.haveOwnProperty("role");
    });
  });
});
