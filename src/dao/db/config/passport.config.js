import passport from "passport"
import github from "passport-github2"
import { UserSchema } from "../models/user.model.js"

export  const initPassport=()=>{
    passport.use("github", new github.Strategy(
        {
            clientID:"Iv1.1a2cb61acd254ae2",
            clientSecret:"eb0f89659faa6b5ff4d94723bab432dcbf02073b",
            callbackURL:"http://localhost:8080/api/sessions/callback"
        },
        async(profile, done)=>{
            try{
              let {name, email}=profile._json
              let usuario= await UserSchema.findOne({email:email})
              if(!usuario){
                usuario= await UserSchema.create(
                    {
                        name:name, email, github: profile
                    }
                )
              }
              return done(null, usuario)
            }catch(error) {
                return (error)
            }
        }
        
        ))
}


passport.serializeUser((usuario, done)=>{
    done(null, usuario)
})

passport.deserializeUser((usuario, done)=>{
    done(null, usuario)
})

export default initPassport()