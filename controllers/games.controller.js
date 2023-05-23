import { db } from "../database/database.connection.js"

export async function getGames(req, res) {
    try {
        const games = await db.query(`SELECT * FROM games;`)
        console.table(games.rows)
        res.send(games.rows)
    } catch (err) {
        res.status(500).send(err.message)
    }
}

export async function createGame(req, res) {
    const { name, image, stockTotal, pricePerDay } = req.body
    //const { userId } = res.locals.session
    try {
        const nameGame = await db.query(`SELECT * FROM games WHERE name=name;`)
        if(!nameGame){
            res.sendStatus(409)
        }

        const games = await db.query(`INSERT INTO games (name, image, stockTotal, pricePerDay) VALUES (name, image, stockTotal, pricePerDay);`)
        res.sendStatus(201)
    } catch (err) {
        res.status(500).send(err.message)
    }
}