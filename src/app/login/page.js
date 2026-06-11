"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { login } from "@/services/auth";

export default function LoginPage() {

  const router = useRouter();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  async function handleLogin(e) {

    e.preventDefault();

    try {

      setLoading(true);

      await login(
        email,
        password
      );

      alert(
        "Bienvenido"
      );

      router.push(
        "/dashboard"
      );

    } catch (error) {

      console.error(error);

      alert(
        "Correo o contraseña incorrectos"
      );

    } finally {

      setLoading(false);

    }

  }

  return (

    <main
      className="
        min-h-screen
        bg-slate-900
        flex
        items-center
        justify-center
        p-5
      "
    >

      <form
        onSubmit={handleLogin}
        className="
          bg-slate-800
          p-8
          rounded-2xl
          w-full
          max-w-md
        "
      >

        <h1
          className="
            text-white
            text-3xl
            font-bold
            mb-6
          "
        >
          Iniciar Sesión
        </h1>

        <input
          type="email"
          placeholder="Correo"
          value={email}
          onChange={(e)=>
            setEmail(
              e.target.value
            )
          }
          className="
            w-full
            p-3
            rounded
            mb-4
            
          "
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e)=>
            setPassword(
              e.target.value
            )
          }
          className="
            w-full
            p-3
            rounded
            mb-4
            
          "
        />

        <button
          disabled={loading}
          className="
            w-full
            bg-green-500
            p-3
            rounded
            text-white
            font-bold
          "
        >

          {
            loading
              ? "Entrando..."
              : "Iniciar Sesión"
          }

        </button>

      </form>

    </main>

  );

}