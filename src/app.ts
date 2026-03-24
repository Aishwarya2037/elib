import express from "express";
import type {Request, Response} from "express";

const app = express();

// http methods:- GET, POST,PUT, PATCH, DELETE
app.get("/", (req: Request, res: Response) => {
    res.json({ message: "Welcome to elib apis"})
})


export default app;