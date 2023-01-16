/*
  Warnings:

  - You are about to alter the column `cost` on the `Ingredient` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to alter the column `price` on the `Pizza` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - A unique constraint covering the columns `[date]` on the table `Order` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "OrdersToPizzas" DROP CONSTRAINT "OrdersToPizzas_orderId_fkey";

-- DropForeignKey
ALTER TABLE "OrdersToPizzas" DROP CONSTRAINT "OrdersToPizzas_pizzaId_fkey";

-- DropForeignKey
ALTER TABLE "PizzasToIngredients" DROP CONSTRAINT "PizzasToIngredients_ingredientId_fkey";

-- DropForeignKey
ALTER TABLE "PizzasToIngredients" DROP CONSTRAINT "PizzasToIngredients_pizzaId_fkey";

-- AlterTable
ALTER TABLE "Ingredient" ALTER COLUMN "cost" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "Pizza" ALTER COLUMN "price" SET DATA TYPE DOUBLE PRECISION;

-- CreateIndex
CREATE UNIQUE INDEX "Order_date_key" ON "Order"("date");

-- AddForeignKey
ALTER TABLE "OrdersToPizzas" ADD CONSTRAINT "OrdersToPizzas_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrdersToPizzas" ADD CONSTRAINT "OrdersToPizzas_pizzaId_fkey" FOREIGN KEY ("pizzaId") REFERENCES "Pizza"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PizzasToIngredients" ADD CONSTRAINT "PizzasToIngredients_pizzaId_fkey" FOREIGN KEY ("pizzaId") REFERENCES "Pizza"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PizzasToIngredients" ADD CONSTRAINT "PizzasToIngredients_ingredientId_fkey" FOREIGN KEY ("ingredientId") REFERENCES "Ingredient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- RenameIndex
ALTER INDEX "Ingredient.name_unique" RENAME TO "Ingredient_name_key";

-- RenameIndex
ALTER INDEX "Pizza.name_unique" RENAME TO "Pizza_name_key";
