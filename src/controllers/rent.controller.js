import { db } from "../database/database.connection.js"
import dayjs from "dayjs"

export async function getRentals(req, res) {
    try {
        const rentals = await db.query(`
            SELECT rentals.*, customers.name AS customer, games.name AS game
            FROM rentals
            JOIN customers ON rentals."customerId" = customers.id
            JOIN games ON rentals."gameId" = games.id;
        `)
        const rentalsTable = rentals.rows.map(rent => {
            return {
                id: rent.id,
                customerId: rent.customerId,
                gameId: rent.gameId,
                rentDate: new Date(rent.rentDate).toISOString().split('T')[0],
                daysRented: rent.daysRented,
                returnDate: rent.returnDate ? new Date(rent.returnDate).toISOString().split('T')[0] : null,
                originalPrice: rent.originalPrice,
                delayFee: rent.delayFee,
                customer: {
                    id: rent.customerId,
                    name: rent.customer
                },
                game: {
                    id: rent.gameId,
                    name: rent.game
                }
            }
        }) 
        res.send(rentalsTable)
    } catch (err) {
        res.status(500).send(err.message)
    }
}
//verificar
export async function createRental(req, res) {
    const {customerId, gameId, daysRented} = req.body;
    //const rentDate = dayjs().format('YYYY-MM-DD');
    const rentDate = new Date(Date.now()).toISOString().split('T')[0];
    

    try {
        if (daysRented<1) return res.sendStatus(400)
        //verifica o usuario
        const customer = await db.query(`
            SELECT * FROM customers WHERE id=$1;
        `, [customerId])
        if (!customer.rows[0]) return res.sendStatus(400)
        
        //verifica o jogo
        const game = await db.query(`
            SELECT * FROM games WHERE id=$1;
            `, [gameId])
        if (!game.rows[0]) return res.sendStatus(400)

        //verificar se há disponibilidade
        const disp = await db.query(`SELECT * FROM rentals WHERE "gameId"=$1 AND "returnDate" IS NULL;`, [gameId])
    
        if(disp.rows.length >= game.rows[0].stockTotal) return res.sendStatus(400)
        
        const valueGame = game.rows[0].pricePerDay;
        const originalPrice = daysRented*valueGame;
        
        await db.query(`
            INSERT INTO rentals ("customerId", "gameId", "daysRented", "rentDate", "returnDate", "delayFee", "originalPrice") 
            VALUES ($1, $2, $3, $4, $5, $6, $7);
        `, [customerId, gameId, daysRented, rentDate, null, null, originalPrice]) 
        res.sendStatus(201)
    } catch (err) {
        res.status(500).send(err.message)
    } 
}

export async function finishRental(req, res) {
    const { id } = req.params
    const returnDate = dayjs().format('YYYY-MM-DD');
    const finishDate = new Date(returnDate);
    let delayFee  = null;
    
    try {
        //verificar se existe reserva neste id
        const rentalId = await db.query(`SELECT * FROM rentals WHERE id=$1;`, [id])
        if (!rentalId.rows[0]) return res.sendStatus(400);
        //verificar se a reserva foi finalizada
        if (rentalId.rows[0].returnDate !== null) return res.sendStatus(400);
        //verificar atraso na entrega
        const startDate = new Date(rentalId.rows[0].rentDate);
        const difMs = Math.abs(finishDate - startDate);
        const difDates = Math.floor(difMs / (24 * 60 * 60 * 1000));
        if(difDates > rentalId.rows[0].daysRented){
            const game = await db.query(`
                SELECT * FROM games WHERE id=$1;
            `, [rentalId.rows[0].gameId])

            const valueGame = game.rows[0].pricePerDay;
            delayFee = (difDates - rentalId.rows[0].daysRented)*valueGame;
        }           
        await db.query(`UPDATE rentals SET "returnDate"=$1, "delayFee"=$2 WHERE id=$3;
        `, [ returnDate, delayFee, id])    
        res.sendStatus(200)
    } catch (err) {
        res.status(500).send(err.message)
    }
}
export async function deleteRental(req, res) {
    const { id } = req.params
    try {
        const rentalId = await db.query(`SELECT * FROM rentals WHERE id=$1;`, [id])
        if (!rentalId.rows[0]) return res.sendStatus(400);
        const returnDate = rentalId.rows[0].returnDate;
        if (!returnDate) return res.sendStatus(400);
        await db.query(`DELETE FROM rentals WHERE rentals.id=$1;`
        , [id])
        res.sendStatus(200)
    } catch (err) {
        res.status(500).send(err.message)
    }
}