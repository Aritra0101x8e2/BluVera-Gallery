
import { useState } from 'react';
import { FileText, Trash, Calendar, ExternalLink } from 'lucide-react';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
} from '@/components/ui/dialog';
import { PDFItem, deletePDF, formatDate } from '@/lib/storage';
import { toast } from '@/components/ui/use-toast';

interface PDFCardProps {
  pdf: PDFItem;
  onDelete: () => void;
}

export function PDFCard({ pdf, onDelete }: PDFCardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleDelete = () => {
    deletePDF(pdf.id);
    onDelete();
    toast({
      title: "PDF deleted",
      description: `"${pdf.title}" has been deleted`,
    });
  };

  return (
    <>
      <div className="vault-card group">
        <div className="aspect-[3/4] overflow-hidden rounded-t-xl flex items-center justify-center bg-gray-900 relative">
          <FileText size={64} className="text-vault-oceanBlue opacity-30" />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/60">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <button className="p-2 bg-vault-oceanBlue rounded-full">
                  <ExternalLink size={20} className="text-white" />
                </button>
              </DialogTrigger>
              <DialogContent className="bg-black border-vault-oceanBlue/30 text-white max-w-4xl h-[90vh]">
                <div className="flex flex-col h-full">
                  <h2 className="text-xl font-medium text-white mb-2">{pdf.title}</h2>
                  <div className="flex-1 overflow-hidden bg-gray-900 rounded-lg">
                    <iframe
                      src={pdf.dataUrl}
                      title={pdf.title}
                      className="w-full h-full"
                    />
                  </div>
                  <div className="text-sm text-gray-400 mt-2">
                    Uploaded on {formatDate(pdf.createdAt)}
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        <div className="p-3 border-t border-vault-oceanBlue/20">
          <h3 className="text-white font-medium truncate">{pdf.title}</h3>
          <div className="flex justify-between items-center mt-1">
            <div className="flex items-center text-gray-500 text-xs">
              <Calendar size={12} className="mr-1" />
              <span>{formatDate(pdf.createdAt)}</span>
            </div>
            <button 
              onClick={handleDelete}
              className="text-red-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Trash size={16} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
