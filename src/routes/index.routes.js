import { Router } from "express";
import storeRouter from "./store.routes.js";

const router = Router()
router.use(storeRouter)

export default router