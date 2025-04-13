import { useState } from 'react';
import { Plus, FileText } from 'lucide-react';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PDFCard } from './pdf-card';
import { PDFItem, getPDFs, savePDF } from '@/lib/storage';
import { FileUpload } from '@/components/ui/file-upload';
import { toast } from '@/components/ui/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';

export function PDFsSection() {
  const [pdfs, setPDFs] = useState<PDFItem[]>(getPDFs());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  const isMobile = useIsMobile();

  const handleFileUpload = (file: File, dataUrl: string) => {
    setSelectedFile(file);
    setDataUrl(dataUrl);
    setTitle(file.name.split('.')[0]); 
  };

  const handleAddPDF = () => {
    if (!title.trim()) {
      toast({
        title: "Title required",
        description: "Please provide a title for your PDF",
        variant: "destructive"
      });
      return;
    }

    if (!dataUrl) {
      toast({
        title: "PDF required",
        description: "Please upload a PDF file",
        variant: "destructive"
      });
      return;
    }

    if (selectedFile && selectedFile.size > 4 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload a file smaller than 4MB",
        variant: "destructive"
      });
      return;
    }

    savePDF({ title, dataUrl }); 
    setPDFs(getPDFs());
    setTitle('');
    setSelectedFile(null);
    setDataUrl(null);
    setIsDialogOpen(false);

    toast({
      title: "PDF uploaded",
      description: "Your PDF has been saved",
    });
  };

  const handlePDFDeleted = () => {
    setPDFs(getPDFs());
  };

  return (
    <section className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-white">PDFs</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="vault-button flex items-center">
              <Plus className="mr-1" size={16} /> Add PDF
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-black border-vault-oceanBlue/30 text-white sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-white">Upload PDF</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              {!dataUrl ? (
                <FileUpload 
                  onUpload={handleFileUpload}
                  accept="application/pdf"
                />
              ) : (
                <div className="space-y-4">
                  <div className="border border-vault-oceanBlue/30 rounded-xl p-4 bg-black flex items-center justify-center">
                    <div className="text-vault-oceanBlue font-medium flex items-center">
                      <FileText className="mr-2" size={24} />
                      {selectedFile?.name}
                    </div>
                  </div>
                  <Input 
                    placeholder="PDF title" 
                    className="vault-input text-black bg-white" 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                  <div className="flex justify-between">
                  <Button 
  variant="outline" 
  className="text-black bg-white border-black hover:bg-black hover:text-white"
  onClick={() => {
    setSelectedFile(null);
    setDataUrl(null);
  }}
>
  Change PDF
</Button>


                    <Button 
                      className="vault-button"
                      onClick={handleAddPDF}
                    >
                      Save PDF
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {pdfs.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {pdfs.map((pdf) => (
            <PDFCard 
              key={pdf.id} 
              pdf={pdf} 
              onDelete={handlePDFDeleted}
            />
          ))}
        </div>
      ) : (
        <div className="vault-card p-8 text-center">
          <p className="text-gray-400">No PDFs yet. Click the "Add PDF" button to upload one.</p>
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
