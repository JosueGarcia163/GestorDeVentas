import { Router } from "express"
import { createProduct, getProduct, getProductById, getProductOutStock, getProductMoreSeller, updateProduct, deleteProduct, getProductByName } from "./product.controller.js"
import { createValidator, getProductByIdValidator, getProductValidator, updateProductValidator, deleteProductValidator, getProductMoreSellerValidator, getProductNameValidator } from "../middlewares/product-validators.js"

const router = Router()


router.post("/createProduct", createValidator, createProduct)

router.get("/getProduct", getProductValidator, getProduct)

router.get("/getProductById/:id", getProductByIdValidator, getProductById)

router.get("/getProductOutOfStock", getProductValidator, getProductOutStock)

router.get("/getProductMoreSeller", getProductMoreSellerValidator, getProductMoreSeller)

router.put("/updateProduct/:id", updateProductValidator, updateProduct)

router.delete("/deleteProduct/:id", deleteProductValidator, deleteProduct)

router.get("/getProductByName",getProductNameValidator, getProductByName)






export default router

