"use client";

import { useEffect, useState } from "react";

import {
  collection,
  getDocs,
  doc,
  updateDoc,
  query,
  where
} from "firebase/firestore";

import { db, auth } from "@/lib/firebase";

import { onAuthStateChanged } from "firebase/auth";

import { useRouter } from "next/navigation";

export default function ResultsPage() {

  const router = useRouter();

  const [loadingAdmin, setLoadingAdmin] =
    useState(true);

  const [matches, setMatches] =
    useState([]);

  useEffect(() => {

    const unsubscribe =
      onAuthStateChanged(
        auth,
        async (user) => {

          if (!user) {

            router.push("/login");
            return;

          }

          const q = query(
            collection(db, "users"),
            where(
              "uid",
              "==",
              user.uid
            )
          );

          const snapshot =
            await getDocs(q);

          if (snapshot.empty) {

            router.push("/");
            return;

          }

          const userData =
            snapshot.docs[0].data();

          if (
            userData.role !== "admin"
          ) {

            router.push("/");
            return;

          }

          setLoadingAdmin(false);

          loadMatches();

        }
      );

    return () =>
      unsubscribe();

  }, [router]);

  async function loadMatches() {

    const snapshot =
      await getDocs(
        collection(db, "matches")
      );

    const data =
      snapshot.docs.map(document => ({

        firestoreId:
          document.id,

        ...document.data()

      }));

      data.sort((a, b) => {

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

});

    setMatches(data);

  }

async function saveResult(
  firestoreId,
  scoreA,
  scoreB
) {

  try {

    const resultA =
      Number(scoreA);

    const resultB =
      Number(scoreB);

      const matchData =
  matches.find(
    match =>
      match.firestoreId ===
      firestoreId
  );

if (
  matchData?.scoresProcessed
) {

  alert(
    "Los puntos ya fueron repartidos"
  );

  return;

}

    await updateDoc(
  doc(
    db,
    "matches",
    firestoreId
  ),
  {
    scoreA: resultA,
    scoreB: resultB,
    status: "finished"
  }
);

    const predictionsQuery =
      query(
        collection(
          db,
          "predictions"
        ),
        where(
          "matchId",
          "==",
          firestoreId
        )
      );

    const predictionsSnapshot =
      await getDocs(
        predictionsQuery
      );

    for (
      const predictionDoc
      of predictionsSnapshot.docs
    ) {

      const prediction =
        predictionDoc.data();

      let earnedScore = 0;

      const predA =
        Number(
          prediction.predictionA
        );

      const predB =
        Number(
          prediction.predictionB
        );

      const exactResult =
        predA === resultA &&
        predB === resultB;

      const resultIsDraw =
        resultA === resultB;

      const predictionIsDraw =
        predA === predB;

      if (exactResult) {

        earnedScore = 5;

      }
      else if (
        resultIsDraw &&
        predictionIsDraw
      ) {

        earnedScore = 3;

      }

       else {

  if (
    !resultIsDraw &&
    !predictionIsDraw
  ) {

    const realWinner =
      resultA > resultB
        ? "A"
        : "B";

    const predictedWinner =
      predA > predB
        ? "A"
        : "B";

    if (
      realWinner ===
      predictedWinner
    ) {

      earnedScore = 3;

    }

  }

}

      if (
        earnedScore > 0
      ) {

        const userQuery =
          query(
            collection(
              db,
              "users"
            ),
            where(
              "uid",
              "==",
              prediction.userUid
            )
          );

        const userSnapshot =
          await getDocs(
            userQuery
          );

        if (
          !userSnapshot.empty
        ) {

          const userDoc =
            userSnapshot.docs[0];

          const userData =
            userDoc.data();

          await updateDoc(
            doc(
              db,
              "users",
              userDoc.id
            ),
            {
              score:
                (
                  userData.score || 0
                ) +
                earnedScore
            }
          );

        }

      }

    }

    await updateDoc(
  doc(
    db,
    "matches",
    firestoreId
  ),
  {
    scoresProcessed: true
  }
);

    alert(
      "Resultado guardado y score actualizado"
    );

    loadMatches();

  } catch(error) {

    console.error(error);

    alert(
      "Error al guardar"
    );

  }

}

  if (loadingAdmin) {

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

        Verificando permisos...

      </main>

    );

  }

  return (

    <main className="
      min-h-screen
      bg-slate-900
      text-white
      p-8
    ">

      <div className="
        max-w-5xl
        mx-auto
      ">

        <h1 className="
          text-4xl
          font-bold
          mb-8
        ">
          Resultados
        </h1>

        <div className="
          grid
          gap-4
        ">

          {
            matches.map(match => (

              <ResultCard
                key={match.firestoreId}
                match={match}
                onSave={saveResult}
              />

            ))
          }

        </div>

      </div>

    </main>

  );

}

function ResultCard({
  match,
  onSave
}) {

  const [scoreA, setScoreA] =
    useState(
      match.scoreA ?? ""
    );

  const [scoreB, setScoreB] =
    useState(
      match.scoreB ?? ""
    );

  return (

    <div className="
      bg-slate-800
      p-5
      rounded-xl
    ">

      <h2 className="
        text-xl
        font-bold
        mb-4
      ">

        {match.flagA}
        {" "}
        {match.teamA}

        {" vs "}

        {match.flagB}
        {" "}
        {match.teamB}

      </h2>

      <div className="
        flex
        gap-3
        items-center
      ">

        <input
          type="number"
          value={scoreA}
          onChange={(e)=>
            setScoreA(
              e.target.value
            )
          }
          className="
            w-20
            p-2
            rounded
            text-white
          "
        />

        <span>
          -
        </span>

        <input
          type="number"
          value={scoreB}
          onChange={(e)=>
            setScoreB(
              e.target.value
            )
          }
          className="
            w-20
            p-2
            rounded
            text-white
          "
        />

        <button
          onClick={() =>
            onSave(
              match.firestoreId,
              scoreA,
              scoreB
            )
          }
          className="
            bg-green-500
            px-4
            py-2
            rounded
          "
        >
          Guardar
        </button>

      </div>

      <div className="
        mt-3
        text-sm
        text-slate-400
      ">

        Estado:
        {" "}
        {match.status || "upcoming"}

      </div>

    </div>

  );

}