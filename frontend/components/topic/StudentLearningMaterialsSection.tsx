type StudentMaterial = {
  id: number;
  title: string;
  file: string;
  uploaded_at: string;
};

type StudentLearningMaterialsSectionProps = {
  materials: StudentMaterial[];
  loading: boolean;
};

const getMaterialUrl = (fileUrl: string) => {
  return fileUrl.startsWith("http")
    ? fileUrl
    : `${process.env.NEXT_PUBLIC_MEDIA_URL}${fileUrl}`;
};

const formatUploadDate = (uploadedAt: string) => {
  const date = new Date(uploadedAt);

  if (Number.isNaN(date.getTime())) {
    return "Unknown upload date";
  }

  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export default function StudentLearningMaterialsSection({
  materials,
  loading,
}: StudentLearningMaterialsSectionProps) {
  return (
    <section className="mt-10">
      <h2 className="mb-4 text-2xl font-bold">📚 Learning Materials</h2>

      {loading ? (
        <div className="rounded-xl border p-6 text-gray-500">
          Loading learning materials...
        </div>
      ) : materials.length === 0 ? (
        <div className="rounded-xl border p-6 text-gray-500">
          No learning materials are available for this topic.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {materials.map((material) => {
            const materialUrl = getMaterialUrl(material.file);

            return (
              <article key={material.id} className="ci-card p-6">
                <h3 className="text-lg font-semibold">{material.title}</h3>

                <p className="mt-2 text-sm text-gray-500">
                  Uploaded {formatUploadDate(material.uploaded_at)}
                </p>

                <div className="mt-4 flex flex-wrap gap-3">
                  <a
                    href={materialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ci-button-secondary"
                  >
                    View Material
                  </a>

                  <a
                    href={materialUrl}
                    download
                    className="ci-button-secondary"
                  >
                    Download
                  </a>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
