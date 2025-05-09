import React, { useState, useCallback } from "react";
import type { Recipe } from "@/types/recipe";
import { useRecipes } from "@/hooks/useRecipes";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const ImportRecipes = () => {
  const { importRecipes, isLoading } = useRecipes();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    } else {
      setSelectedFile(null);
    }
  };

  const handleImport = useCallback(async () => {
    if (!selectedFile) {
      toast("Please select a JSON file.");
      return;
    }

    try {
      const reader = new FileReader();

      reader.onload = async (event: ProgressEvent<FileReader>) => {
        try {
          const jsonData = JSON.parse(event.target?.result as string);

          // TODO handle array or object
          await importRecipes([jsonData] as Recipe[]);
          toast("Recipes imported successfully!");
        } catch (parseError) {
          console.error("Error parsing JSON:", parseError);
          toast("Error parsing JSON file.");
        }
      };

      reader.onerror = () => {
        toast("Error reading file.");
      };

      reader.readAsText(selectedFile);
    } catch (error) {
      console.error("Error importing recipes:", error);
      toast("Import failed.  See console for details.");
    }
  }, [importRecipes, selectedFile]);

  return (
    <div className="flex w-full max-w-sm items-center space-x-2">
      <Input type="file" accept=".json" onChange={handleFileChange} />
      <Button
        type="submit"
        variant="outline"
        onClick={handleImport}
        disabled={isLoading || !selectedFile}
      >
        {isLoading ? "Importing..." : "Import Recipes"}
      </Button>
    </div>
  );
};

export default ImportRecipes;
