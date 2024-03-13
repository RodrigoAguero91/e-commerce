import { validarToken } from "../utils.js";

export  const auth=(req,res,next)=>{
    if(req.headers["authorization"]){
        res.setHeader('Content-Type', 'application/json');
        return res.status(401).json({error:`usuario no autenticado`})
    }

    let token= req.headers["authorization"].split("")[1]
    try{
        let usuario=validarToken(token)
        req.user=usuario
    } catch(error){
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({error:error.message})
    }
    
    //if(!validarToken(token)){
       // res.setHeader('Content-Type', 'application/json');
       // return res.status(401).json({error:"token invalido"})
    //}
    next()
}

