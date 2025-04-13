
import { useState } from 'react';
import { Pencil, Trash, Calendar } from 'lucide-react';
import { Note, formatDate, deleteNote, updateNote } from '@/lib/storage';
import { toast } from '@/components/ui/use-toast';

interface NoteCardProps {
  note: Note;
  onDelete: () => void;
}

export function NoteCard({ note, onDelete }: NoteCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);

  const handleDelete = () => {
    deleteNote(note.id);
    onDelete();
    toast({
      title: "Note deleted",
      description: `"${note.title}" has been deleted`,
    });
  };

  const handleSave = () => {
    if (!title.trim()) {
      toast({
        title: "Title required",
        description: "Note title cannot be empty",
        variant: "destructive"
      });
      return;
    }

    updateNote(note.id, { title, content });
    setIsEditing(false);
    
    toast({
      title: "Note updated",
      description: "Your changes have been saved",
    });
  };

  return (
    <div className="vault-card p-4 h-full flex flex-col">
      {isEditing ? (
        <>
          <input
            type="text"
            className="vault-input mb-2"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Note title"
          />
          <textarea
            className="vault-input flex-grow mb-4"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your note here..."
          />
          <div className="flex justify-end space-x-2">
            <button 
              onClick={() => setIsEditing(false)}
              className="text-gray-400 hover:text-white"
            >
              Cancel
            </button>
            <button 
              onClick={handleSave}
              className="vault-button"
            >
              Save
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-white font-medium text-lg truncate">{note.title}</h3>
            <div className="flex space-x-2">
              <button 
                onClick={() => setIsEditing(true)}
                className="text-vault-oceanBlue hover:text-vault-skyBlue"
              >
                <Pencil size={16} />
              </button>
              <button 
                onClick={handleDelete}
                className="text-red-500 hover:text-red-400"
              >
                <Trash size={16} />
              </button>
            </div>
          </div>
          
          <div className="flex-grow mb-2">
            <p className="text-gray-300 text-sm whitespace-pre-wrap">{note.content}</p>
          </div>
          
          <div className="flex items-center text-gray-500 text-xs">
            <Calendar size={12} className="mr-1" />
            <span>{formatDate(note.updatedAt)}</span>
          </div>
        </>
      )}
    </div>
  );
}
