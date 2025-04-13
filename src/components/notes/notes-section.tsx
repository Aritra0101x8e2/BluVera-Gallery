import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { NoteCard } from './note-card';
import { Note, getNotes, saveNote } from '@/lib/storage';
import { toast } from '@/components/ui/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';

export function NotesSection() {
  const [notes, setNotes] = useState<Note[]>(getNotes());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const isMobile = useIsMobile();

  const handleAddNote = () => {
    if (!title.trim()) {
      toast({
        title: "Title required",
        description: "Please provide a title for your note",
        variant: "destructive"
      });
      return;
    }

    saveNote({ title, content });
    setNotes(getNotes());
    setTitle('');
    setContent('');
    setIsDialogOpen(false);
    
    toast({
      title: "Note created",
      description: "Your note has been saved",
    });
  };

  const handleNoteDeleted = () => {
    setNotes(getNotes());
  };

  return (
    <section className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-white">Notes</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="vault-button flex items-center">
              <Plus className="mr-1" size={16} /> Add Note
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-black border-vault-oceanBlue/30 text-white sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-white">Create New Note</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Input 
                  placeholder="Note title (Minimum 3 letters)" 
                  className="bg-white text-black placeholder-gray-500" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div>
                <Textarea 
                  placeholder="Write your note content here..." 
                  className="bg-white text-black placeholder-gray-500 h-40"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
              </div>
              <div className="flex justify-end">
                <Button 
                  className="vault-button"
                  onClick={handleAddNote}
                >
                  Save Note
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {notes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {notes.map((note) => (
            <NoteCard 
              key={note.id} 
              note={note} 
              onDelete={handleNoteDeleted}
            />
          ))}
        </div>
      ) : (
        <div className="vault-card p-8 text-center">
          <p className="text-gray-400">No notes yet. Click the "Add Note" button to create one.</p>
        </div>
      )}

      {isMobile && (
        <button 
          className="fixed right-6 bottom-6 p-4 rounded-full bg-vault-oceanBlue shadow-blue-glow-sm"
          onClick={() => setIsDialogOpen(true)}
        >
          <Plus className="text-white" />
        </button>
      )}
    </section>
  );
}
