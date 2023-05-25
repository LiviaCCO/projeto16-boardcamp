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
        if(!customerId.rows[0]) return res.sendStatus(404);
        res.send(customerId.rows[0])

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
        console.log(cpfCustomer.rows[0]);
        if(cpfCustomer.rows[0]) return res.sendStatus(409);

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
        //para o caso de id não existente
        const customerId = await db.query(`
            SELECT * FROM customers WHERE customers.id=$1;`
        , [id])
        if(!customerId.rows[0]) return res.sendStatus(404);

        const cpfCustomer = await db.query(`SELECT * FROM customers WHERE cpf=$1;
        `, [cpf]);
        //para o caso de tentativa de alteração do proprio cpf 
        if (!cpfCustomer.rows[0]) return res.send('CPF não pode ser alterado!');
        //para o caso de tentativa de colocar cpf de outro usuario
        if (Number(cpfCustomer.rows[0].id) !== Number(id)) return res.sendStatus(409);
        
        await db.query(`UPDATE customers SET name=$1, phone=$2, birthday=$3 WHERE id=$4 ;`, [name, phone, birthday, id])
        res.sendStatus(200)

    } catch (err) {
        res.status(500).send(err.message)
    }
}