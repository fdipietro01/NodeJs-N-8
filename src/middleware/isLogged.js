const isLogged = (req, res, next) => {
  if (req.session?.user) res.redirect("products");
  else next();
};

module.exports = isLogged
