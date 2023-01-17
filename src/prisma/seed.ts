import * as moment from "moment";
const fs = require('fs');
const path = require("path");

import prisma from './prisma';

const ingredients = [
    { name: 'Pepperoni', cost: 0.12, unit: 'per slice' },
    { name: 'Cheese', cost: 0.07, unit: 'per gram' },
    { name: 'Vegetable', cost: 0.30, unit: 'per gram' },
    { name: 'Dough', cost: 1.10, unit: 'per pizza' },
    { name: 'Sauce', cost: 0.78, unit: 'per pizza' }
];

const pizzas = [
    { name: 'Pepperoni', price: 19, ingredients: [
            { name: 'Pepperoni', units: 16 },
            { name: 'Cheese', units: 40 },
            { name: 'Vegetable', units: 0 },
            { name: 'Dough', units: 1 },
            { name: 'Sauce', units: 1 },
        ]},
    { name: 'Branco', price: 15, ingredients: [
            { name: 'Pepperoni', units: 0 },
            { name: 'Cheese', units: 90 },
            { name: 'Vegetable', units: 0 },
            { name: 'Dough', units: 1 },
            { name: 'Sauce', units: 1 },
        ] },
    { name: 'All Dressed', price: 21, ingredients: [
            { name: 'Pepperoni', units: 8 },
            { name: 'Cheese', units: 30 },
            { name: 'Vegetable', units: 30 },
            { name: 'Dough', units: 1 },
            { name: 'Sauce', units: 1 },
        ]}
];

const createIngredients = async () => {
    await prisma.ingredient.createMany({
        data: ingredients,
        skipDuplicates: true
    })
};

const createPizzas = async () => {
    const ingredientsFromDB = await prisma.ingredient.findMany({
        select: {
            id: true,
            name: true
        }
    });

    await Promise.all(pizzas.map((pizzaItem) => (
        prisma.pizza.upsert({
            where: { name: pizzaItem.name },
            update: {},
            create: {
                name: pizzaItem.name,
                price: pizzaItem.price,
                ingredients: {
                    create: (pizzaItem.ingredients || []).map((ingredient) => ({
                        units: ingredient.units,
                        ingredient: {
                            connect: {
                                id: ingredientsFromDB.find((ingredientFromDB) => ingredientFromDB.name === ingredient.name)?.id
                            }
                        }
                    }))
                }
            }
        })
    )));
};

const createOrders = async () => {
    const ordersObj = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../lib/assets/orders.json'), 'utf8'));

    const pizzasFromDB = await prisma.pizza.findMany({
        select: {
            name: true,
            id: true
        }
    });

    await Promise.all((ordersObj || []).map((orderItem: IOrderItem) => (
        prisma.order.upsert({
            where: { date: moment(orderItem.date, "MMM D, YY").toDate() },
            update: {},
            create: {
                date: moment(orderItem.date, "MMM D, YY").toDate(),
                pizzas: {
                    create: (['Branco', 'Pepperoni', 'All Dressed']).map((pizzaName) => ({
                        // @ts-ignore
                        number: +orderItem[pizzaName],
                        pizza: {
                            connect: {
                                id: pizzasFromDB.find((pizzaFromDB) => pizzaFromDB.name === pizzaName)?.id
                            }
                        }
                    }))
                }
            }
        })
    )))
}

const seed = async () => {
    await createIngredients();
    await createPizzas();
    await createOrders();
}

seed()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
        process.exit(0)
    })

interface IOrderItem {
    date: string,
    Pepperoni: number,
    Branco: number,
    "All Dressed": number
}