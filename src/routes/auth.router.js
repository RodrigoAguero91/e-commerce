import { Router} from 'express';


const router = new Router()

let user = []

router.post('/register', (req, res)=>{
    let userNew = req.body
    userNew.id = Math.random()
    user.push(userNew)
   

    res.redirect('/login')
})

router.post('/login', (req, res) =>{
    let userNew = req.body
    let userFound = user.find(user => {
        return user.username == userNew.username && user.password == userNew.password
    })
    if(userFound){
        req.session.user = userNew.username
        req.session.password = userNew.password
      

        res.redirect('/products')
        return
    }
    res.send("Usuario o contraseña incorrectos")
})

router.get('/user', (req, res)=>{
    res.send(user)
})

router.get('/logout', (req,res) =>{
    req.session.destroy(err => {
        if(err) res.send('Error en logout')
    })
    res.redirect('/login')
})





export default router