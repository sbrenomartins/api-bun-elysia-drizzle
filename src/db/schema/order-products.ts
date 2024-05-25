import { text, timestamp, pgTable, pgEnum, integer } from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";
import { orders } from "./orders";
import { products } from "./products";
import { relations } from "drizzle-orm";

export const orderProducts = pgTable("order_products", {
  id: text("id")
    .$defaultFn(() => createId())
    .primaryKey(),
  orderId: text("order_id")
    .notNull()
    .references(() => orders.id, {
      onDelete: "cascade",
    }),
  productId: text("product_id").references(() => products.id, {
    onDelete: "set null",
  }),
  priceInCents: integer("price_in_cents").notNull(),
  quantity: integer("quantity").notNull(),
});

export const orderProductsRelations = relations(
  orderProducts,
  ({ one, many }) => {
    return {
      orders: one(orders, {
        fields: [orderProducts.orderId],
        references: [orders.id],
        relationName: "order_products_order",
      }),
      products: one(products, {
        fields: [orderProducts.productId],
        references: [products.id],
        relationName: "order_products_product",
      }),
    };
  }
);
