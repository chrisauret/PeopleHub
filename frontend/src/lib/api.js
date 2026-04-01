const API_URL = import.meta.env.VITE_API_URL || "";
const BASE = `${API_URL}/people`;

const SAMPLE_PEOPLE = [
  {
    id: 1,
    name: "Alice Johnson",
    dob: "1990-04-12",
    address: "10 George St, Sydney NSW 2000",
  },
  {
    id: 2,
    name: "Bob Smith",
    dob: "1985-11-03",
    address: "22 Collins St, Melbourne VIC 3000",
  },
  {
    id: 3,
    name: "Carol Lee",
    dob: "1998-07-25",
    address: "5 Adelaide Tce, Perth WA 6000",
  },
  {
    id: 4,
    name: "David Chen",
    dob: "1992-01-18",
    address: "88 Queen St, Brisbane QLD 4000",
  },
  {
    id: 5,
    name: "Eva Martinez",
    dob: "2000-09-30",
    address: "14 Hindley St, Adelaide SA 5000",
  },
];

// export async function fetchPeople() {
//   return structuredClone(SAMPLE_PEOPLE);
// }

export async function fetchPeople() {
  const res = await fetch(BASE);
  if (!res.ok) throw new Error("Failed to fetch people");
  return res.json();
}

export async function createPerson(data) {
  const res = await fetch(BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to save");
  return res.json();
}

export async function updatePerson(id, data) {
  const res = await fetch(`${BASE}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update");
  return res.json();
}

export async function deletePerson(id) {
  const res = await fetch(`${BASE}/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete");
}
