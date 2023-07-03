export class ProductRepository {
  constructor(dao) {
    this.dao = dao;
  }

  async getProducts(limit = 0) {
    return this.dao.getProducts(limit);
  }

  async getProductsPaginate(
    limit = 10,
    page = 1,
    query = {},
    sort = undefined
  ) {
    return this.dao.getProducts(limit, page, query, sort);
  }

  async getProductsJson(limit = 0) {
    return this.dao.getProducts(limit);
  }

  async getProductsPaginateJson(limit = 10, page = 1) {
    return this.dao.getProductsPaginateJson(limit, page);
  }

  async getProductById(productId) {
    return this.dao.getProductById(productId);
  }

  async addProduct(product) {
    return this.dao.addProduct(product);
  }

  async updateProduct(productId, fieldsToUpdate) {
    return this.dao.updateProduct(productId, fieldsToUpdate);
  }

  async deleteProduct(productId) {
    return this.dao.deleteProduct(productId);
  }
}
