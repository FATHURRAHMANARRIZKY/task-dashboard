import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-linear-to-b from-white to-gray-50 flex flex-col justify-center items-center text-center p-8">
      <div className="max-w-2xl space-y-6">
        <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight sm:text-6xl">
          Organize your work, <br />
          <span className="text-blue-600">amplify your productivity.</span>
        </h1>

        <p className="text-lg text-gray-600">
          The simplest way to manage tasks using the power of Next.js, Tanstack
          Query, and PostgreSQL. Fast, reliable, and clean.
        </p>

        <div className="flex gap-4 justify-center mt-8">
          <Link
            href="/auth/login"
            className="px-8 py-3 rounded-full bg-blue-600 text-white font-semibold hover:bg-blue-700 transition shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            Get Started
          </Link>
          <a
            href="https://github.com/FATHURRAHMANARRIZKY"
            target="_blank"
            className="px-8 py-3 rounded-full bg-white text-gray-900 border border-gray-200 font-semibold hover:bg-gray-50 transition"
          >
            View on GitHub
          </a>
        </div>
      </div>

      {/* Footer simple */}
      <footer className="absolute bottom-8 text-gray-400 text-sm">
        © 2024 Task App Portfolio. Built with Next.js 14.
      </footer>
    </div>
  );
}
