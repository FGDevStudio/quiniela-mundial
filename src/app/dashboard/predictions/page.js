"use client";

import { useEffect, useState } from "react";

import { auth, db } from "@/lib/firebase";

import { onAuthStateChanged } from "firebase/auth";

import {
  collection,
  getDocs,
  query,
  where
} from "firebase/firestore";

export default function PredictionsPage() {

  const [predictions, setPredictions] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    loadPredictions();

  }, []);

  async function loadPredictions() {

    onAuthStateChanged(
      auth,
      async (user) => {

        if (!user) {

          window.location.href =
            "/login";

          return;

        }

        try {

          const predictionsQuery =
            query(
              collection(
                db,
                "predictions"
              ),
              where(
                "userUid",
                "==",
                user.uid
              )
            );

          const predictionsSnapshot =
            await getDocs(
              predictionsQuery
            );

          const matchesSnapshot =
            await getDocs(
              collection(
                db,
                "matches"
              )
            );

          const matches =
            {};

          matchesSnapshot.docs.forEach(
            document => {

              matches[
                document.id
              ] = {
                id:
                  document.id,
                ...document.data()
              };

            }
          );

          const data =
            predictionsSnapshot.docs.map(
              document => {

                const prediction =
                  document.data();

                const match =
                  matches[
                    prediction.matchId
                  ];

                let status =
                  "Pendiente";

                if (
                  match?.status ===
                  "finished"
                ) {

                  if (
                    prediction.predictionA ===
                      match.scoreA &&
                    prediction.predictionB ===
                      match.scoreB
                  ) {

                    status =
                      "Acertada";

                  } else {

                    status =
                      "Incorrecta";

                  }

                }

                return {

                  id:
                    document.id,

                  ...prediction,

                  match,

                  status

                };

              }
            );

          setPredictions(
            data
          );

          setLoading(false);

        } catch(error) {

          console.error(error);

        }

      }
    );

  }

  if (loading) {

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
          max-w-5xl
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
          Mis Predicciones
        </h1>

        <div
          className="
            grid
            gap-4
          "
        >

          {
            predictions.length === 0
            ? (
              <div
                className="
                  bg-slate-800
                  p-5
                  rounded-xl
                "
              >
                No tienes predicciones
              </div>
            )
            : (
              predictions.map(
                prediction => (

                  <div
                    key={
                      prediction.id
                    }
                    className="
                      bg-slate-800
                      p-5
                      rounded-xl
                    "
                  >

                    <h2
                      className="
                        text-xl
                        font-bold
                        mb-3
                      "
                    >

                      {
                        prediction.match
                          ?.flagA
                      }
                      {" "}
                      {
                        prediction.match
                          ?.teamA
                      }

                      {" vs "}

                      {
                        prediction.match
                          ?.flagB
                      }
                      {" "}
                      {
                        prediction.match
                          ?.teamB
                      }

                    </h2>

                    <p>

                      Tu predicción:

                      {" "}

                      <strong>

                        {
                          prediction.predictionA
                        }

                        {" - "}

                        {
                          prediction.predictionB
                        }

                      </strong>

                    </p>

                    <p
                      className="
                        mt-2
                      "
                    >

                      Estado:

                      {" "}

                      <strong>

                        {
                          prediction.status
                        }

                      </strong>

                    </p>

                  </div>

                )
              )
            )
          }

        </div>

      </div>

    </main>

  );

}