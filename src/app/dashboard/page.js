"use client";

import { useEffect, useState } from "react";

import Link from "next/link";

import { auth, db } from "@/lib/firebase";

import { logout } from "@/services/auth";

import { onAuthStateChanged } from "firebase/auth";

import {
  collection,
  getDocs,
  query,
  where
} from "firebase/firestore";

import MatchCard from "@/components/MatchCard";

export default function DashboardPage() {

  const [userData, setUserData] =
    useState(null);

  const [matches, setMatches] =
    useState([]);

  useEffect(() => {

    loadData();

  }, []);

  async function loadData() {

    onAuthStateChanged(
      auth,
      async (user) => {

        if (!user) {

          window.location.href =
            "/login";

          return;

        }

        try {

          const userQuery =
            query(
              collection(
                db,
                "users"
              ),
              where(
                "uid",
                "==",
                user.uid
              )
            );

          const userSnapshot =
            await getDocs(
              userQuery
            );

          if (
            !userSnapshot.empty
          ) {

            const data =
              userSnapshot.docs[0]
                .data();

            setUserData(data);

          } else {

            setUserData({
              name:
                user.email,
              email:
                user.email,
              uid:
                user.uid,
              role:
                "user",
              points:
                0
            });

          }

          const matchesSnapshot =
            await getDocs(
              collection(
                db,
                "matches"
              )
            );

          const matchesData =
  matchesSnapshot.docs.map(
    document => ({
      id:
        document.id,
      ...document.data()
    })
  );

matchesData.sort(
  (a, b) => {

    const aFinished =
      a.status === "finished";

    const bFinished =
      b.status === "finished";

    if (
      aFinished &&
      !bFinished
    ) {
      return 1;
    }

    if (
      !aFinished &&
      bFinished
    ) {
      return -1;
    }

    const dateA =
      new Date(
        `${a.date}T${a.time}`
      );

    const dateB =
      new Date(
        `${b.date}T${b.time}`
      );

    return dateA - dateB;

  }
);

setMatches(
  matchesData
);

        } catch(error) {

          console.error(error);

        }

      }
    );

  }

  if (!userData) {

    return (

      <main
        className="
          min-h-screen
          bg-slate-900
          text-white
          flex
          items-center
          justify-center
        "
      >
        Cargando...
      </main>

    );

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
          max-w-7xl
          mx-auto
        "
      >

        <div
          className="
            flex
            justify-between
            items-start
            mb-8
          "
        >

          <div>

            <h1
              className="
                text-4xl
                font-bold
                mb-4
              "
            >
              Hola {userData.name}
            </h1>

            <p>
              Correo:
              {" "}
              {userData.email}
            </p>

            <p>
              UID:
              {" "}
              {userData.uid}
            </p>

            <p>
              Rol:
              {" "}
              {userData.role}
            </p>

          </div>

          <button
            onClick={async () => {

              await logout();

              window.location.href =
                "/login";

            }}
            className="
              bg-red-500
              px-4
              py-2
              rounded-xl
              font-bold
            "
          >
            Cerrar Sesión
          </button>

        </div>

        <div
  className="
    bg-slate-800
    rounded-xl
    p-5
    mb-8
  "
>

  <h2
    className="
      text-2xl
      font-bold
    "
  >
    Créditos disponibles:
    {" "}
    {userData.points}
  </h2>

  <p
    className="
      text-xl
      mt-3
      font-semibold
    "
  >
    Score:
    {" "}
    {userData.score || 0}
  </p>

  <p
    className="
      text-slate-400
      text-sm
      mt-1
    "
  >
    Puntos ganados por acertar predicciones
  </p>

</div>

        {
          userData.role ===
          "admin" && (

            <div
              className="
                bg-slate-800
                rounded-xl
                p-5
                mb-8
              "
            >

              <h2
                className="
                  text-2xl
                  font-bold
                  mb-4
                "
              >
                ⚙️ Administración
              </h2>

              <div
                className="
                  flex
                  gap-4
                  flex-wrap
                "
              >

                <Link
                  href="/admin"
                  className="
                    bg-green-500
                    px-5
                    py-3
                    rounded-xl
                    font-bold
                  "
                >
                  Crear Partidos
                </Link>

                <Link
                  href="/admin/results"
                  className="
                    bg-blue-500
                    px-5
                    py-3
                    rounded-xl
                    font-bold
                  "
                >
                  Resultados
                </Link>

                <Link
                  href="/admin/users"
                  className="
                    bg-purple-500
                    px-5
                    py-3
                    rounded-xl
                    font-bold
                  "
                >
                  Usuarios
                </Link>

              </div>

            </div>

          )
        }

        <div
          className="
            bg-slate-800
            rounded-xl
            p-5
            mb-8
          "
        >

          <Link
            href="/dashboard/predictions"
            className="
              bg-yellow-500
              px-5
              py-3
              rounded-xl
              font-bold
              inline-block
            "
          >
            Mis Predicciones
          </Link>

          <Link
  href="/dashboard/ranking"
  className="
    bg-orange-500
    px-5
    py-3
    rounded-xl
    font-bold
  "
>
  Ranking
</Link>

        </div>

        <section
          className="
            bg-slate-800
            rounded-2xl
            p-6
          "
        >

          <h2
            className="
              text-3xl
              font-bold
              mb-6
            "
          >
            Partidos
          </h2>

          <div
            className="
              grid
              gap-5
            "
          >

            {
              matches.length === 0
              ? (
                <p>
                  No hay partidos registrados
                </p>
              )
              : (
                matches.map(
                  match => (

                    <MatchCard
                      key={match.id}
                      match={match}
                    />

                  )
                )
              )
            }

          </div>

        </section>

      </div>

    </main>

  );

}