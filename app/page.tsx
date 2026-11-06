import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 p-6">
      <h1 className="text-center font-sans text-base/normal font-normal">
        Hello, world!
      </h1>
      <Link
        href="/calculator"
        className="text-sm/6 font-medium underline underline-offset-4"
      >
        Premium calculator
      </Link>
    </main>
  );
}
