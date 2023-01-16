export interface IIngredient {
    id: number
    name: string
    cost: number
    createdAt: Date
    unit: string
}

export interface IPizza {
    id: number
    name: string
    price: number
    createdAt: Date
    ingredients: IIngredient[]
}

export interface IOrder {
    id: number
    date: Date
    createdAt: Date
    pizzas: IPizza[]
}