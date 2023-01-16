import moment from "moment";

import prisma from '../../../prisma/prisma';
import { splitByWeeks, calculateData } from "./helpers";


const queryData = async (_parent: any, { filters }: IProps): Promise<IDataToReturn> => {
  try {
    const { startDate, endDate, monthNumber, pizzas } = filters;
    let dateLTE: Date | null = null;
    let dateGTE: Date | null = null;

    if (monthNumber && monthNumber >= 1 && monthNumber <= 12) {
      const firstDay = moment([2022, monthNumber - 1]); // hardcoded for 2022 year
      const lastDay = moment(firstDay).endOf('month');

      dateGTE = firstDay.toDate()
      dateLTE = lastDay.toDate()
    } else {
      if (startDate) {
        dateGTE = startDate;

      }

      if (endDate) {
        dateLTE = endDate;
      }
    }

    const allData = await prisma.order.findMany({
      orderBy: {
        date: 'asc'
      },
      where: {
        ...(monthNumber || startDate || endDate
        ? ({
              date: {
                ...(dateLTE ? ({ lte: dateLTE }) : ({})),
                ...(dateGTE ? ({ gte: dateGTE }) : ({}))
              }
            })
        : ({})),
        ...(pizzas?.length
                ? ({
                  pizzas: {
                    some: {
                      pizza: {
                        name: {
                          in: pizzas
                        }
                      }
                    }
                  }
                })
                : ({})
        )
      },
      include: {
        pizzas: {
          include: {
            pizza: {
              include: {
                ingredients: {
                  include: {
                    ingredient: true
                  }
                }
              }
            }
          }
        }
      }
    });


    const dataSplittedByWeeks = splitByWeeks(allData);
    const calculatedDataByWeeks = dataSplittedByWeeks.map(weekData => calculateData(weekData));
    const calculatedTotalData = calculateData(allData);

    const { unitsSold, ingredientsUsed, costOfIngredients, sales } = calculatedTotalData;


    return {
      unitsSold,
      ingredientsUsed,
      costOfIngredients,
      sales,
      weeks: calculatedDataByWeeks
    };
  } catch (err) {
    console.error(err);
    throw new Error(err);
  }
}

export default {
  queryData
}

interface IProps {
  filters: IFilters
}

interface IFilters {
  startDate?: Date
  endDate?: Date
  monthNumber?: number
  pizzas?: string[]
}

export interface IUnitNumber {
  name: string
  number: number
}

interface IDataItemToReturn {
  unitsSold: IUnitNumber[]
  ingredientsUsed: IUnitNumber[]
  costOfIngredients: number
  sales: number
}

interface IDataToReturn extends IDataItemToReturn{
  weeks: IWeekDataItemToReturn[]
}

interface IWeekDataItemToReturn extends IDataItemToReturn {
  startDate: Date
  endDate: Date
}
