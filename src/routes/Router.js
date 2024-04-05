import { Router as ExpressRouter } from "express";

/**
 * Abstract Router
 * Handles HTTP Request and provide custom response functions
 */
export class Router {
  constructor() {
    this.router = ExpressRouter();
    this.router.use(this.generateCustomResponse);
    this.init();
  }

  /**
   * This functions is called on constructor
   * Allows children to create new routes
   */
  init() {}

  getRouter() {
    return this.router;
  }

  //* El opreador Spread en la firma ... hace que todos los parametros siguientes se reciban en un array
  get(path, ...middlewares) {
    //* al hacer la desestructuración al llamar, se reciben uno por uno (separados por comas)
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

  /**
   * Middleware.
   * Provides standard response payload to Req object.
   * Logs every response with req.logger
   * @param req express request object
   * @param res express response object
   * @param next callback function: "a function that is run after an asynchronous function have been completed".
   */
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
