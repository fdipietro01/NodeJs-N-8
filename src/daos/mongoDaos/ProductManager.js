const modeloProducto = require("../../models/productoModel");
const { Types } = require("mongoose");

class ProductManager {
  addProduct = async (producto) => {
    try {
      await modeloProducto.create(producto);
      return producto;
    } catch (err) {
      console.log(err);
      throw new Error("Error al grabar el producto", err);
    }
  };

  getProducts = async (limit=5, pageParam=1, sort, category, status) => {
    let query = {};
        if (category) query.category = category;
    if (status) query.status = Boolean(status);
    try {
      let dataProd;
      if (sort) {
        dataProd = await modeloProducto.paginate(query, {
          limit,
          page: pageParam,
          sort: { price: sort },
          lean: true
        });
      } else {
        dataProd = await modeloProducto.paginate(query, { limit, page: pageParam, lean: true });
      }
      const buildUrl = (order, page) => `http://localhost:8080/api/products/?limit=${limit}&page=${Number(page) + order}${sort? `&sort=${sort}`: ""}${status? `&status=${status}`: ""}${category? `&category=${category}`: ""}`;
      const { docs, totalPages, prevPage, nextPage, page, hasPrevPage, hasNextPage } = dataProd;

      const parsedResponse = {
        status: "success",
        payload: docs,
        totalPages,
        prevPage,
        nextPage,
        page,
        hasPrevPage,
        hasNextPage,
        prevLink: hasPrevPage ? buildUrl(-1, pageParam) : null,
        nextLink: hasNextPage ? buildUrl(1, pageParam) : null,
      };
      return (parsedResponse)
    } 
    catch (err) {
      throw new Error("Error al leer productos", err);
    }
  };

  getProductById = async (id) => {
    const dataProd = await modeloProducto.findById(id);
    if (dataProd) return { find, idx };
    else throw new Error("Producto no encontrado");
  };

  updateProduct = async (id, newProd) => {
    try {
      await modeloProducto.updateOne({ _id: id }, newProd);
    } catch (err) {
      throw new Error(err.message);
    }
  };

  deleteProduct = async (id) => {
    try {
      const parsedId = Types.ObjectId(id);
      const { deletedCount } = await modeloProducto.deleteOne({
        _id: parsedId,
      });
      return deletedCount;
    } catch (err) {
      throw new Error(err.message);
    }
  };
}

module.exports = ProductManager;
