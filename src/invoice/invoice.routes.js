import { Router } from "express"
import {createInvoice } from "./invoice.controller.js"
import {createInvoiceValidator } from "../middlewares/invoice-validator.js"


const router = Router()

router.get("/createInvoice", createInvoiceValidator, createInvoice)


export default router