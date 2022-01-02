import { Router } from 'express'
import { register, login } from './controllers/auth.controller'

export const routes = ( router: Router) => {
    router.post("/api/register", register),
    router.post("/api/login", login);
}  