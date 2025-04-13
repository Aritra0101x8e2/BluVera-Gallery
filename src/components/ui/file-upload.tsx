
import { useState, useRef } from 'react';
import { Upload } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface FileUploadProps {
  onUpload: (file: File, dataUrl: string) => void;
  accept?: string;
  maxSizeMB?: number;
}

export function FileUpload({ onUpload, accept = "image/*", maxSizeMB = 5 }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const maxSizeBytes = maxSizeMB * 1024 * 1024;

  const handleFile = async (file: File) => {
    if (file.size > maxSizeBytes) {
      toast({
        title: "File too large",
        description: `Maximum file size is ${maxSizeMB}MB`,
        variant: "destructive"
      });
      return;
    }

    if (!file.type.match(accept.replace('/*', ''))) {
      toast({
        title: "Invalid file type",
        description: `Please upload a ${accept.split('/')[0]} file`,
        variant: "destructive"
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target && typeof e.target.result === 'string') {
        onUpload(file, e.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  };

  return (
    <div
      className={`flex flex-col items-center justify-center border-2 border-dashed p-8 rounded-xl cursor-pointer
        transition-all ${
          isDragging 
            ? 'border-vault-oceanBlue bg-vault-oceanBlue/10' 
            : 'border-vault-oceanBlue/50 hover:border-vault-oceanBlue hover:bg-vault-oceanBlue/5'
        }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
    >
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileChange}
        accept={accept}
        className="hidden"
      />
      <Upload className="h-10 w-10 text-vault-oceanBlue mb-2" />
      <p className="text-white font-medium">Drag & drop or click to upload</p>
      <p className="text-sm text-gray-400 mt-1">Max size: {maxSizeMB}MB</p>
    </div>
  );
}
