import { Router } from "express";
import { getGames, createGame } from "../controllers/games.controller.js"
import { getCustomers, getCustomerId, createCustomer, editCustomerId } from "../controllers/customers.controller.js"
import { getRentals, createRental, finishRental, deleteRental } from "../controllers/rent.controller.js"
import { validateSchema } from "../middlewares/validateSchema.middleware.js"
import { gameSchema, customerSchema, rentalSchema} from "../schemas/store.schema.js"

const storeRouter = Router()

storeRouter.get("/games", getGames)
storeRouter.post("/games", validateSchema(gameSchema), createGame)
storeRouter.get("/customers", getCustomers)
storeRouter.get("/customers/:id", getCustomerId)
storeRouter.post("/customers", validateSchema(customerSchema), createCustomer)
storeRouter.put("/customers/:id", validateSchema(customerSchema), editCustomerId)
storeRouter.get("/rentals", getRentals)
storeRouter.post("/rentals", validateSchema(rentalSchema), createRental) 
storeRouter.post("/rentals/:id/return", validateSchema(rentalSchema), finishRental)
storeRouter.delete("/rentals/:id", deleteRental)

export default storeRouter