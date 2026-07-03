import Link from "next/link";

const features = [
  {
    title: "AI Question Generation",
    description:
      "Create concept-focused questions from uploaded learning materials to support structured practice and assessment.",
    icon: (
      <path
        d="M12 3v18m9-9H3m16.5-6.5-13 13M19.5 19.5l-13-13"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    ),
  },
  {
    title: "Semantic Search",
    description:
      "Find the most relevant concept passages using vector-based retrieval instead of exact keyword matching.",
    icon: (
      <path
        d="M11 19a8 8 0 1 1 0-16 8 8 0 0 1 0 16Zm5-3 4 4"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    ),
  },
  {
    title: "Topic-Level Analytics",
    description:
      "Track understanding by topic so lecturers can see where students are confident and where they need support.",
    icon: (
      <path
        d="M4 19V5m0 14h16M8 15v-4m4 4V8m4 7v-9"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    ),
  },
  {
    title: "Student Practice",
    description:
      "Give learners targeted practice questions that reinforce concepts and encourage active recall.",
    icon: (
      <path
        d="M5 7h14M5 12h14M5 17h9"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    ),
  },
  {
    title: "Material Management",
    description:
      "Organize uploaded documents and lecture materials so content can be reused across courses and topics.",
    icon: (
      <path
        d="M7 4h7l5 5v11a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1Zm7 0v5h5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    ),
  },
  {
    title: "Lecturer Dashboard",
    description:
      "Monitor student progress, review generated items, and manage learning activities from one place.",
    icon: (
      <path
        d="M4 19V5m0 14h16M8 15l2-3 3 2 4-6"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    ),
  },
];

const technologies = [
  {
    title: "Django REST Framework",
    description:
      "Provides the secure API layer for managing content, users, and analytics.",
  },
  {
    title: "Next.js",
    description:
      "Delivers the responsive frontend experience with fast navigation and clean UI rendering.",
  },
  {
    title: "PostgreSQL",
    description:
      "Stores structured academic data, assessments, and course information reliably.",
  },
  {
    title: "pgvector",
    description:
      "Supports vector similarity search for concept retrieval and semantic matching.",
  },
  {
    title: "Sentence Transformers",
    description:
      "Creates high-quality embeddings from learning materials for semantic understanding.",
  },
  {
    title: "Google Gemini",
    description:
      "Helps generate concept questions and structured learning outputs from course content.",
  },
  {
    title: "Retrieval-Augmented Generation (RAG)",
    description:
      "Combines retrieval and generation to produce grounded, context-aware academic responses.",
  },
];

const workflow = [
  "Upload Materials",
  "Extract Text",
  "Generate Embeddings",
  "Semantic Search",
  "Generate Questions",
  "Student Practice",
  "Learning Analytics",
];

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-500">
        {eyebrow}
      </p>
      <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950 md:text-3xl">
        {title}
      </h2>
      <p className="mt-4 text-base leading-7 text-slate-600">{description}</p>
    </div>
  );
}

export default function Home() {
  return (
    <main className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(37,99,235,0.12),_transparent_30%),radial-gradient(circle_at_top_right,_rgba(14,165,233,0.10),_transparent_28%),linear-gradient(to_bottom,_#ffffff,_#f8fafc_40%,_#f8fafc)]" />

      <div className="ci-page space-y-20 py-12 md:py-16 lg:space-y-24">
        <section className="grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-4 py-2 text-sm font-medium text-sky-700 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-sky-500" />
              AI-supported academic concept analysis
            </div>

            <div className="space-y-4">
              <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-slate-950 md:text-6xl">
                ConceptIdentify
              </h1>
              <p className="max-w-3xl text-lg leading-8 text-slate-600 md:text-xl">
                An Intelligent System for Identifying Students&apos; Conceptual
                Understanding
              </p>
              <p className="max-w-2xl text-base leading-7 text-slate-600 md:text-lg">
                ConceptIdentify helps lecturers transform teaching materials into
                meaningful practice, insight, and assessment. It connects topic
                understanding, semantic retrieval, and analytics into one
                focused academic workflow.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link href="/login" className="ci-button-primary shadow-sm">
                Login
              </Link>
              <Link href="/register" className="ci-button-secondary">
                Register
              </Link>
              <link href="https://www.youtube.com/watch?v=WZKxHmlqKWg">
              <button
                type="button"
                className="ci-button-secondary border-slate-200 bg-white/90 text-slate-700"
              >
                Watch Demo
              </button>
              </link>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-6 -z-10 rounded-[2rem] bg-slate-950/5 blur-2xl" />
            <div className="ci-card border-slate-200/80 bg-white/90 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur">
              <div className="space-y-5">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
                    Platform overview
                  </p>
                  <h2 className="mt-3 text-2xl font-semibold text-slate-950">
                    Academic intelligence for lecturers and students
                  </h2>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  {[
                    "Topic-aligned question generation",
                    "Semantic retrieval from materials",
                    "Lecturer review and approval",
                    "Learning analytics at topic level",
                  ].map((item) => (
                    <div
                      key={item}
                      className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm font-medium leading-6 text-slate-700"
                    >
                      {item}
                    </div>
                  ))}
                </div>

                <div className="grid gap-3 rounded-2xl border border-slate-200 bg-slate-50/80 p-4 sm:grid-cols-3">
                  {[
                    ["3", "Core workflows"],
                    ["6", "Feature pillars"],
                    ["1", "Unified platform"],
                  ].map(([value, label]) => (
                    <div key={label} className="text-center">
                      <div className="text-2xl font-semibold text-slate-950">
                        {value}
                      </div>
                      <div className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
                        {label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-8" aria-labelledby="about-conceptidentify">
          <SectionHeading
            eyebrow="About"
            title="About ConceptIdentify"
            description="ConceptIdentify is built for academic environments where lecturers need a clearer view of concept mastery and students need focused practice from their own course materials. The system helps turn lecture content into searchable, reviewable, and measurable learning experiences."
          />

          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                title: "What it does",
                text: "It analyzes teaching materials, retrieves relevant concepts, generates questions, and tracks learning progress across topics.",
              },
              {
                title: "Who it is for",
                text: "It supports lecturers, students, and course administrators working in concept-heavy academic settings.",
              },
              {
                title: "The problem it solves",
                text: "It reduces the gap between content delivery and concept understanding by making assessment more targeted and evidence-based.",
              },
            ].map((item) => (
              <article
                key={item.title}
                className="ci-card ci-card-hover h-full rounded-3xl border-slate-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1"
              >
                <h3 className="text-lg font-semibold text-slate-950">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  {item.text}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="space-y-8" aria-labelledby="key-features">
          <SectionHeading
            eyebrow="Features"
            title="Key Features"
            description="The platform combines retrieval, generation, and analytics into a single academic workflow that is practical for both teaching and revision."
          />

          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {features.map((feature) => (
              <article
                key={feature.title}
                className="ci-card ci-card-hover rounded-3xl border-slate-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-50 text-sky-700 ring-1 ring-sky-100">
                  <svg
                    aria-hidden="true"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    {feature.icon}
                  </svg>
                </div>
                <h3 className="mt-5 text-lg font-semibold text-slate-950">
                  {feature.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  {feature.description}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="space-y-8" aria-labelledby="why-conceptidentify">
          <SectionHeading
            eyebrow="Value"
            title="Why ConceptIdentify?"
            description="Traditional learning systems usually stop at content delivery or broad grading. ConceptIdentify goes further by connecting knowledge retrieval, question generation, and analytics at the topic level."
          />

          <div className="grid gap-5 lg:grid-cols-5">
            {[
              "Topic-level analysis reveals understanding by concept, not just by course.",
              "AI-assisted question generation turns materials into targeted practice quickly.",
              "Semantic retrieval surfaces relevant passages even when wording differs.",
              "Lecturer approval keeps generated content aligned with academic standards.",
              "Learning analytics show progress and gaps with clear evidence.",
            ].map((item, index) => (
              <div
                key={item}
                className="ci-card ci-card-hover rounded-3xl border-slate-200 bg-white p-5 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="text-sm font-semibold text-sky-700">
                  0{index + 1}
                </div>
                <p className="mt-3 text-sm leading-7 text-slate-600">{item}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-8" aria-labelledby="technology-stack">
          <SectionHeading
            eyebrow="Technology"
            title="Technology Stack"
            description="ConceptIdentify uses a modern stack designed for semantic retrieval, secure APIs, and responsive academic interfaces."
          />

          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {technologies.map((technology) => (
              <article
                key={technology.title}
                className="ci-card ci-card-hover rounded-3xl border-slate-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="inline-flex rounded-full bg-slate-950 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white">
                  Stack
                </div>
                <h3 className="mt-4 text-lg font-semibold text-slate-950">
                  {technology.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  {technology.description}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="space-y-8" aria-labelledby="how-it-works">
          <SectionHeading
            eyebrow="Workflow"
            title="How It Works"
            description="A simple pipeline converts source materials into searchable knowledge, generated questions, and actionable analytics."
          />

          <div className="grid gap-4 lg:grid-cols-[repeat(7,minmax(0,1fr))]">
            {workflow.map((step, index) => (
              <div key={step} className="flex items-center gap-4 lg:block">
                <div className="ci-card flex h-full flex-1 items-center justify-center rounded-3xl border-slate-200 bg-white px-5 py-6 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg lg:min-h-28">
                  <div>
                    <div className="text-sm font-semibold text-sky-700">
                      Step {index + 1}
                    </div>
                    <div className="mt-2 text-sm font-semibold leading-6 text-slate-950">
                      {step}
                    </div>
                  </div>
                </div>

                {index < workflow.length - 1 ? (
                  <div className="flex items-center justify-center text-slate-400 lg:py-3">
                    <span className="text-2xl font-light leading-none lg:hidden">
                      ↓
                    </span>
                    <span className="hidden text-2xl font-light leading-none lg:block">
                      →
                    </span>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
