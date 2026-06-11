"use client";

import { useEffect, useState } from "react";

import {
  collection,
  getDocs,
  doc,
  updateDoc
} from "firebase/firestore";

import { db } from "@/lib/firebase";

export default function UsersPage() {

  const [users, setUsers] =
    useState([]);

  useEffect(() => {

    loadUsers();

  }, []);

  async function loadUsers() {

    const snapshot =
      await getDocs(
        collection(
          db,
          "users"
        )
      );

    const data =
      snapshot.docs.map(
        document => ({

          firestoreId:
            document.id,

          ...document.data()

        })
      );

    setUsers(data);

  }

  async function addPoints(
    firestoreId,
    currentPoints,
    amount
  ) {

    try {

      await updateDoc(
        doc(
          db,
          "users",
          firestoreId
        ),
        {
          points:
            currentPoints +
            amount
        }
      );

      loadUsers();

    } catch(error) {

      console.error(error);

      alert(
        "Error al actualizar"
      );

    }

  }

  return (

    <main
      className="
        min-h-screen
        bg-slate-900
        text-white
        p-8
      "
    >

      <div
        className="
          max-w-6xl
          mx-auto
        "
      >

        <h1
          className="
            text-4xl
            font-bold
            mb-8
          "
        >
          Usuarios
        </h1>

        <div
          className="
            grid
            gap-4
          "
        >

          {
            users.map(
              user => (

                <div
                  key={
                    user.firestoreId
                  }
                  className="
                    bg-slate-800
                    p-5
                    rounded-xl
                  "
                >

                  <h2
                    className="
                      text-2xl
                      font-bold
                    "
                  >
                    {user.name}
                  </h2>

                  <p>
                    {user.email}
                  </p>

                  <p
                    className="
                      mt-2
                      text-xl
                    "
                  >
                    Puntos:
                    {" "}
                    {user.points}
                  </p>

                  <div
                    className="
                      flex
                      gap-3
                      mt-4
                    "
                  >

                    <button
                      onClick={() =>
                        addPoints(
                          user.firestoreId,
                          user.points,
                          20
                        )
                      }
                      className="
                        bg-green-500
                        px-4
                        py-2
                        rounded
                      "
                    >
                      +20
                    </button>

                    <button
                      onClick={() =>
                        addPoints(
                          user.firestoreId,
                          user.points,
                          50
                        )
                      }
                      className="
                        bg-blue-500
                        px-4
                        py-2
                        rounded
                      "
                    >
                      +50
                    </button>

                    <button
                      onClick={() =>
                        addPoints(
                          user.firestoreId,
                          user.points,
                          100
                        )
                      }
                      className="
                        bg-purple-500
                        px-4
                        py-2
                        rounded
                      "
                    >
                      +100
                    </button>

                  </div>

                </div>

              )
            )
          }

        </div>

      </div>

    </main>

  );

}