import { Request, Response } from 'express';
import { ResetModel } from '../models/reset.model';
import { createTransport } from 'nodemailer';

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
    res.send({ message: 'success' })
}