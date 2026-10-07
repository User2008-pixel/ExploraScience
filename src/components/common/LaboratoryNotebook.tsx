import React, { useState, useEffect } from 'react';
import { FileText, X, Save, Trash2, Plus, Move, Share2, ClipboardCheck } from 'lucide-react';

interface Note {
  id: string;
  context: string;
  content: string;
  date?: string;
}

interface NotebookProps {
  activeContext: string;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export const LaboratoryNotebook: React.FC<NotebookProps> = ({ activeContext, isOpen, setIsOpen }) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [currentNote, setCurrentNote] = useState('');
  const [position, setPosition] = useState(() => {
    const saved = localStorage.getItem('notebook_pos');
    return saved ? JSON.parse(saved) : { x: window.innerWidth - 80, y: window.innerHeight - 150 };
  });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [copyFeedback, setCopyFeedback] = useState(false);

  useEffect(() => {
    const savedNotes = localStorage.getItem('science_notebook');
    if (savedNotes) setNotes(JSON.parse(savedNotes));

    // Check for shared notes in URL
    const params = new URLSearchParams(window.location.search);
    const sharedData = params.get('shared_lab_notes');
    if (sharedData) {
      try {
        const decoded = JSON.parse(decodeURIComponent(escape(atob(sharedData))));
        if (Array.isArray(decoded)) {
          const importedNotes: Note[] = decoded.map((n: any) => ({
            id: `shared-${Date.now()}-${Math.random()}`,
            context: `Imported: ${n.c}`,
            content: n.t,
            date: n.d || new Date().toLocaleString()
          }));
          
          setNotes(prev => {
            // Avoid duplicate imports if refreshed
            const hasShared = prev.some(p => p.id.startsWith('shared-'));
            if (hasShared) return prev;
            
            const updated = [...importedNotes, ...prev];
            localStorage.setItem('science_notebook', JSON.stringify(updated));
            return updated;
          });
          
          setIsOpen(true);
          // Clean up URL
          window.history.replaceState({}, '', window.location.pathname);
          alert('Shared notes imported successfully!');
        }
      } catch (e) {
        console.error('Failed to parse shared notes', e);
      }
    }
  }, [setIsOpen]);

  useEffect(() => {
    localStorage.setItem('notebook_pos', JSON.stringify(position));
  }, [position]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isOpen) return;
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (isOpen) return;
    setIsDragging(true);
    const touch = e.touches[0];
    setDragOffset({
      x: touch.clientX - position.x,
      y: touch.clientY - position.y
    });
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        let newX = e.clientX - dragOffset.x;
        let newY = e.clientY - dragOffset.y;
        
        // Viewport boundaries
        newX = Math.max(10, Math.min(newX, window.innerWidth - 70));
        newY = Math.max(10, Math.min(newY, window.innerHeight - 70));

        setPosition({ x: newX, y: newY });
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (isDragging) {
        const touch = e.touches[0];
        let newX = touch.clientX - dragOffset.x;
        let newY = touch.clientY - dragOffset.y;
        
        newX = Math.max(10, Math.min(newX, window.innerWidth - 70));
        newY = Math.max(10, Math.min(newY, window.innerHeight - 70));

        setPosition({ x: newX, y: newY });
      }
    };

    const handleMouseUp = () => setIsDragging(false);

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  const saveNote = () => {
    if (!currentNote.trim()) return;
    const newNote: Note = { 
      id: Date.now().toString(), 
      context: activeContext, 
      content: currentNote,
      date: new Date().toLocaleString()
    };
    const updatedNotes = [newNote, ...notes];
    setNotes(updatedNotes);
    localStorage.setItem('science_notebook', JSON.stringify(updatedNotes));
    setCurrentNote('');
  };

  const handleShare = () => {
    if (notes.length === 0) return;

    const report = notes.map(note => (
      `--- Lab Observation ---\n` +
      `Date: ${note.date || 'Unknown'}\n` +
      `Topic: ${note.context}\n` +
      `Note: ${note.content}\n`
    )).join('\n');

    const fullReport = `SCIENCE LAB EXPLORER - LABORATORY REPORT\n` +
                      `Generated: ${new Date().toLocaleString()}\n\n` +
                      report;

    navigator.clipboard.writeText(fullReport).then(() => {
      setCopyFeedback(true);
      setTimeout(() => setCopyFeedback(false), 2000);
    });
  };

  const handleShareLink = () => {
    if (notes.length === 0) return;
    
    // Create a compact version of notes for the URL
    const compactData = notes.map(n => ({ c: n.context, t: n.content, d: n.date }));
    const encoded = btoa(unescape(encodeURIComponent(JSON.stringify(compactData))));
    const shareUrl = `${window.location.origin}/?shared_lab_notes=${encoded}`;
    
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopyFeedback(true);
      setTimeout(() => setCopyFeedback(false), 2000);
      alert('Shareable link copied to clipboard! Anyone with this link can view your notes.');
    });
  };

  const deleteNote = (id: string) => {
    const updatedNotes = notes.filter((n) => n.id !== id);
    setNotes(updatedNotes);
    localStorage.setItem('science_notebook', JSON.stringify(updatedNotes));
  };

  return (
    <>
      <div 
        style={{ left: position.x, top: position.y }}
        className="fixed z-50 cursor-grab active:cursor-grabbing select-none group"
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        {!isDragging && (
          <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-[10px] text-white px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap pointer-events-none">
            Drag to reposition
          </div>
        )}
        <button
          onClick={() => !isDragging && setIsOpen(true)}
          className={`p-4 rounded-full shadow-lg transition flex items-center justify-center ${
            isDragging ? 'bg-cyan-500 scale-110' : 'bg-cyan-600 hover:bg-cyan-500'
          } text-white`}
          title="Open Laboratory Notebook"
        >
          <FileText className="w-6 h-6" />
        </button>
      </div>

      {isOpen && (
        <div className="fixed inset-y-0 right-0 z-50 w-96 bg-[#131E36] border-l border-slate-700 shadow-2xl p-6 flex flex-col animate-slide-in-right">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-cyan-400" />
              Notebook: {activeContext}
            </h2>
            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white p-2">
              <X className="w-6 h-6" />
            </button>
          </div>

          <textarea
            value={currentNote}
            onChange={(e) => setCurrentNote(e.target.value)}
            className="flex-1 w-full bg-slate-950 border border-slate-700 rounded-xl p-4 text-white text-sm mb-4 focus:border-cyan-500 outline-none"
            placeholder="Jot down observations, formulas, or hypotheses..."
          />
          <div className="flex gap-2">
            <button
              onClick={saveNote}
              className="flex-1 py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition"
            >
              <Save className="w-4 h-4" />
              Save Note
            </button>
            <button
              onClick={handleShare}
              disabled={notes.length === 0}
              className={`flex-1 py-3 rounded-xl font-bold flex items-center justify-center transition ${
                copyFeedback 
                  ? 'bg-emerald-600 text-white' 
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
              title="Copy Formatted Report to Clipboard"
            >
              {copyFeedback ? <ClipboardCheck className="w-4 h-4 mr-2" /> : <ClipboardCheck className="w-4 h-4 mr-2" />}
              Report
            </button>
            <button
              onClick={handleShareLink}
              disabled={notes.length === 0}
              className={`flex-1 py-3 rounded-xl font-bold flex items-center justify-center transition ${
                copyFeedback 
                  ? 'bg-emerald-600 text-white' 
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
              title="Generate & Copy Shareable Link"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Link
            </button>
          </div>

          <div className="mt-6 flex-1 overflow-y-auto space-y-3">
            {notes.map((note) => (
              <div key={note.id} className="p-3 bg-slate-900 rounded-lg border border-slate-800 text-xs">
                <div className="flex justify-between items-center mb-1 text-[10px] text-slate-400">
                  <span>{note.context}</span>
                  <button onClick={() => deleteNote(note.id)} className="text-rose-400 hover:text-rose-300">
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
                <p className="text-slate-200">{note.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};
