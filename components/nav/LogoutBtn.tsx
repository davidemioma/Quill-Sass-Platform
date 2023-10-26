import React from "react";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/server";

const LogoutBtn = async () => {
  return <LogoutLink>Sign out</LogoutLink>;
};

export default LogoutBtn;
