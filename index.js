// in package.json :    "type":"module" has been provided so we can directly use """ import express from 'express';"""
// or else we need to give as normal """const express = require('express');""""

import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { UserSignuproute } from "./routes/usersignuptoute.js";
import cors from "cors";
import cookieParser from "cookie-parser";

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors({
  origin: ["http://127.0.0.1:5173"],
  credentials: true
}));
app.use(cookieParser());
app.use("/auth", UserSignuproute);

mongoose.connect(
  "mongodb+srv://root:10xaca@cluster0.6tj95nx.mongodb.net/ground-improvement"
);

app.listen(process.env.PORT, () => {
  console.log("app listening at port", process.env.PORT);
});
