
import { useState } from 'react';
import { Database, Image, FileText, Search } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { NotesSection } from './notes/notes-section';
import { ImagesSection } from './images/images-section';
import { PDFsSection } from './pdfs/pdfs-section';
import { SearchBar } from './ui/search-bar';
import { VaultItemType } from '@/lib/storage';
import { toast } from '@/components/ui/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';

export function VaultApp() {
  const [activeTab, setActiveTab] = useState('notes');
  const isMobile = useIsMobile();

  const handleSearchSelect = (item: VaultItemType) => {
    setActiveTab(item.type);
    toast({
      title: `Found "${item.title}"`,
      description: `View it in the ${item.type} section`,
    });
  };

  return (
    <div className="min-h-screen flex flex-col overflow-hidden">
      <header className="py-6 px-4 lg:px-8 border-b border-vault-oceanBlue/30">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-md bg-vault-oceanBlue flex items-center justify-center mr-2">
              <Database size={18} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">Bluvera : Your Personal Gallery</h1>
          </div>
          
          <div className="w-full md:max-w-md">
            <SearchBar onSelect={handleSearchSelect} />
          </div>
        </div>
      </header>

      <main className="flex-grow p-4 lg:p-8 max-w-7xl mx-auto w-full">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-black border border-vault-oceanBlue/30 mb-8">
            <TabsTrigger 
              value="notes" 
              className="data-[state=active]:bg-vault-oceanBlue data-[state=active]:text-white"
            >
              <Database size={16} className="mr-2" /> Notes
            </TabsTrigger>
            <TabsTrigger 
              value="image" 
              className="data-[state=active]:bg-vault-oceanBlue data-[state=active]:text-white"
            >
              <Image size={16} className="mr-2" /> Images
            </TabsTrigger>
            <TabsTrigger 
              value="pdf" 
              className="data-[state=active]:bg-vault-oceanBlue data-[state=active]:text-white"
            >
              <FileText size={16} className="mr-2" /> PDFs
            </TabsTrigger>
            {isMobile && (
              <TabsTrigger 
                value="search" 
                className="md:hidden data-[state=active]:bg-vault-oceanBlue data-[state=active]:text-white"
              >
                <Search size={16} />
              </TabsTrigger>
            )}
          </TabsList>
          
          {isMobile && (
            <TabsContent value="search" className="mb-6">
              <h2 className="text-2xl font-semibold text-white mb-4">Search</h2>
              <SearchBar onSelect={handleSearchSelect} />
            </TabsContent>
          )}
          
          <TabsContent value="notes">
            <NotesSection />
          </TabsContent>
          
          <TabsContent value="image">
            <ImagesSection />
          </TabsContent>
          
          <TabsContent value="pdf">
            <PDFsSection />
          </TabsContent>
        </Tabs>
      </main>
      
      <footer className="py-4 px-8 border-t border-vault-oceanBlue/30 text-center">
        <p className="text-gray-500 text-sm">
        Bluvera &copy; {new Date().getFullYear()} by Aritra Kundu
        </p>
      </footer>
    </div>
  );
}
