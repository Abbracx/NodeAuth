import { Router } from 'express'
import { register, login, user, logout} from './controllers/auth.controller'
import { forgot, reset } from './controllers/forgot.controller';

export const routes = ( router: Router) => {
    router.post("/api/register", register),
    router.post("/api/login", login);
    router.get("/api/user", user);
    router.post("/api/logout", logout);
    router.post("/api/forgot", forgot);
    router.post("/api/reset", reset);
}  