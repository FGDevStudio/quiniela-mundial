export default function Leaderboard({ users }) {

  return (

    <section className="bg-slate-800 rounded-2xl p-6 mb-10">

      <h2 className="text-3xl font-bold mb-6">
        Tabla General
      </h2>

      <div className="overflow-x-auto">

        <table className="w-full">

          <thead>

            <tr className="bg-slate-700">

              <th className="p-4 text-left">
                #
              </th>

              <th className="p-4 text-left">
                Jugador
              </th>

              <th className="p-4 text-left">
                Puntos
              </th>

              <th className="p-4 text-left">
                Estado
              </th>

            </tr>

          </thead>

          <tbody>

            {[...users]
              .sort((a,b)=>b.points-a.points)
              .map((user,index)=>(

                <tr
                  key={user.id}
                  className="border-b border-slate-700"
                >

                  <td className="p-4">
                    {index + 1}
                  </td>

                  <td className="p-4">
                    {user.name}
                  </td>

                  <td className="p-4">
                    {user.points}
                  </td>

                  <td
                    className={`p-4 font-bold ${
                      user.active
                        ? "text-green-400"
                        : "text-red-400"
                    }`}
                  >
                    {user.active
                      ? "Activo"
                      : "Eliminado"}
                  </td>

                </tr>

              ))}

          </tbody>

        </table>

      </div>

    </section>

  );

}