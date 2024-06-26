/**
 * El Patron Repository sirve para abstraer el acceso a un conjunto de objetos a nivel de dominio.
 * Puede utilizarse con uno o más DAOs, pero no debería ser una interface como está definido aquí
 * @see https://www.baeldung.com/java-dao-vs-repository#DAOvsRepository
 * @see https://www.arquitecturajava.com/dao-vs-repository-y-sus-diferencias/
 */
export class Repository {
  constructor(dao) {
    this.dao = dao;
  }

  async getAll(limit = 0) {
    return this.dao.getAll(limit);
  }

  async getAllPaginate(limit = 10, page = 1, query = {}, sort = undefined) {
    return this.dao.getAllPaginate(limit, page, query, sort);
  }

  async getAllByFilter(filterQuery) {
    return this.dao.getAllByFilter(filterQuery);
  }

  async getById(objectId) {
    return this.dao.getById(objectId);
  }

  async getOneByFilter(filterQuery) {
    return this.dao.getOneByFilter(filterQuery);
  }

  async addOne(object) {
    return this.dao.addOne(object);
  }

  async addMany(arrayOfObjects) {
    return this.dao.addMany(arrayOfObjects);
  }

  async updateOne(objectId, fieldsToUpdate) {
    return this.dao.updateOne(objectId, fieldsToUpdate);
  }

  async deleteOne(productId) {
    return this.dao.deleteOne(productId);
  }
}
