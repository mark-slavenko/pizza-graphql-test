import moment from "moment";

import { IOrder } from "../../types";


export const splitByWeeks = (orders: IOrder[]) => {
    let weekToPush = 0;
    const weeks: IOrder[][] = [[]];

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

// const calculateData = (orders: any) => {
//     const dataToReturn = {
//         startDate: orders[0]?.date,
//         endDate: orders[orders.length - 1]?.date,
//         unitsSold: [],
//         ingredientsUsed: [],
//         costOfIngredients: 0,
//         sales: 0,
//     };
//
//     orders.forEach((order: any) => {
//         let sales = 0;
//         let costOfIngredients = 0;
//
//         for (let i = 0; i < order?.pizzas?.length; i += 1) {
//             const pizzaPivotItem = order?.pizzas[i];
//             sales += pizzaPivotItem?.pizza?.price;
//
//             dataToReturn.unitsSold[pizzaPivotItem?.pizza?.name] += pizzaPivotItem?.number;
//         }
//     });
//
//     return dataToReturn;
// }
