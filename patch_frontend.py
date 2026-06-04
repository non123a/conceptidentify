import sys

file_path = "frontend/app/courses/page.tsx"
with open(file_path, "r") as f:
    content = f.read()

content = content.replace('import api from "@/lib/api";', 'import api from "@/lib/api";\nimport { useAuth } from "@/context/AuthContext";')

content = content.replace('  const [loading, setLoading] = useState(true);', '''  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCourseName, setNewCourseName] = useState("");
  const [newCourseDesc, setNewCourseDesc] = useState("");
  const [creating, setCreating] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    if (!newCourseName) return;
    setCreating(true);
    try {
      await api.post("/courses/create/", {
        name: newCourseName,
        description: newCourseDesc,
      });
      setIsModalOpen(false);
      setNewCourseName("");
      setNewCourseDesc("");
      fetchCourses();
      setSuccessMessage("Course created successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error(error);
      alert("Failed to create course");
    } finally {
      setCreating(false);
    }
  };''')

content = content.replace('      <div className="grid gap-6">', '''      {successMessage && (
        <div className="mb-4 rounded bg-green-100 p-4 text-green-700">
          {successMessage}
        </div>
      )}

      {user?.role === "lecturer" && (
        <button
          onClick={() => setIsModalOpen(true)}
          className="mb-8 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Create Course
        </button>
      )}

      <div className="grid gap-6">''')


content = content.replace('    </div>\n  );\n}', '''    </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <h2 className="mb-4 text-xl font-bold">Create New Course</h2>
            <form onSubmit={handleCreateCourse}>
              <div className="mb-4">
                <label className="mb-2 block text-sm font-bold text-gray-700">
                  Name *
                </label>
                <input
                  type="text"
                  required
                  value={newCourseName}
                  onChange={(e) => setNewCourseName(e.target.value)}
                  className="w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
                  placeholder="e.g. Introduction to React"
                />
              </div>
              <div className="mb-6">
                <label className="mb-2 block text-sm font-bold text-gray-700">
                  Description (Optional)
                </label>
                <textarea
                  value={newCourseDesc}
                  onChange={(e) => setNewCourseDesc(e.target.value)}
                  className="w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
                  rows={3}
                  placeholder="Course description..."
                />
              </div>
              <div className="flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded px-4 py-2 font-bold text-gray-600 hover:bg-gray-100 focus:outline-none"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="rounded bg-blue-600 px-4 py-2 font-bold text-white hover:bg-blue-700 focus:outline-none disabled:opacity-50"
                >
                  {creating ? "Creating..." : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}''')

with open(file_path, "w") as f:
    f.write(content)

