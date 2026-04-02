import { useState, useEffect, useCallback } from "react";
import { PersonForm } from "./components/PersonForm";
import { PeopleTable } from "./components/PeopleTable";
import { Database } from "lucide-react";
import { fetchPeople as fetchPeopleApi, type Person } from "./lib/api";

export default function App() {
  const [people, setPeople] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPeople = useCallback(async () => {
    try {
      const data = await fetchPeopleApi();
      setPeople(data);
    } catch {
      console.error("Could not reach the API");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPeople();
  }, [fetchPeople]);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center gap-3">
          <div className="bg-blue-600 text-white p-2 rounded-lg">
            <Database className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">PeopleHub</h1>
            <p className="text-xs text-slate-500">
              React + Node.js + SQLite Demo
            </p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
              ● Live
            </span>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-5xl mx-auto px-6 py-8 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form — left column */}
          {/* <div className="lg:col-span-1">
            <PersonForm onSaved={fetchPeople} />
          </div> */}

          {/* Table — right columns */}
          <div className="lg:col-span-2">
            {loading ? (
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-12 text-center text-slate-400 text-sm">
                Loading...
              </div>
            ) : (
              <PeopleTable people={people} onRefresh={fetchPeople} />
            )}
          </div>
        </div>

        {/* Tech stack footer */}
        <div className="flex flex-wrap gap-2 justify-center pt-4">
          {[
            "React 19",
            "Vite",
            "Node.js",
            "Express",
            "SQLite",
            "shadcn/ui",
            "Tailwind CSS",
          ].map((tag) => (
            <span
              key={tag}
              className="text-xs bg-slate-100 text-slate-600 px-3 py-1 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      </main>
    </div>
  );
}
