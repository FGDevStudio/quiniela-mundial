"use client";

import { useState } from "react";

import { teams } from "@/data/teams";

import {
  collection,
  addDoc
} from "firebase/firestore";

import { db } from "@/lib/firebase";

export default function AdminPage() {

  const [phase, setPhase] =
    useState("groups");

  const [group, setGroup] =
    useState("");

  const [teamA, setTeamA] =
    useState("");

  const [teamB, setTeamB] =
    useState("");

  const [date, setDate] =
    useState("");

  const [time, setTime] =
    useState("");

  const teamsAvailable =
    phase === "groups"
      ? teams.filter(
          team =>
            team.group === group
        )
      : teams;

  async function createMatch() {

    if (
      (phase === "groups" && !group) ||
      !teamA ||
      !teamB ||
      !date ||
      !time
    ) {

      alert(
        "Completa todos los campos"
      );

      return;

    }

    const local =
      teams.find(
        t => t.name === teamA
      );

    const visitor =
      teams.find(
        t => t.name === teamB
      );

    try {

      await addDoc(
        collection(
          db,
          "matches"
        ),
        {
          phase,
          group,

          teamA:
            local.name,

          flagA:
            local.flag,

          teamB:
            visitor.name,

          flagB:
            visitor.flag,

          date,

          time,

          status:
            "upcoming",

          scoreA:
            null,

          scoreB:
            null
        }
      );

      alert(
        "Partido guardado"
      );

      setGroup("");
      setTeamA("");
      setTeamB("");
      setDate("");
      setTime("");

    } catch(error) {

      console.error(error);

      alert(
        "Error al guardar partido"
      );

    }

  }

  return (

    <main
      className="
        min-h-screen
        bg-slate-900
        text-white
        p-10
      "
    >

      <div
        className="
          max-w-3xl
          mx-auto
        "
      >

        <h1
          className="
            text-4xl
            font-bold
            mb-10
          "
        >
          Panel Admin
        </h1>

        <div
          className="
            bg-slate-800
            p-6
            rounded-2xl
          "
        >

          <h2
            className="
              text-2xl
              font-bold
              mb-6
            "
          >
            Crear Partido
          </h2>

          <div
            className="
              grid
              gap-4
            "
          >

            <select
              value={phase}
              onChange={(e) =>
                setPhase(
                  e.target.value
                )
              }
              className="
                p-3
                rounded
                text-black
              "
            >

              <option value="groups">
                Fase de Grupos
              </option>

              <option value="round16">
                16vos
              </option>

              <option value="round8">
                Octavos
              </option>

              <option value="quarterfinal">
                Cuartos
              </option>

              <option value="semifinal">
                Semifinal
              </option>

              <option value="thirdplace">
                Tercer Lugar
              </option>

              <option value="final">
                Final
              </option>

            </select>

            {
              phase === "groups" && (

                <select
                  value={group}
                  onChange={(e) => {

                    setGroup(
                      e.target.value
                    );

                    setTeamA("");
                    setTeamB("");

                  }}
                  className="
                    p-3
                    rounded
                    text-black
                  "
                >

                  <option value="">
                    Selecciona grupo
                  </option>

                  {
                    [
                      "A","B","C","D",
                      "E","F","G","H",
                      "I","J","K","L"
                    ].map(group => (

                      <option
                        key={group}
                        value={group}
                      >
                        Grupo {group}
                      </option>

                    ))
                  }

                </select>

              )
            }

            <select
              value={teamA}
              onChange={(e)=>
                setTeamA(
                  e.target.value
                )
              }
              disabled={
                phase === "groups"
                  ? !group
                  : false
              }
              className="
                p-3
                rounded
                text-black
              "
            >

              <option value="">
                Equipo Local
              </option>

              {
                teamsAvailable.map(team => (

                  <option
                    key={team.name}
                    value={team.name}
                  >
                    {team.flag}
                    {" "}
                    {team.name}
                  </option>

                ))
              }

            </select>

            <select
              value={teamB}
              onChange={(e)=>
                setTeamB(
                  e.target.value
                )
              }
              disabled={
                phase === "groups"
                  ? !group
                  : false
              }
              className="
                p-3
                rounded
                text-black
              "
            >

              <option value="">
                Equipo Visitante
              </option>

              {
                teamsAvailable
                  .filter(
                    team =>
                      team.name !== teamA
                  )
                  .map(team => (

                    <option
                      key={team.name}
                      value={team.name}
                    >
                      {team.flag}
                      {" "}
                      {team.name}
                    </option>

                  ))
              }

            </select>

            <input
              type="date"
              value={date}
              onChange={(e)=>
                setDate(
                  e.target.value
                )
              }
              className="
                p-3
                rounded
                text-black
              "
            />

            <input
              type="time"
              value={time}
              onChange={(e)=>
                setTime(
                  e.target.value
                )
              }
              className="
                p-3
                rounded
                text-black
              "
            />

            <button
              onClick={createMatch}
              className="
                bg-green-500
                p-4
                rounded-xl
                font-bold
              "
            >
              Crear Partido
            </button>

          </div>

        </div>

      </div>

    </main>

  );

}