import { Request, Response } from 'express';
import { ResetModel } from '../models/reset.model';
import { createTransport } from 'nodemailer';
import { UserModel } from '../models/user.model';
import bcryptjs from 'bcryptjs'

const transporter = createTransport({
    host: '0.0.0.0',
    port: 1025
})

export const forgot = async ( req: Request, res: Response ) => {
    const email = req.body.email;
    const token = Math.random().toString(20).substr(2, 12)

    const reset = new ResetModel({ email, token })
    await reset.save()

    const url = `http://localhost:3000/reset/${token}`

    await transporter.sendMail({
        from: 'admin@example.com',
        to: email,
        subject: 'Reset your password',
        html: `Click <a href="${url}">here</a> to reset your password`
    })
    res.send({ message: 'check your email. ' })
}

export const reset = async(req: Request, res:Response) => {
    const body = req.body

    if(body.password !== body.password_confirm){
        return res.status(400).send({ message: 'password do not match.' })
    }

    const resetPassword = await ResetModel.findOne({ token: body.token })
    if(!resetPassword){
        return res.status(400).send({ message: 'Invalid link!' })
    }

    const { email } = resetPassword.toJSON()
    const user = await UserModel.findOne({ email })
    if(!user){
        return res.status(404).send({ message: 'User does not exist.' })  
    }

    const salt = await bcryptjs.genSalt(10)
    user.password = await bcryptjs.hash(body.password, salt)
    await user.save()
    res.send('success')
}