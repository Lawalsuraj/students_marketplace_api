import jwt from 'jsonwebtoken';

export const generateAcessToken = (user)=>{

    
   return jwt.sign(
    {id:user._id, role:user.role},
    process.env.token_secret,
    {expiresIn:"15m"});

}

export const generateRefreshToken = (user)=>{

   return jwt.sign({id:user._id, role:user.role},
    process.env.token_secret,
    {expiresIn:"15d"});

}