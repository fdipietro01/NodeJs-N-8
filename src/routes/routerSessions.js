const { Router } = require("express");
const UserModel = require("../models/userModel");
const isLogged = require("../middleware/isLogged");
const { createHash, isValidPassword } = require("../utils/bcryptPass");
const passport = require("passport");

let user = []; //persistencia en memoria para este ejercicio de jwt

const sessionsRouter = Router();

sessionsRouter.post("/relogin", async (req, res) => {
  const { mail, pass } = req.body;
  if (!mail || !pass)
    return res.render("sessionAlert", {
      success: false,
      message: "Completar todos los campos",
      case: "cambio de contraseña",
      url: "/relogin",
    });
  const user = await UserModel.findOne({ email: mail });
  if (!user)
    return res.render("sessionAlert", {
      success: false,
      message: "Email no registrado",
      case: "cambio de contraseña",
      url: "/relogin",
    });
  else {
    await UserModel.findOneAndUpdate(
      { email: mail },
      { password: createHash(pass) }
    );
    res.render("sessionAlert", {
      success: true,
      message: `${user.nombre} ${user.apellido} has actualizado tu contraseña exitosamente`,
      url: "/login",
      case: "Login",
    });
  }
});

sessionsRouter.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

sessionsRouter.get(
  "/githubcallback",
  passport.authenticate("github", {
    failureRedirect: "/failedlogin",
    failureMessage: true,
  }),
  (req, res) => {
    req.session.user = req.user;
    res.redirect("/products");
  }
);

sessionsRouter.get("/logout", (req, res) => {
  req.session.destroy((err) =>
    !err ? res.redirect("/login") : res.send({ status: "Error", err })
  );
});

sessionsRouter.post(
  "/login",
  isLogged,
  passport.authenticate("login", {
    failureRedirect: "/failedlogin",
    failureMessage: true,
  }),
  async (req, res) => {
    try {
      if (!req.user) {
        return res.render("sessionAlert", {
          success: false,
          message: "Credenciales Incorrectas",
          case: "Login",
          url: "/login",
        });
      }
      const { nombre, apellido, email } = req.user;
      req.session.user = {
        nombre: nombre,
        apellido: apellido,
        email: email,
      };
      return res.redirect("/products");
    } catch (err) {
      console.log(err);
    }
  }
);

sessionsRouter.post(
  "/register",
  passport.authenticate("register", {
    failureRedirect: "/failedregister",
    failureMessage: true,
  }),
  async (req, res) => {
    const { nombre, apellido } = req.body;
    res.render("sessionAlert", {
      success: true,
      message: `${nombre} ${apellido} te has registrado exitosamente`,
      url: "/login",
      case: "Login",
    });
  }
);

module.exports = sessionsRouter;
