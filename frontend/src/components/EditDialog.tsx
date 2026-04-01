import { type ChangeEvent, type FormEvent, useState, useEffect } from 'react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { updatePerson, type Person, type PersonInput } from '../lib/api';

interface EditDialogProps {
  person: Person | null;
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
}

export function EditDialog({ person, open, onClose, onSaved }: EditDialogProps) {
  const [form, setForm] = useState<PersonInput>({ name: '', dob: '', address: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (person) setForm({ name: person.name, dob: person.dob, address: person.address });
  }, [person]);

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!person) return;
    setSaving(true);
    try {
      await updatePerson(person.id, form);
      onSaved();
      onClose();
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Person</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="edit-name">Full Name</Label>
            <Input id="edit-name" name="name" value={form.name} onChange={handleChange} required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="edit-dob">Date of Birth</Label>
            <Input id="edit-dob" name="dob" type="date" value={form.dob} onChange={handleChange} required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="edit-address">Address</Label>
            <Input id="edit-address" name="address" value={form.address} onChange={handleChange} required />
          </div>
          <div className="flex gap-2 justify-end pt-2">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
