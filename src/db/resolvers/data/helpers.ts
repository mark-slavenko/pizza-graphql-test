import * as moment from "moment";

import { IUnitNumber } from "./data";


export const splitByWeeks = (orders: any[]) => {
    let weekToPush = 0;
    const weeks: any[][] = [[]];

    orders.forEach((order) => {
        const day = moment(order.date).isoWeekday();

        if (day === 1) {
            weeks.push([]);
        }

        weeks[weekToPush].push(order);

        if (day === 7) {
            weekToPush += 1;
        }
    });

    return weeks;
};

const checkHaveUnit = (units: IUnitNumber[], unitName: string, unitValue: number) => {
    const exists = units.findIndex((unit) => unit.name === unitName);

    if (exists === -1) {
        units.push({ name: unitName, number: unitValue });
    } else {
        units[exists].number += unitValue;
    }
}

export const calculateData = (orders: any) => {
    const dataToReturn = {
        startDate: orders[0]?.date,
        endDate: orders[orders.length - 1]?.date,
        unitsSold: [],
        ingredientsUsed: [],
        costOfIngredients: 0,
        sales: 0,
    };

    orders.forEach((order: any) => {
        for (let i = 0; i < order?.pizzas?.length; i += 1) {
            const pizzaPivotItem = order?.pizzas[i];
            dataToReturn.sales += pizzaPivotItem?.pizza?.price * pizzaPivotItem?.number;

            checkHaveUnit(dataToReturn.unitsSold, pizzaPivotItem?.pizza?.name, pizzaPivotItem?.number);

            for (let k = 0; k < pizzaPivotItem?.pizza?.ingredients?.length; k += 1) {
                const ingredientPivotItem = pizzaPivotItem?.pizza?.ingredients[k];
                dataToReturn.costOfIngredients += pizzaPivotItem?.pizza?.ingredients[k]?.ingredient?.cost * ingredientPivotItem?.units * pizzaPivotItem?.number;

                checkHaveUnit(dataToReturn.ingredientsUsed, ingredientPivotItem?.ingredient?.name, ingredientPivotItem?.units * pizzaPivotItem?.number);
            }
        }
    });

    return dataToReturn;
}
