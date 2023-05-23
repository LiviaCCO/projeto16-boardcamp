import { db } from "../database/database.connection.js"

export async function getRentals(req, res) {
    try {
        const rentals = await db.query(`SELECT * FROM rentals;`)
        console.table(rentals.rows)
        res.send(rentals.rows)
    } catch (err) {
        res.status(500).send(err.message)
    }
}

export async function createRental(req, res) {
    const {customerId, gameId, daysRented} = req.body
    //const { userId } = res.locals.session
    try {
        const rent = await db.query(`INSERT INTO rentals (customerId, gameId, daysRented) VALUES (customerId, gameId, daysRented);`)
        res.sendStatus(201)
    } catch (err) {
        res.status(500).send(err.message)
    }
}
//verificar
export async function finishRental(req, res) {
    const { id } = req.params
    //const { userId } = res.locals.session
    try {
        //const finish = await db.query(`UPDATE customers SET name=name phone=phone cpf=cpf birthday=birthday WHERE id = id;`)
        res.sendStatus(200)
    } catch (err) {
        res.status(500).send(err.message)
    }
}
export async function deleteRental(req, res) {
    const { id } = req.params
    //const { userId } = res.locals.session
    try {
        const del = await db.query(`DELETE FROM rentals WHERE rentals.id=$1;`
        , [id])
        res.sendStatus(200)
    } catch (err) {
        res.status(500).send(err.message)
    }
}