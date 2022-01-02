import { Request, Response } from 'express'
import { Joi } from 'express-validation'
import bcryptjs from 'bcryptjs'
import { User, UserModel } from '../models/user.model';
import { JwtPayload, sign, verify } from 'jsonwebtoken'


const registerValidation = Joi.object({
    firstName: Joi.string().required(), 
    lastName: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    password_confirm: Joi.string().required()
});

export const register = async (req: Request,  res: Response) => {
     const body = req.body
     const { error } = registerValidation.validate(body)

     if(error){
        return res.status(400).send(error.message)
     }

     if(body.password !== body.password_confirm){
         return res.status(400).send('password\'s do not match.')
     }
     
     const salt = await bcryptjs.genSalt(10);
     const hashedPassword = await bcryptjs.hash(body.password, salt);


     const user = new UserModel({
       firstName: body.firstName,
       lastName: body.lastName,
       email: body.email,
       password: hashedPassword,
     });
     const result = await user.save()
     const {password, ...data} = result.toJSON()

     return res.send(data)
}

export const login = async ( req: Request, res: Response) => {
    const user = await UserModel.findOne({ email: req.body.email })

    if(!user){
        return res.status(400).send({ message: 'invalid credentials...'})
    }

    const auth = await bcryptjs.compare(req.body.password, user.password)
    if(!auth){  
        return res.status(400).send({ message: "invalid credentials..." });
    }

    const token = sign( { _id: user._id }, 'secret')
    res.cookie('jwt', token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 })
    res.send({ message: 'success' })
}

export const user = async ( req: Request, res: Response) => {
    const cookie = req.cookies.jwt
    const payload = verify(cookie, 'secret')

    if(!payload){
        res.status(400).send({ message: 'unauthenticated' } )
    }

    const user = await UserModel.findOne({ _id: (payload as JwtPayload)._id })

    if (!user) {
      res.status(400).send({ message: "unauthenticated" });
    }

    const { password, ...data} = (user as User).toJSON()
    res.send({data, cookie})
}