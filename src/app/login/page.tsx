import React from 'react'; // Add this line

import { signIn } from "../auth"
import GoogleLoginButton from "./GoogleLoginButton";

export default async function Login() {
    const handleSubmit = async (formdata: FormData) => {
        "use server";
        await signIn("credentials", formdata, {
          redirectTo: "/dashboard"
        });
    }

    const handleGoogle = async () => {
        "use server";
        await signIn("google", {
          callbackUrl: "/dashboard"
        });
    }

    return <main>
        <h1>Login</h1>

        <form action={handleSubmit}>
          <label htmlFor="email">Email</label>
          <input type="email" name="email" />

          <label htmlFor="password">Password</label>
          <input type="password" name="password" />

          <button type="submit">Login</button>
          <GoogleLoginButton />
        </form>
      </main>;
}