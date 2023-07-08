/* eslint-disable no-unused-vars */
import MUUID from "uuid-mongodb";
import { ProductModel } from "./models/product.model.js";
import { deleteUndefinedProperties } from "../../utils.js";

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
    throw new Error("Not implemented yet.");
  }

  async addOne(product) {
    return await ProductModel.create({ ...product });
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
      console.log(error);

      if (fieldsToUpdate.code) {
        const e = new Error(`Code ${fieldsToUpdate.code} duplicated`);
        e.code = "DUPLICATED_KEY";

        throw e;
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
