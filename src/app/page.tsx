import Link from "next/link";

export default function Home() {
  
  return (
    <main className="grid items-center justify-center items-center min-h-screen pb-2 sm:pb-20 font-[family-name:var(--font-geist-sans)]">
      <article className="flex flex-col items-center sm:items-center mt-2 sm:mt-12">
        <h1 className="text-blue-500 font-bold py sm:py-4 text-4xl sm:text-9xl">Campus Logics</h1>
        <p className="text-blue-500 font-bold py-4 text-[6px] sm:text-lg">Bridging the gap between Telangana Engineering and Intermediate</p>
        <Link 
        href="/dashboard"
        className="ring rounded-full bg-blue-500 text-stone-50 font-bold py-2 text-sm px-4 py-2 mt-6 "
        >
          select colleges
        </Link>
      </article>
    </main>
  );
}