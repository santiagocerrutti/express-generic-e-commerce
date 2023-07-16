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

  // El opreador Spread en la firma ... hace que todos los parametros siguientes se reciban en un array
  get(path, ...middlewares) {
    // al hacer la desestructuración al llamar, se reciben uno por uno (separados por comas)
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
      req.logger.http(`Response 200 to: ${req.method}: ${req.path}`);

      res.status(200).send({
        status: "SUCCESS",
        payload: payload,
      });
    };

    res.sendCreated = function (payload) {
      req.logger.http(`Response 201 to: ${req.method}: ${req.path}`);

      res.status(201).send({
        status: "CREATED",
        payload: payload,
      });
    };

    res.sendBadRequest = function (error, errors) {
      req.logger.http(`Response 400 to: ${req.method}: ${req.path}`);

      res.status(400).send({
        status: "ERROR",
        error: error,
        errors: errors,
      });
    };

    res.sendNotAuthenticated = function (error) {
      req.logger.http(`Response 401 to: ${req.method}: ${req.path}`);

      res.status(401).send({
        status: "ERROR",
        error: error,
      });
    };

    res.sendNotAuthorized = function (error) {
      req.logger.http(`Response 403 to: ${req.method}: ${req.path}`);

      res.status(403).send({
        status: "ERROR",
        error: error,
      });
    };

    res.sendNotFound = function (error) {
      req.logger.http(`Response 404 to: ${req.method}: ${req.path}`);

      res.status(404).send({
        status: "ERROR",
        error: error,
      });
    };

    res.sendConflict = function (error) {
      req.logger.http(`Response 409 to: ${req.method}: ${req.path}`);

      res.status(409).send({
        status: "ERROR",
        error: error,
      });
    };

    res.sendInternalServerError = function () {
      req.logger.http(`Response 500 to: ${req.method}: ${req.path}`);

      res.status(500).send({
        status: "ERROR",
        error: "Internal Server Error",
      });
    };

    next();
  }
}
