import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ImageCard } from './image-card';
import { ImageItem, getImages, saveImage } from '@/lib/storage';
import { FileUpload } from '@/components/ui/file-upload';
import { toast } from '@/components/ui/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';

export function ImagesSection() {
  const [images, setImages] = useState<ImageItem[]>(getImages());
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

  const handleAddImage = () => {
    if (!title.trim()) {
      toast({
        title: "Title required",
        description: "Please provide a title for your image",
        variant: "destructive"
      });
      return;
    }

    if (!dataUrl) {
      toast({
        title: "Image required",
        description: "Please upload an image file",
        variant: "destructive"
      });
      return;
    }

    saveImage({ title, dataUrl });
    setImages(getImages());
    setTitle('');
    setSelectedFile(null);
    setDataUrl(null);
    setIsDialogOpen(false);
    
    toast({
      title: "Image uploaded",
      description: "Your image has been saved",
    });
  };

  const handleImageDeleted = () => {
    setImages(getImages());
  };

  return (
    <section className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-white">Images</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="vault-button flex items-center">
              <Plus className="mr-1" size={16} /> Add Image
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-black border-vault-oceanBlue/30 text-white sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-white">Upload Image</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              {!dataUrl ? (
                <FileUpload 
                  onUpload={handleFileUpload}
                  accept="image/*"
                />
              ) : (
                <div className="space-y-4">
                  <div className="border border-vault-oceanBlue/30 rounded-xl p-2 bg-black">
                    <img 
                      src={dataUrl} 
                      alt="Preview" 
                      className="max-h-40 mx-auto object-contain" 
                    />
                  </div>
                  <Input 
                    placeholder="Image title (3 letters minimum)" 
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
                      Change Image
                    </Button>
                    <Button 
                      className="vault-button"
                      onClick={handleAddImage}
                    >
                      Save Image
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {images.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image) => (
            <ImageCard 
              key={image.id} 
              image={image} 
              onDelete={handleImageDeleted}
            />
          ))}
        </div>
      ) : (
        <div className="vault-card p-8 text-center">
          <p className="text-gray-400">No images yet. Click the "Add Image" button to upload one.</p>
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
