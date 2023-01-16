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
  
  input QueryFilters {
    startDate: DateTime,
    endDate: DateTime,
    monthNumber: Int,
    pizzas: [String]
  }
  
  type Data {
    unitsSold: [UnitItem]!
    ingredientsUsed: [usedIngredientItem]!
    costOfIngredients: Float!
    sales: Float!
    weeks: [WeekDataItem]!
  }
  
  type WeekDataItem {
    startDate: DateTime!
    endDate: DateTime!
    unitsSold: [UnitItem]!
    ingredientsUsed: [usedIngredientItem]!
    costOfIngredients: Float!
    sales: Float!
  }
  
  type UnitItem {
    name: String!
    number: Int!
  }
  
  type usedIngredientItem {
    name: String!
    number: Int!
  }
  

  type Query {    
    queryData(filters: QueryFilters): Data
  }
`
