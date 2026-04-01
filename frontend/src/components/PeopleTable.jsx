import { useState } from 'react';
import { Button } from './ui/button';
import { EditDialog } from './EditDialog';
import { Pencil, Trash2, Users } from 'lucide-react';
import { deletePerson } from '../lib/api';

export function PeopleTable({ people, onRefresh }) {
  const [editPerson, setEditPerson] = useState(null);

  async function handleDelete(id) {
    if (!confirm('Delete this person?')) return;
    await deletePerson(id);
    onRefresh();
  }

  function formatDob(dob) {
    if (!dob) return '—';
    return new Date(dob).toLocaleDateString('en-AU', {
      day: '2-digit', month: 'short', year: 'numeric',
    });
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
      <div className="flex items-center gap-2 px-6 py-4 border-b border-slate-100">
        <Users className="h-5 w-5 text-blue-600" />
        <h2 className="text-lg font-semibold text-slate-900">People Directory</h2>
        <span className="ml-auto text-sm text-slate-500">{people.length} record{people.length !== 1 ? 's' : ''}</span>
      </div>

      {people.length === 0 ? (
        <div className="text-center py-12 text-slate-400">
          <Users className="h-10 w-10 mx-auto mb-2 opacity-30" />
          <p className="text-sm">No records yet. Add someone above.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="text-left px-6 py-3 font-medium text-slate-600">Name</th>
                <th className="text-left px-6 py-3 font-medium text-slate-600">Date of Birth</th>
                <th className="text-left px-6 py-3 font-medium text-slate-600">Address</th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {people.map((person, i) => (
                <tr
                  key={person.id}
                  className={`border-b border-slate-100 hover:bg-slate-50 transition-colors ${
                    i === people.length - 1 ? 'border-0' : ''
                  }`}
                >
                  <td className="px-6 py-4 font-medium text-slate-900">{person.name}</td>
                  <td className="px-6 py-4 text-slate-600">{formatDob(person.dob)}</td>
                  <td className="px-6 py-4 text-slate-600">{person.address}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 justify-end">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setEditPerson(person)}
                        title="Edit"
                      >
                        <Pencil className="h-4 w-4 text-slate-500" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(person.id)}
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4 text-red-400" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <EditDialog
        person={editPerson}
        open={!!editPerson}
        onClose={() => setEditPerson(null)}
        onSaved={onRefresh}
      />
    </div>
  );
}
