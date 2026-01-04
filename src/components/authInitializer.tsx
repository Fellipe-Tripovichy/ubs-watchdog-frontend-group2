"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { getUserData, selectIsAuthenticated, selectUser, toggleLoading } from "@/features/auth/authSlice";

export function AuthInitializer() {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const user = useAppSelector(selectUser);

  useEffect(() => {
    const getCookie = (name: string) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(';').shift();
      return null;
    };

    const accessToken = getCookie('accessToken');

    if (accessToken && !isAuthenticated && !user) {
      dispatch(getUserData());
    } else {
      dispatch(toggleLoading(false));
    }
  }, [dispatch, isAuthenticated, user]);

  return null;
}

