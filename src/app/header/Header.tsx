import NavBar from "../navBar/NavBar";

export default function Header() {
  return (
    <header className="border-b border-zinc-800">
      <div className="mx-auto max-w-6xl px-4 py-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-violet-500 flex items-center justify-center text-sm font-bold select-none">
            F
          </div>
          <span className="text-lg sm:text-xl font-semibold select-none">
            FinTrack
          </span>
        </div>

        <div className="flex justify-start sm:justify-end">
          <NavBar />
        </div>
      </div>
    </header>
  );
}
