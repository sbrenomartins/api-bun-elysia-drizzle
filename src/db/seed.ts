/* eslint-disable drizzle/enforce-delete-with-where */

import { faker } from "@faker-js/faker";
import postgres from "postgres";
import { env } from "../env";
import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "./schema";
import { createId } from "@paralleldrive/cuid2";

const connection = postgres(env.DATABASE_URL);
const db = drizzle(connection, { schema });

/** Reset database */
await db.delete(schema.users);
await db.delete(schema.restaurants);

console.log("Database reseted");

/** Create customers */
await db.insert(schema.users).values([
  {
    name: faker.person.fullName(),
    email: faker.internet.email(),
    phone: faker.phone.number(),
    role: "customer",
  },
  {
    name: faker.person.fullName(),
    email: faker.internet.email(),
    phone: faker.phone.number(),
    role: "customer",
  },
]);

console.log("Customers created");

const managerCreateId = createId();

/** Create managers */
await db.insert(schema.users).values([
  {
    id: managerCreateId,
    name: faker.person.fullName(),
    email: "admin@admin.com",
    phone: faker.phone.number(),
    role: "manager",
  },
]);

console.log("Manager created");

/** Create restaurants */
await db.insert(schema.restaurants).values([
  {
    name: faker.company.name(),
    description: faker.lorem.sentence(),
    managerId: managerCreateId,
  },
]);

console.log("Restaurant created");

console.log("Database seeded successfully!");

process.exit();
