import { Request, Response } from 'express'
import { Joi } from 'express-validation'
import bcryptjs from 'bcryptjs'
import { UserModel } from '../models/user.model';


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

    res.send(user)
}