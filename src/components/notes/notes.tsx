import React, { useState, useEffect, FormEvent } from 'react';
import './Notes.scss';

interface Note {
  id: number;
  notbaslik: string;
  nottext: string;
  isEditing: boolean;
}

const Notes: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [noteTitle, setNoteTitle] = useState<string>('');
  const [noteText, setNoteText] = useState<string>('');

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const response = await fetch('/api/notes');
      const data = await response.json();
      setNotes(data.map((note: any) => ({ ...note, isEditing: false })));
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  };

  const handleAddNote = async (e: FormEvent) => {
    e.preventDefault();
    if (noteTitle.trim() && noteText.trim()) {
      try {
        const response = await fetch('/api/notes', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ notbaslik: noteTitle, nottext: noteText }),
        });
        const data = await response.json();
        setNotes([...notes, { ...data, isEditing: false }]);
        setNoteTitle('');
        setNoteText('');
      } catch (error) {
        console.error('Error adding note:', error);
      }
    }
  };

  const handleDeleteNote = async (id: number) => {
    try {
      await fetch(`/api/notes/${id}`, { method: 'DELETE' });
      setNotes(notes.filter(note => note.id !== id));
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  const handleEditNote = (id: number) => {
    setNotes(notes.map(note => (note.id === id ? { ...note, isEditing: !note.isEditing } : note)));
  };

  const handleSaveNote = async (id: number, newTitle: string, newText: string) => {
    try {
      const response = await fetch(`/api/notes/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ notbaslik: newTitle, nottext: newText }),
      });
      const data = await response.json();
      setNotes(notes.map(note => (note.id === id ? { ...data, isEditing: false } : note)));
    } catch (error) {
      console.error('Error updating note:', error);
    }
  };

  return (
    <div className="notes-container">
      <h1>Notlarım</h1>
      <form onSubmit={handleAddNote}>
        <div className="note-input">
          <input
            type="text"
            value={noteTitle}
            onChange={(e) => setNoteTitle(e.target.value)}
            placeholder="Not başlığı"
          />
          <input
            type="text"
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            placeholder="Not içeriği"
          />
          <button type="submit">Add Note</button>
        </div>
      </form>
      <ul className="notes-list">
        {notes.map((note) => (
          <li key={note.id} className="note-item">
            {note.isEditing ? (
              <div className="note-content">
                <input
                  type="text"
                  defaultValue={note.notbaslik}
                  onBlur={(e) => handleSaveNote(note.id, e.target.value, note.nottext)}
                />
                <input
                  type="text"
                  defaultValue={note.nottext}
                  onBlur={(e) => handleSaveNote(note.id, note.notbaslik, e.target.value)}
                />
              </div>
            ) : (
              <div className="note-content">
                <strong>{note.notbaslik}</strong>
                <p>{note.nottext}</p>
              </div>
            )}
            <div className="note-actions">
              <button onClick={() => handleEditNote(note.id)}>{note.isEditing ? 'Save' : 'Edit'}</button>
              <button onClick={() => handleDeleteNote(note.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Notes;
