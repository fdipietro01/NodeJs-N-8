const { Router } = require("express");
const ProductManager = require("../daos/mongoDaos/ProductManager");
const CartManager = require("../daos/mongoDaos/CartManager");
const viewsRouter = Router();
const productHandler = new ProductManager();
const cartHandler = new CartManager();
const autentication = require("../middleware/auth");
const isLogged = require("../middleware/isLogged");

viewsRouter.get("/login", isLogged, async (req, res) => {
  res.render("login");
});
viewsRouter.get("/relogin", isLogged, async (req, res) => {
  res.render("relogin");
});
viewsRouter.get("/register", isLogged, async (req, res) => {
  res.render("register");
});

viewsRouter.get("/failedregister", (req, res) => {
  const message = req.session.messages[req.session.messages.length - 1];
  res.render("sessionAlert", {
    success: false,
    message: message,
    case: "Registro",
    url: "/register",
  });
});

viewsRouter.get("/failedlogin", (req, res) => {
  const message = req.session.messages[req.session.messages.length - 1];
  res.render("sessionAlert", {
    success: false,
    message: message,
    case: "Login",
    url: "/login",
  });
});

viewsRouter.get("/products", autentication, async (req, res) => {
  const { nombre, apellido, role } = req.session.user;
  const isAdmin = role === "admin";
  try {
    const {
      payload,
      page,
      totalPages,
      hasNextPage,
      hasPrevPage,
      prevLink,
      nextLink,
    } = await productHandler.getProducts();
    const dataExist = payload.length;
    res.render("editProductos", {
      isAdmin,
      nombre,
      apellido,
      payload,
      dataExist,
      hasNextPage,
      hasPrevPage,
      prevLink,
      nextLink,
      page,
      totalPages,
    });
  } catch (err) {
    res.send({ error: err.message });
  }
});

viewsRouter.get("/carts", autentication, (req, res) => {
  res.render("homeCarritos");
});

viewsRouter.get("/carts/:cid", autentication, async (req, res) => {
  const { cid } = req.params;
  try {
    const cartProducts = await cartHandler.getProductsfromCart(cid);
    const { payload: catalogProducts } = await productHandler.getProducts();
    const cartExist = cartProducts.length;
    const catalogExists = catalogProducts.length;
    res.render("editCarritos", {
      cartProducts,
      catalogProducts,
      cartExist,
      catalogExists,
      id: cid,
    });
  } catch (err) {
    res.send({ error: err.message });
  }
});

module.exports = viewsRouter;
