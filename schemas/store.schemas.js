import joi from "joi"

export const gameSchema = joi.object({
    name: joi.string().required(),
    image: joi.string().required(),
    stockTotal: joi.number().integer().min(0).required(),
    pricePerDay: joi.number().integer().min(0).required()
});

export const customerSchema = joi.object({
    name: joi.string().required(),
    phone: joi.string().length(10, 11).regex(/^\d+$/).required(),
    cpf: joi.string().length(11).regex(/^\d+$/).required(),
    birthday: joi.date().max('now').min('1900-01-01').required()
});

export const rentalSchema = joi.object({
    customerId: joi.number().required(),
    gameId: joi.number().required(),
    daysRented: joi.number().required()
});

