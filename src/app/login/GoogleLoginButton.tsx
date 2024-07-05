"use client";

import Button from "@/components/Button/primary";
import { signIn } from "next-auth/react";
import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGoogle } from "@fortawesome/free-brands-svg-icons";

export default function GoogleLoginButton() {
  const handleGoogle = async () => {
    await signIn("google");
  }

  return <Button variant="secondary" onClick={handleGoogle} label={<>Google <FontAwesomeIcon icon={faGoogle} /></>} />
}