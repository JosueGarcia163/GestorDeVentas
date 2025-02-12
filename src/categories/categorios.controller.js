import { hash, verify } from "argon2";
import Categories from "./categories.model.js"
import fs from "fs/promises"
import { join, dirname } from "path"
import { fileURLToPath } from "url"


const __dirname = dirname(fileURLToPath(import.meta.url))

export const getCategoriesById = async (req, res) => {
    try {
        const { uid } = req.params;
        const categories = await Categories.findById(uid);

        if (!categories) {
            return res.status(404).json({
                success: false,
                message: "categoria no encontrado"
            })
        }

        return res.status(200).json({
            success: true,
            user
        })

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error al obtener el la categoria.",
            error: err.message
        })
    }
}