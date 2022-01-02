import express, { Request, Response, NextFunction } from 'express'
import { routes } from './src/routes';
import  mongoose from 'mongoose'; 


mongoose.connect('mongodb://localhost/node_auth').then( ()=>{
    console.log('connected to the database... ')
})
const app = express(); 

app.use(express.json());

// app.get('/', (req: Request, res: Response, next: NextFunction) => {
//     res.send({message: 'Hello World'})
// });

routes(app);


app.listen(3000, ()=>{
    console.log('listening on port 3000.');
})