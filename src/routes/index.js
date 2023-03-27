const {Router} = require('express')
const routerProductos = require('./routerProductos')
const routerCarritos = require('./routerCarritos')
const sessionsRouter = require("./routerSessions");
const routerViews = require('./viewsRouter')

const router = Router()
router.use("/sessions", sessionsRouter);
router.use("/api/products", routerProductos)
router.use("/api/carts", routerCarritos)
router.use("/", routerViews)
router.use("/alerts/:message", (req, res)=>{
    const {message} = req.params
    res.render('alert', {message})
})

module.exports = router