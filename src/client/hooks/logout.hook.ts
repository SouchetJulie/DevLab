import { useAppDispatch } from "@hooks/store-hook";
import { addAlert } from "@stores/alert.store";
import { clearUser } from "@stores/user.store";
import { ApiResponse } from "@typing/api-response.interface";
import axios from "axios";
import { useRouter } from "next/router";
import React from "react";

export const useLogout = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const logout: React.MouseEventHandler<HTMLElement> = (event) => {
    event.preventDefault();
    event.stopPropagation();

    axios
      .post<ApiResponse>("/api/user/logout")

      .then(() => {
        dispatch(clearUser());
        dispatch(
          addAlert({
            message: "Déconnecté",
            success: true,
            ttl: 1500,
          })
        );
        router.push("/");
      })

      .catch(() => {
        dispatch(
          addAlert({
            message: "Déconnexion échouée.",
            success: false,
          })
        );
      });
  };

  return logout;
};
