import { autoLoginHandler } from "@handlers/user/login/auto-login.handler";
import { loginHandler } from "@handlers/user/login/login.handler";
import routerMiddleware from "@middlewares/router.middleware";
import { ApiResponse } from "@typing/api-response.interface";
import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";

export const config = {
  api: {
    externalResolver: true,
  },
};

export default async (
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) => {
  const handlers: Record<string, NextApiHandler<ApiResponse>> = {
    POST: loginHandler,
    GET: autoLoginHandler,
    // add here handlers for other methods
  };

  await routerMiddleware(handlers, req.method, false)(req, res);
};
