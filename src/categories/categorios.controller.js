import { hash, verify } from "argon2";
import Categories from "./categories.model.js"
import User from "../user/user.model.js"
import fs from "fs/promises"
import { join, dirname } from "path"
import { fileURLToPath } from "url"


const __dirname = dirname(fileURLToPath(import.meta.url))

export const createCategories = async (req, res) => {
    try {

        const data = req.body;
        const user = req.usuario
        console.log(user._id)
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Propietario no encontrado'
            });
        }

        const categories = new Categories({
            ...data,
            createdBy: user._id,
        });


        //Validacion por si no encontramos el usuario.
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // validacion para confirmar que el rol del usuario para crear cursos sea unicamente el admin.
        if (user.role !== 'ADMIN_ROLE') {
            return res.status(403).json({ message: 'No tienes permiso para crear categorias' });
        }

        await categories.save();

        res.status(200).json({
            success: true,
            categories
        });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear la categoria', error: error.message });
    }
};

export const getCategories = async (req, res) => {
    try {
        const categories = await Categories.find().populate("createdBy", "name surname")

        return res.status(200).json({
            success: true,
            categories
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error al obtener los usuarios",
            error: err.message
        })
    }
}