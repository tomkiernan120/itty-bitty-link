"use client";

import { signIn } from "next-auth/react";
import React from "react";

export default function GoogleLoginButton() {
  const handleGoogle = async () => {
    await signIn("google");
  }

    return <button type="button" onClick={handleGoogle}>Login with Google</button>;
}