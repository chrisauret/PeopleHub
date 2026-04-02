//import { type ChangeEvent, type FormEvent, useState } from "react";
//import { Button } from "./ui/button";
import { createPerson, PersonInput } from "@/lib/api";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { UserPlus } from "lucide-react";
import { Button } from "./ui/button";
import { ChangeEvent, FormEvent, useState } from "react";
//import { createPerson, type PersonInput } from "../lib/api";

const emptyForm: PersonInput = { name: "", dob: "", address: "" };

interface PersonFormProps {
  onSaved: () => void;
}

export function PersonForm({ onSaved }: PersonFormProps) {
  const [form, setForm] = useState<PersonInput>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      await createPerson(form);
      setForm(emptyForm);
      onSaved();
    } catch {
      setError("Something went wrong. Is the backend running?");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
      <div className="flex items-center gap-2 mb-5">
        <UserPlus className="h-5 w-5 text-blue-600" />
        <h2 className="text-lg font-semibold text-slate-900">Add Person</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            name="name"
            placeholder="Jane Smith"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="dob">Date of Birth</Label>
          <Input
            id="dob"
            name="dob"
            type="date"
            value={form.dob}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="address">Address</Label>
          <Input
            id="address"
            name="address"
            placeholder="123 Main St, Sydney NSW 2000"
            value={form.address}
            onChange={handleChange}
            required
          />
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <Button type="submit" className="w-full" disabled={saving}>
          {saving ? "Saving..." : "Save Person"}
        </Button>
      </form>
    </div>
  );
}
