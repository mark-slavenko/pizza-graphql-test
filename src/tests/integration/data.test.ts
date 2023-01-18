import dataResolver from "../../db/resolvers/data/data";


describe('queryData resolver', () => {
    it('All data', async () => {
        const res = await dataResolver.queryData(
            null,
            { filters: {}}
        );

        const resultToTest =  {
            costOfIngredients: res.costOfIngredients,
            sales: res.sales
        }

        await expect(resultToTest).toEqual({
            costOfIngredients: 542539.6000000001,
            sales: 1041155
        });
    });

    it('Month filer', async () => {
        const res = await dataResolver.queryData(
            null,
            { filters: { monthNumber: 5 }}
        );

        const resultToTest =  {
            costOfIngredients: res.costOfIngredients,
            sales: res.sales
        }

        await expect(resultToTest).toEqual({
            costOfIngredients: 41119.759999999966,
            sales: 79505
        });
    });

    it('Branco pizza one day', async () => {
        const res = await dataResolver.queryData(
            null,
            { filters: { pizzas: ["Branco"], endDate: 'Jan 1, 22' }}
        );

        const resultToTest =  {
            costOfIngredients: res.costOfIngredients,
            sales: res.sales,
            unitsSold: res.unitsSold,
            weeks: res.weeks.map(week => ({
                    sales: week.sales
                }))
        }

        await expect(resultToTest).toEqual({
            costOfIngredients: 130.88000000000002,
            sales: 240,
            unitsSold: [
                {
                    name: "Branco",
                    number: 16
                }
            ],
            weeks: [
                {
                    sales: 240
                }
            ]
        });
    });

    it('Empty data', async () => {
        const res = await dataResolver.queryData(
            null,
            { filters: { endDate: 'Jan 1, 21' }}
        );

        const resultToTest =  {
            costOfIngredients: res.costOfIngredients,
            sales: res.sales
        }

        await expect(resultToTest).toEqual({
            costOfIngredients: 0,
            sales: 0
        });
    });
});