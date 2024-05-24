import Elysia, { t } from "elysia";
import { db } from "../../db/connection";
import { restaurants, users } from "../../db/schema";
import { faker } from "@faker-js/faker";

export const registerRestaurant = new Elysia().post(
  "/restaurants",
  async ({ body, set }) => {
    const { restaurantName, managerName, email, phone } = body as any;

    const [manager] = await db
      .insert(users)
      .values({
        name: managerName,
        email,
        phone,
        role: "manager",
      })
      .returning({
        id: users.id,
      });

    await db.insert(restaurants).values({
      name: restaurantName,
      managerId: manager.id,
      description: faker.lorem.sentence(),
    });

    set.status = 204;
  },
  {
    body: t.Object({
      restaurantName: t.String(),
      name: t.String(),
      phone: t.String(),
      email: t.String({ format: "email " }),
    }),
  }
);
