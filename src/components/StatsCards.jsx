export default function StatsCards({

  totalMoney,
  participants,
  matches

}){

  return(

    <section
      className="
      grid
      grid-cols-1
      md:grid-cols-3
      gap-5
      mb-10
    "
    >

      <div className="bg-slate-800 rounded-2xl p-6">

        <h2 className="text-slate-400 mb-3">
          Fondo Acumulado
        </h2>

        <span
          className="
          text-5xl
          font-bold
          text-green-400
        "
        >
          ${totalMoney}
        </span>

      </div>

      <div className="bg-slate-800 rounded-2xl p-6">

        <h2 className="text-slate-400 mb-3">
          Participantes
        </h2>

        <span
          className="
          text-5xl
          font-bold
          text-sky-400
        "
        >
          {participants}
        </span>

      </div>

      <div className="bg-slate-800 rounded-2xl p-6">

        <h2 className="text-slate-400 mb-3">
          Partidos
        </h2>

        <span
          className="
          text-5xl
          font-bold
          text-orange-400
        "
        >
          {matches}
        </span>

      </div>

    </section>

  );

}