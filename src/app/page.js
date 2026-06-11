"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {

  const router = useRouter();

  useEffect(() => {

    router.replace("/login");

  }, [router]);

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