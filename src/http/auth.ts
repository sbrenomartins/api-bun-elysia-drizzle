import jwt from "@elysiajs/jwt";
import Elysia, { t, type Static } from "elysia";
import { env } from "../env";
import { UnauthorizedError } from "./errors/unauthorized-error";

const jwtPayload = t.Object({
  sub: t.String(),
  restaurantId: t.Optional(t.String()),
});

export const auth = new Elysia()
  .error({
    UNAUTHORIZED: UnauthorizedError,
  })
  .onError(({ error, code, set }) => {
    switch (code) {
      case "UNAUTHORIZED": {
        set.status = 401;
        return { code, message: error.message };
      }
    }
  })
  .use(
    jwt({
      secret: env.JWT_SECRET_KEY,
      schema: jwtPayload,
    })
  )
  .derive({ as: "global" }, ({ jwt, cookie: { auth } }) => {
    return {
      login: async (payload: Static<typeof jwtPayload>) => {
        const token = await jwt.sign(payload);

        auth.set({
          httpOnly: true,
          maxAge: 60 * 60 * 24 * 7, // 7 days
          path: "/",
          value: token,
        });
      },

      logout: () => {
        auth.remove();
      },

      getCurrentUser: async () => {
        const payload = await jwt.verify(auth.value);

        if (!payload) {
          throw new UnauthorizedError();
        }

        return {
          userId: payload.sub,
          restaurantId: payload.restaurantId,
        };
      },
    };
  });
