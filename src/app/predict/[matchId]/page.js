"use client";

import { useEffect, useState } from "react";

import { useParams } from "next/navigation";

import { auth, db } from "@/lib/firebase";

import { onAuthStateChanged } from "firebase/auth";

import {
  doc,
  getDoc,
  collection,
  addDoc,
  query,
  where,
  getDocs,
  updateDoc
} from "firebase/firestore";

export default function PredictPage() {

  const params = useParams();

  const matchId = params.matchId;

  const [match, setMatch] =
    useState(null);

  const [userData, setUserData] =
    useState(null);

  const [userDocId, setUserDocId] =
    useState("");

  const [predictionA, setPredictionA] =
    useState("");

  const [predictionB, setPredictionB] =
    useState("");

  const [loading, setLoading] =
    useState(true);

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

          const matchDoc =
            await getDoc(
              doc(
                db,
                "matches",
                matchId
              )
            );

          if (
            !matchDoc.exists()
          ) {

            alert(
              "Partido no encontrado"
            );

            return;

          }

          setMatch(
            {
              id: matchDoc.id,
              ...matchDoc.data()
            }
          );

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
            userSnapshot.empty
          ) {

            alert(
              "Usuario no encontrado"
            );

            return;

          }

          setUserDocId(
            userSnapshot.docs[0].id
          );

          setUserData(
            userSnapshot.docs[0].data()
          );

          setLoading(false);

        } catch(error) {

          console.error(error);

          alert(
            "Error cargando datos"
          );

        }

      }
    );

  }

  async function savePrediction() {

    if (
      predictionA === "" ||
      predictionB === ""
    ) {

      alert(
        "Ingresa tu marcador"
      );

      return;

    }

    if (
      userData.points < 10
    ) {

      alert(
        "No tienes puntos suficientes"
      );

      return;

    }

    const matchDate =
      new Date(
        `${match.date}T${match.time}:00`
      );

    const limitDate =
      new Date(
        matchDate.getTime()
        - 60000
      );

    if (
      new Date() >= limitDate
    ) {

      alert(
        "La predicción está cerrada"
      );

      return;

    }

    const predictionQuery =
      query(
        collection(
          db,
          "predictions"
        ),
        where(
          "userUid",
          "==",
          userData.uid
        ),
        where(
          "matchId",
          "==",
          matchId
        )
      );

    const predictionSnapshot =
      await getDocs(
        predictionQuery
      );

    if (
      !predictionSnapshot.empty
    ) {

      alert(
        "Ya realizaste una predicción para este partido"
      );

      return;

    }

    try {

      await addDoc(
        collection(
          db,
          "predictions"
        ),
        {
          userUid:
            userData.uid,

          matchId,

          predictionA:
            Number(
              predictionA
            ),

          predictionB:
            Number(
              predictionB
            ),

          createdAt:
            Date.now()
        }
      );

      await updateDoc(
        doc(
          db,
          "users",
          userDocId
        ),
        {
          points:
            userData.points - 10
        }
      );

      alert(
        "Predicción guardada"
      );

      window.location.href =
        "/dashboard";

    } catch(error) {

      console.error(error);

      alert(
        "Error al guardar"
      );

    }

  }

  if (
    loading ||
    !match ||
    !userData
  ) {

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
          max-w-2xl
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
          Predicción
        </h1>

        <div
          className="
            bg-slate-800
            rounded-2xl
            p-6
          "
        >

          <h2
            className="
              text-2xl
              font-bold
              mb-6
            "
          >
            {match.flagA}
            {" "}
            {match.teamA}
            {" vs "}
            {match.flagB}
            {" "}
            {match.teamB}
          </h2>

          <p
            className="
              mb-6
            "
          >
            Te costará
            {" "}
            <strong>
              10 puntos
            </strong>
          </p>

          <div
            className="
              flex
              gap-4
              items-center
              mb-6
            "
          >

            <input
              type="number"
              min="0"
              value={predictionA}
              onChange={(e)=>
                setPredictionA(
                  e.target.value
                )
              }
              className="
                w-24
                p-3
                rounded
                text-black
              "
            />

            <span
              className="
                text-3xl
              "
            >
              -
            </span>

            <input
              type="number"
              min="0"
              value={predictionB}
              onChange={(e)=>
                setPredictionB(
                  e.target.value
                )
              }
              className="
                w-24
                p-3
                rounded
                text-black
              "
            />

          </div>

          <button
            onClick={
              savePrediction
            }
            className="
              bg-green-500
              px-6
              py-3
              rounded-xl
              font-bold
            "
          >
            Guardar Predicción
          </button>

        </div>

      </div>

    </main>

  );

}