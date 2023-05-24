import { db } from "../database/database.connection.js"

export async function getCustomers(req, res) {
    try {
        const customers = await db.query(`SELECT * FROM customers;`)
        console.table(customers.rows)
        res.send(customers.rows)
    } catch (err) {
        res.status(500).send(err.message)
    }
}

export async function getCustomerId(req, res) {
    const { id } = req.params

    try {
        const customerId = await db.query(`
            SELECT * FROM customers WHERE customers.id=$1;`
        , [id])

        const customer = {...customerId.rows[0]}
        res.send(customer)
    } catch (err) {
        res.status(500).send(err.message)
    }
}

export async function createCustomer(req, res) {
    const { name, phone, cpf, birthday } = req.body
    //const { userId } = res.locals.session
    try {
        const cpfCustomer = await db.query(`
            SELECT * FROM customers WHERE cpf=$1;
            `, [cpf]);
        if(cpfCustomer){
            res.sendStatus(409)
        }
        const newCustomer = await db.query(`
            INSERT INTO customers (name, phone, cpf, birthday) VALUES ($1, $2, $3, $4);
            `, [name, phone, cpf, birthday]);
        res.sendStatus(201)
    } catch (err) {
        res.status(500).send(err.message)
    }
}

export async function editCustomerId(req, res) {
    const { id } = req.params
    const { name, phone, cpf, birthday } = req.body
    //const { userId } = res.locals.session
    try {
        const cpfCustomer = await db.query(`SELECT * FROM customers WHERE cpf=$1;
        `, [cpf]);
        if(cpfCustomer){
            res.sendStatus(409)
        }
        //verificar este UPDATE
        const newCustomer = await db.query(`UPDATE customers SET name=name phone=phone cpf=cpf birthday=birthday WHERE id = id;`)
        res.sendStatus(200)
    } catch (err) {
        res.status(500).send(err.message)
    }
}