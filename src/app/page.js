"use client";

import { useEffect, useState } from "react";

import Header from "@/components/Header";
import StatsCards from "@/components/StatsCards";
import Leaderboard from "@/components/Leaderboard";
import MatchCard from "@/components/MatchCard";

import { users } from "@/data/mockData";

import {
  collection,
  getDocs
} from "firebase/firestore";

import { db } from "@/lib/firebase";

export default function Home() {

  const [matches, setMatches] =
    useState([]);

  useEffect(() => {

    loadMatches();

  }, []);

  async function loadMatches() {

    try {

      const snapshot =
        await getDocs(
          collection(
            db,
            "matches"
          )
        );

      const data =
        snapshot.docs.map(doc => ({

          id: doc.id,

          ...doc.data()

        }));

      setMatches(data);

    } catch (error) {

      console.error(error);

    }

  }

  const registrationMoney =
    users.length * 100;

  let matchesMoney = 0;

  users.forEach(user => {

    matchesMoney +=
      user.paidMatches * 10;

  });

  const totalMoney =
    registrationMoney + matchesMoney;

  return (

    <main className="
      min-h-screen
      bg-slate-900
      text-white
      p-8
    ">

      <div className="
        max-w-7xl
        mx-auto
      ">

        <Header />

        <StatsCards
          totalMoney={totalMoney}
          participants={users.length}
          matches={matches.length}
        />

        <Leaderboard
          users={users}
        />

        <section className="
          bg-slate-800
          rounded-2xl
          p-6
        ">

          <h2 className="
            text-3xl
            font-bold
            mb-6
          ">
            Próximos Partidos
          </h2>

          <div className="grid gap-5">

            {
              matches.length === 0
              ? (
                <p>
                  No hay partidos registrados
                </p>
              )
              : (
                matches.map(match => (

                  <MatchCard
                    key={match.id}
                    match={match}
                  />

                ))
              )
            }

          </div>

        </section>

      </div>

    </main>

  );

}