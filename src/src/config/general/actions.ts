import { createAction } from "@reduxjs/toolkit";
export const userLogoutAction = createAction("user/LOG_OUT");
export const userIdAction = createAction("auth/updateUserId");

export const reset = createAction("RESET");
