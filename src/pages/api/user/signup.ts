import { signupHandler } from "@handlers/user/signup/signup.handler";
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
    POST: signupHandler,
    // add here handlers for other methods
  };

  await routerMiddleware(handlers, req.method, false)(req, res);
};
