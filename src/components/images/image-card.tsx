
import { useState } from 'react';
import { Eye, Trash, Calendar } from 'lucide-react';
import { 
  Dialog,
  DialogTrigger,
  DialogContent,
} from '@/components/ui/dialog';
import { ImageItem, deleteImage, formatDate } from '@/lib/storage';
import { toast } from '@/components/ui/use-toast';

interface ImageCardProps {
  image: ImageItem;
  onDelete: () => void;
}

export function ImageCard({ image, onDelete }: ImageCardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleDelete = () => {
    deleteImage(image.id);
    onDelete();
    toast({
      title: "Image deleted",
      description: `"${image.title}" has been deleted`,
    });
  };

  return (
    <>
      <div className="vault-card relative group">
        <div className="aspect-square overflow-hidden rounded-t-xl flex items-center justify-center bg-black">
          <img 
            src={image.dataUrl} 
            alt={image.title}
            className="object-contain max-h-full max-w-full"
          />
        </div>
        <div className="p-3 border-t border-vault-oceanBlue/20">
          <h3 className="text-white font-medium truncate">{image.title}</h3>
          <div className="flex justify-between items-center mt-1">
            <div className="flex items-center text-gray-500 text-xs">
              <Calendar size={12} className="mr-1" />
              <span>{formatDate(image.createdAt)}</span>
            </div>
            <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <button className="text-vault-oceanBlue hover:text-vault-skyBlue">
                    <Eye size={16} />
                  </button>
                </DialogTrigger>
                <DialogContent className="bg-black border-vault-oceanBlue/30 text-white max-w-4xl">
                  <div className="flex flex-col space-y-4">
                    <h2 className="text-xl font-medium text-white">{image.title}</h2>
                    <div className="flex justify-center bg-black p-2 rounded">
                      <img 
                        src={image.dataUrl} 
                        alt={image.title} 
                        className="max-h-[70vh] max-w-full object-contain"
                      />
                    </div>
                    <div className="text-sm text-gray-400">
                      Uploaded on {formatDate(image.createdAt)}
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
              <button 
                onClick={handleDelete}
                className="text-red-500 hover:text-red-400"
              >
                <Trash size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
