/* eslint-disable no-unused-vars */
import MUUID from "uuid-mongodb";
import { ProductModel } from "./models/product.model.js";
import {
  CustomError,
  ERROR_CODE,
  deleteUndefinedProperties,
} from "../../utils.js";

export class ProductDaoMongo {
  constructor() {}

  async getAll(limit = null) {
    return ProductModel.find().limit(limit).lean();
  }

  async getAllPaginate(limit = 10, page = 1, query = {}, sort = undefined) {
    const findQuery = this._buildFindQuery(query);

    const paginateOptions = {
      limit,
      page,
    };

    if (sort) {
      paginateOptions.sort = {
        price: sort,
      };
    }

    return ProductModel.paginate(findQuery, { ...paginateOptions, lean: true });
  }

  _buildFindQuery(query) {
    const {
      title,
      description,
      code,
      price,
      status,
      stock,
      category,
      available,
    } = query;

    const findQuery = deleteUndefinedProperties({
      title,
      description,
      code,
      price,
      status,
      stock,
      category,
    });

    if (available === "true") {
      findQuery.stock = { $gt: 0 };
    }

    return findQuery;
  }

  async getById(productId) {
    return ProductModel.findById(MUUID.from(productId)).lean();
  }

  async getOneByFilter(filterQuery) {
    throw new CustomError("Not implemented yet.", ERROR_CODE.NOT_IMPLEMENTED);
  }

  async addOne(product) {
    return await ProductModel.create({ ...product });
  }

  async addMany(products) {
    return await ProductModel.insertMany(products);
  }

  async updateOne(productId, fieldsToUpdate) {
    let result = null;
    try {
      result = await ProductModel.findOneAndUpdate(
        {
          _id: MUUID.from(productId),
        },
        { ...fieldsToUpdate }
      );
    } catch (error) {
      if (fieldsToUpdate.code) {
        throw new CustomError(
          `Code ${fieldsToUpdate.code} duplicated`,
          ERROR_CODE.DUPLICATED_KEY
        );
      }

      throw error;
    }

    if (result) {
      const updatedProduct = await ProductModel.findById(MUUID.from(productId));

      return updatedProduct;
    }

    return null;
  }

  async deleteOne(productId) {
    return ProductModel.findOneAndDelete({
      _id: MUUID.from(productId),
    });
  }
}
