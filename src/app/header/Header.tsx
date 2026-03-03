import NavBar from "../navBar/NavBar";

export default function Header() {
  return (
    <header className="border-b border-zinc-800">
      <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-violet-500 flex items-center justify-center text-sm font-bold">
            F
          </div>
          <span className="text-xl font-semibold">FinTrack</span>
        </div>

        <NavBar />
      </div>
    </header>
  );
}
