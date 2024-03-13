import {dirname, join} from "path"
import { fileURLToPath } from "url"
import jwt from "jsonwebtoken"

export  const __dirname = dirname(fileURLToPath(import.meta.url))

export const rutaUsuarios=join(__dirname,"data","usuarios.json")

const SECRET_KEY="codertoken"
export const generaToken=(usuario)=>jwt.sign(usuario, SECRET_KEY, {expiresIn:"7d"})

export const validarToken=(token)=>jwt.verify(token, SECRET_KEY)

