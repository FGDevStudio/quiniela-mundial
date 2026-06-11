"use client";

import { useEffect, useState } from "react";

import {
  collection,
  getDocs
} from "firebase/firestore";

import { db } from "@/lib/firebase";

export default function RankingPage() {

  const [users, setUsers] =
    useState([]);

  useEffect(() => {

    loadRanking();

  }, []);

  async function loadRanking() {

    const snapshot =
      await getDocs(
        collection(
          db,
          "users"
        )
      );

    const data =
      snapshot.docs
        .map(document => ({

          id:
            document.id,

          ...document.data()

        }))
        .sort(
          (a, b) =>
            (b.score || 0) -
            (a.score || 0)
        );

    setUsers(data);

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
          max-w-4xl
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
          🏆 Ranking
        </h1>

        <div
          className="
            grid
            gap-4
          "
        >

          {
            users.map(
              (
                user,
                index
              ) => (

                <div
                  key={user.id}
                  className="
                    bg-slate-800
                    p-5
                    rounded-xl
                    flex
                    justify-between
                    items-center
                  "
                >

                  <div>

                    <h2
                      className="
                        text-xl
                        font-bold
                      "
                    >
                      #{index + 1}
                      {" "}
                      {user.name}
                    </h2>

                    <p
                      className="
                        text-slate-400
                      "
                    >
                      {user.email}
                    </p>

                  </div>

                  <div
                    className="
                      text-2xl
                      font-bold
                      text-yellow-400
                    "
                  >
                    {user.score || 0}
                    {" "}
                    pts
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