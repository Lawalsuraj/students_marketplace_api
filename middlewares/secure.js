import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import AppError from '../utils/AppError.js';

export const verify = async (req, res, next )=>{
    const token = req.cookies.AccessToken;

    const decoded = jwt.verify(token, process.env.token_secret);

    const id = decoded.id;

    if (!id) throw new AppError("no id found", 403)

    const user = await User.findById(id);

    req.user = user;

    next()
}


export const restrictTo = (...roles)=>{

    return (req,res,next)=>{

        if(!roles.includes(req.user.role)){

            throw new AppError('access denied', 403);
        }
        next();
    }
}