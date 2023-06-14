import { Router as ExpressRouter } from "express";

export class Router {
  constructor() {
    this.router = ExpressRouter();
    this.router.use(this.generateCustomResponse);
    this.init();
  }

  init() {}

  getRouter() {
    return this.router;
  }

  // Documentación? (TODO: buscar ejemplos)
  // async applyMiddlewares(middlewares) {
  //   /// ????
  //   // for(const middleware of middlewares){
  //   //   async (...params) => {
  //   //     await middleware.apply(this, params)
  //   //   }
  //   // }
  //   return middlewares.map((middleware) => {
  //     return async (...params) => {
  //       try {
  //         await middleware.apply(this, params);
  //       } catch (error) {
  //         console.log(error);
  //         params[1]
  //           .status(500)
  //           .send({ status: "ERROR", error: "Internal Server Error" });
  //       }
  //     };
  //   });
  // }

  // Callbacks or callback function or handler functions generally mean a function that is run after an asynchronous function have been completed

  // El opreador Spread ... hace que todos los parametros siguientes se reciban en un array
  get(path, ...middlewares) {
    this.router.get(path, ...middlewares);
  }

  post(path, ...middlewares) {
    this.router.post(path, ...middlewares);
  }

  put(path, ...middlewares) {
    this.router.put(path, ...middlewares);
  }

  delete(path, ...middlewares) {
    this.router.delete(path, ...middlewares);
  }

  // esta función setea un atributo por cada tipo de respuesta, que apunta a una función que se llamará dentro de los controllers
  generateCustomResponse(req, res, next) {
    res.sendSuccess = function (payload) {
      res.status(200).send({
        status: "SUCCESS",
        payload: payload,
      });
    };

    res.sendCreated = function (payload) {
      res.status(201).send({
        status: "CREATED",
        payload: payload,
      });
    };

    res.sendBadRequest = function (error, errors) {
      res.status(400).send({
        status: "ERROR",
        error: error,
        errors: errors,
      });
    };

    res.sendNotAuthenticated = function (error) {
      res.status(401).send({
        status: "ERROR",
        error: error,
      });
    };

    res.sendNotAuthorized = function (error) {
      res.status(403).send({
        status: "ERROR",
        error: error,
      });
    };

    res.sendNotFound = function (error) {
      res.status(404).send({
        status: "ERROR",
        error: error,
      });
    };

    res.sendConflict = function (error) {
      res.status(409).send({
        status: "ERROR",
        error: error,
      });
    };

    res.sendInternalServerError = function () {
      res.status(500).send({
        status: "ERROR",
        error: "Internal Server Error",
      });
    };

    next();
  }
}
