import moment from "moment";

import prisma from '../../../prisma/prisma';
import { splitByWeeks } from "./helpers";


const queryData = async (_parent: any, { filters }: IProps) => {
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
                ingredients: true
              }
            }
          }
        }
      }
    });

    // @ts-ignore
    const dataSplittedByWeeks = splitByWeeks(allData);

    return {
      unitsSold: 1,
      ingredientsUsed: 100,
      costOfIngredients: 100.0,
      sales: 200.0,
      weeks: []
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

interface IUnitNumber {
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
