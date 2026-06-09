import Link from "next/link";

export default function Home() {
  return (
    <main className="ci-page flex min-h-[calc(100vh-73px)] items-center">
      <section className="grid w-full gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div className="space-y-6">
          <div className="inline-flex rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600 shadow-sm">
            AI-supported learning analysis
          </div>

          <div className="space-y-4">
            <h1 className="max-w-3xl text-3xl font-bold leading-tight text-gray-900 md:text-5xl">
              ConceptIdentify
            </h1>
            <p className="max-w-2xl text-base leading-7 text-gray-600">
              A clean workspace for course topics, materials, quizzes, and
              performance insights across lecturer and student workflows.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link href="/login" className="ci-button-primary">
              Log in
            </Link>
            <Link href="/register" className="ci-button-secondary">
              Create account
            </Link>
          </div>
        </div>

        <div className="ci-card p-6">
          <div className="space-y-5">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Platform overview
              </p>
              <h2 className="mt-2 text-xl font-semibold text-gray-900">
                Course intelligence, organized
              </h2>
            </div>

            <div className="grid gap-3">
              {[
                "Create and join courses",
                "Manage topic question banks",
                "Practice and complete quizzes",
                "Review class and individual analytics",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-700"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
