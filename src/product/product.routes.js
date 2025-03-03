import { Router } from "express"
import { createProduct, getProduct, getProductById } from "./product.controller.js"
import { createValidator, getProductByIdValidator, getProductValidator } from "../middlewares/product-validators.js"

const router = Router()


router.post("/createProduct", createValidator, createProduct)

router.get("/getProduct", getProductValidator, getProduct)

router.get("/getProductById/:id", getProductByIdValidator, getProductById)

export default router

