import { v4 as uuidv4 } from 'uuid';

export interface VaultItem {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  type: 'note' | 'image' | 'pdf';
}

export interface Note extends VaultItem {
  content: string;
}

export interface ImageItem extends VaultItem {
  dataUrl: string;
}

export interface PDFItem extends VaultItem {
  dataUrl: string;
}

export type VaultItemType = Note | ImageItem | PDFItem;

// Storage Keys
const STORAGE_KEY = 'obsidian-vault-blue';
const NOTES_KEY = `${STORAGE_KEY}-notes`;
const IMAGES_KEY = `${STORAGE_KEY}-images`;
const PDFS_KEY = `${STORAGE_KEY}-pdfs`;

// Helper functions
const getItem = <T>(key: string): T[] => {
  const item = localStorage.getItem(key);
  return item ? JSON.parse(item) : [];
};

const setItem = <T>(key: string, value: T[]): void => {
  localStorage.setItem(key, JSON.stringify(value));
};

// Notes Functions
export const getNotes = (): Note[] => {
  return getItem<Note>(NOTES_KEY);
};

export const saveNote = (note: Omit<Note, 'id' | 'type' | 'createdAt' | 'updatedAt'>): Note => {
  const notes = getNotes();
  const now = new Date().toISOString();
  
  const newNote: Note = {
    id: uuidv4(),
    type: 'note',
    createdAt: now,
    updatedAt: now,
    ...note
  };
  
  notes.push(newNote);
  setItem(NOTES_KEY, notes);
  return newNote;
};

export const updateNote = (id: string, updates: Partial<Note>): Note | null => {
  const notes = getNotes();
  const noteIndex = notes.findIndex(note => note.id === id);
  
  if (noteIndex === -1) return null;
  
  const updatedNote = {
    ...notes[noteIndex],
    ...updates,
    updatedAt: new Date().toISOString()
  };
  
  notes[noteIndex] = updatedNote;
  setItem(NOTES_KEY, notes);
  return updatedNote;
};

export const deleteNote = (id: string): boolean => {
  const notes = getNotes();
  const filteredNotes = notes.filter(note => note.id !== id);
  
  if (filteredNotes.length === notes.length) {
    return false;
  }
  
  setItem(NOTES_KEY, filteredNotes);
  return true;
};

// Images Functions
export const getImages = (): ImageItem[] => {
  return getItem<ImageItem>(IMAGES_KEY);
};

export const saveImage = (image: Omit<ImageItem, 'id' | 'type' | 'createdAt' | 'updatedAt'>): ImageItem => {
  const images = getImages();
  const now = new Date().toISOString();
  
  const newImage: ImageItem = {
    id: uuidv4(),
    type: 'image',
    createdAt: now,
    updatedAt: now,
    ...image
  };
  
  images.push(newImage);
  setItem(IMAGES_KEY, images);
  return newImage;
};

export const deleteImage = (id: string): boolean => {
  const images = getImages();
  const filteredImages = images.filter(image => image.id !== id);
  
  if (filteredImages.length === images.length) {
    return false;
  }
  
  setItem(IMAGES_KEY, filteredImages);
  return true;
};

// PDFs Functions
export const getPDFs = (): PDFItem[] => {
  return getItem<PDFItem>(PDFS_KEY);
};

export const savePDF = (pdf: Omit<PDFItem, 'id' | 'type' | 'createdAt' | 'updatedAt'>): PDFItem => {
  const pdfs = getPDFs();
  const now = new Date().toISOString();
  
  const newPDF: PDFItem = {
    id: uuidv4(),
    type: 'pdf',
    createdAt: now,
    updatedAt: now,
    ...pdf
  };
  
  pdfs.push(newPDF);
  setItem(PDFS_KEY, pdfs);
  return newPDF;
};

export const deletePDF = (id: string): boolean => {
  const pdfs = getPDFs();
  const filteredPDFs = pdfs.filter(pdf => pdf.id !== id);
  
  if (filteredPDFs.length === pdfs.length) {
    return false;
  }
  
  setItem(PDFS_KEY, filteredPDFs);
  return true;
};

// Search Functions
export const searchItems = (query: string): VaultItemType[] => {
  if (!query.trim()) return [];
  
  const notes = getNotes();
  const images = getImages();
  const pdfs = getPDFs();
  
  const lowerQuery = query.toLowerCase();
  
  const matchingNotes = notes.filter(note => 
    note.title.toLowerCase().includes(lowerQuery) || 
    note.content.toLowerCase().includes(lowerQuery)
  );
  
  const matchingImages = images.filter(img => 
    img.title.toLowerCase().includes(lowerQuery)
  );
  
  const matchingPDFs = pdfs.filter(pdf => 
    pdf.title.toLowerCase().includes(lowerQuery)
  );
  
  return [...matchingNotes, ...matchingImages, ...matchingPDFs];
};

// Format Date
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  }).format(date);
};
