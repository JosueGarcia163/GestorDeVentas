import { Router } from "express"
import { createProduct, getProduct, getProductById, getProductOutStock, getProductMoreSeller, updateProduct, deleteProduct, getProductByName, getProductByCategory } from "./product.controller.js"
import { createValidator, getProductByIdValidator, getProductValidator, updateProductValidator, deleteProductValidator, getProductMoreSellerValidator, getProductNameValidator, getProductfilterCategoryValidator } from "../middlewares/product-validators.js"

const router = Router()


router.post("/createProduct", createValidator, createProduct)

router.get("/getProduct", getProductValidator, getProduct)

router.get("/getProductById/:id", getProductByIdValidator, getProductById)

router.get("/getProductOutOfStock", getProductValidator, getProductOutStock)

router.get("/getProductMoreSeller", getProductMoreSellerValidator, getProductMoreSeller)

router.put("/updateProduct/:id", updateProductValidator, updateProduct)

router.delete("/deleteProduct/:id", deleteProductValidator, deleteProduct)

router.get("/getProductByName",getProductNameValidator, getProductByName)

router.post("/getProductByCategory", getProductfilterCategoryValidator, getProductByCategory)






export default router

