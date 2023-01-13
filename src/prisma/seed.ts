import prisma from './prisma';
import moment from "moment";

const getDaysOfTheYear = (year: number): string[] => {
    const days: string[] = [];
    let currDay = new Date(year, 0, 1);

    do {
        days.push(moment(currDay).format('MMM D, YY'))
        currDay.setDate(currDay.getDate() + 1);
    } while (moment(currDay).year() === 2022)

    return days;
}

const ingredients = [
    { name: 'Pepperoni', cost: 0.12, unit: 'per slice' },
    { name: 'Cheese', cost: 0.07, unit: 'per gram' },
    { name: 'Vegetable', cost: 0.30, unit: 'per gram' },
    { name: 'Dough', cost: 1.10, unit: 'per pizza' },
    { name: 'Sauce', cost: 0.78, unit: 'per pizza' }
];

const pizzas = [
    { name: 'Pepperoni', price: 19 },
    { name: 'Branco', price: 15 },
    { name: 'All Dressed', price: 21 }
];


const orders = [...getDaysOfTheYear(2022)];

const createIngredients = async () => {
    await prisma.ingredient.createMany({
        data: ingredients,
        skipDuplicates: true
    })
}

const seed = async () => {
    await createIngredients();
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