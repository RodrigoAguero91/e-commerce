import { Router } from "express";
import fs from "fs";
import passport from "passport";
import {  generaToken, rutaUsuarios } from "../utils.js";
export const router=Router()

let usuarios=[]
if(fs.existsSync(rutaUsuarios)){
   usuarios=JSON.parse(fs.readFileSync(rutaUsuarios, 'utf-8'))
}

router.post('/registro', (req, res)=>{
    let {nombre, email, password}= req.body
    if(!nombre || !email || !password) return res.status(400).send('ingrese el usuario')

    let usuario=usuarios.find(u=>u.email===email)
    if(usuario) return res.status(400).send(`el usuario ${email} ya existe`)

    let id=1
    if(usuarios.length>0) id=usuarios[usuarios.length-1].id+1

    usuario={
        id,nombre, email , password
    }

    usuarios.push(usuario)
    fs.writeFileSync(rutaUsuarios,JSON.stringify(usuarios,null,5))

    res.status(201).json({
        usuarioCreado:usuario
    })
})

router.post('/login', (req,res)=>{
    let{email,password}= req.body
    if(!email || !password) return res.status(400).send('ingresar email y password')

    usuarios= JSON.parse(fs.readFileSync(rutaUsuarios,'utf-8'))

    let usuario=usuarios.find(u=>u.email===email && u.password===password)
    if(!usuario) return res.status(400).send(`Error de credenciales`)

    delete usuario.password
    let token =generaToken(usuario)

    return res.status(200).json({
        usuarioLogueado: usuario,
        token
    })
})


router.get('/github', passport.authenticate("github", {}), (req,res)=>{})

router.get('/callback', passport.authenticate("github", {}), (req,res)=>{
   
    req.session.usuario= req.user

   res.setHeader('Content-Type','application/json');
   return res.status(200).json({payload:req.user});
})

export default router


