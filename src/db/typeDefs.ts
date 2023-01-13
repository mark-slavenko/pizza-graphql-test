// The GraphQL schema
export default `
  scalar DateTime
  scalar JSON

  type Order {
    id: Int!
    date: DateTime!
    createdAt: DateTime!
    pizzas: [OrdersToPizzas]!
  }
  
  type Pizza {
    id: Int!
    name: String!
    price: Float!
    createdAt: DateTime!
    ingredients: [PizzasToIngredients]!
  }
  
  type Ingredient {
    id: Int!
    name: String!
    cost: Float!
    unit: String!
  }
  
  type PizzasToIngredients {
    pizzaId: Int!
    ingredientId: Int!
    units: Int!
  }
  
  type OrdersToPizzas {
    pizzaId: Int!
    orderId: Int!
    number: Int!
  }

  type Query {    
    queryOrders(filters: [JSON]): [Order]
  }
`
