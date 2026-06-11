"use client";

import { useState } from "react";

import { register } from "@/services/auth";

import {
  collection,
  addDoc
} from "firebase/firestore";

import { db } from "@/lib/firebase";

export default function RegisterPage() {

  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  async function handleRegister(e) {

    e.preventDefault();

    try {

      const userCredential =
        await register(
          email,
          password
        );

      await addDoc(
        collection(
          db,
          "users"
        ),
        {
          uid:
            userCredential.user.uid,

          name,

          email,

          points: 0,

          active: true,

          registrationPaid: false,

          paidMatches: 0,

          createdAt:
            Date.now()
        }
      );

      alert(
        "Usuario registrado"
      );

      setName("");
      setEmail("");
      setPassword("");

    } catch(error) {

      console.error(error);

      alert(
        error.message
      );

    }

  }

  return (

    <main className="
      min-h-screen
      bg-slate-900
      flex
      items-center
      justify-center
      p-6
    ">

      <form
        onSubmit={handleRegister}
        className="
          bg-slate-800
          p-8
          rounded-2xl
          w-full
          max-w-md
        "
      >

        <h1 className="
          text-white
          text-3xl
          font-bold
          mb-6
        ">
          Registro
        </h1>

        <input
          type="text"
          placeholder="Nombre"
          value={name}
          onChange={(e)=>
            setName(
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
            mb-6
            
          "
        />

        <button
          className="
            w-full
            bg-green-500
            p-3
            rounded
            text-white
            font-bold
          "
        >
          Registrarse
        </button>

      </form>

    </main>

  );

}