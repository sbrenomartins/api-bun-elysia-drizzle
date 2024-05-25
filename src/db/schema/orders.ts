import { text, timestamp, pgTable, pgEnum, integer } from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";
import { users } from "./users";
import { restaurants } from "./restaurants";
import { relations } from "drizzle-orm";
import { orderProducts } from "./order-products";

export const orderStatusEnum = pgEnum("orders_status", [
  "pending",
  "processing",
  "delivering",
  "delivered",
  "canceled",
]);

export const orders = pgTable("orders", {
  id: text("id")
    .$defaultFn(() => createId())
    .primaryKey(),
  customerId: text("customer_id").references(() => users.id, {
    onDelete: "set null",
  }),
  restaurantId: text("restaurant_id")
    .notNull()
    .references(() => restaurants.id, {
      onDelete: "cascade",
    }),
  status: orderStatusEnum("status").default("pending").notNull(),
  totalInCents: integer("total_in_cents").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const ordersRelations = relations(orders, ({ one, many }) => {
  return {
    customer: one(users, {
      fields: [orders.customerId],
      references: [users.id],
      relationName: "order_customer",
    }),
    restaurant: one(restaurants, {
      fields: [orders.restaurantId],
      references: [restaurants.id],
      relationName: "order_restaurant",
    }),
    orderProducts: many(orderProducts),
  };
});
