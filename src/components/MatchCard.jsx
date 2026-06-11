import Link from "next/link";

export default function MatchCard({ match }) {

  const isFinished =
    match.status === "finished";

  return (

    <div className="
      bg-slate-900
      rounded-2xl
      p-5
    ">

      <div className="mb-4">

        <span className="
          bg-sky-600
          px-3
          py-1
          rounded-full
        ">
          Grupo {match.group}
        </span>

      </div>

      <div className="
        flex
        justify-between
        items-center
      ">

        <div className="text-center">

          <div className="text-5xl">
            {match.flagA}
          </div>

          <div className="font-bold">
            {match.teamA}
          </div>

          {
            isFinished && (
              <div className="
                text-4xl
                font-bold
                mt-2
              ">
                {match.scoreA}
              </div>
            )
          }

        </div>

        <div className="
          text-center
          px-6
        ">

          {
            isFinished
            ? (
              <div className="
                text-4xl
                font-bold
                text-green-400
              ">
                FINAL
              </div>
            )
            : (
              <div className="
                text-3xl
                font-bold
              ">
                VS
              </div>
            )
          }

        </div>

        <div className="text-center">

          <div className="text-5xl">
            {match.flagB}
          </div>

          <div className="font-bold">
            {match.teamB}
          </div>

          {
            isFinished && (
              <div className="
                text-4xl
                font-bold
                mt-2
              ">
                {match.scoreB}
              </div>
            )
          }

        </div>

      </div>

      <div className="
        mt-5
        text-center
        text-slate-400
      ">

        {match.date}
        {" "}
        {match.time}

      </div>

      <div className="
        mt-3
        text-center
      ">

        {
          isFinished
          ? (
            <span className="
              text-green-400
              font-bold
            ">
              Partido Finalizado
            </span>
          )
          : (
            <div
              className="
                flex
                flex-col
                items-center
                gap-3
              "
            >

              <span className="
                text-yellow-400
                font-bold
              ">
                Próximamente
              </span>

              <Link
                href={`/predict/${match.id}`}
                className="
                  bg-green-500
                  px-5
                  py-2
                  rounded-xl
                  font-bold
                "
              >
                Predecir
              </Link>

            </div>
          )
        }

      </div>

    </div>

  );

}