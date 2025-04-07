/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Check,
  Copy,
  Download,
  Facebook,
  FileJson,
  FileText,
  Image,
  Mail,
  Twitter,
} from "lucide-react";
import type { Recipe } from "@/types/recipe";
import html2canvas from "html2canvas-pro";

interface ShareRecipeDialogProps {
  recipe: Recipe;
  isOpen: boolean;
  onClose: () => void;
}

export default function ShareRecipeDialog({
  recipe,
  isOpen,
  onClose,
}: ShareRecipeDialogProps) {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("link");
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // Error display

  // Generate a shareable link using the recipe slug
  const shareableLink =
    typeof window !== "undefined"
      ? `${window.location.origin}/recipes/${recipe.slug}`
      : `/recipes/${recipe.slug}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareableLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error: any) {
      console.error("Failed to copy link:", error);
      setErrorMessage("Failed to copy link.  Please try again.");
    }
  };

  const handleShareViaEmail = () => {
    const subject = encodeURIComponent(
      `Check out this recipe: ${recipe.title}`
    );
    const body = encodeURIComponent(
      `I thought you might enjoy this recipe for ${recipe.title}. Check it out here: ${shareableLink}`
    );
    window.open(`mailto:?subject=${subject}&body=${body}`);
  };

  const handleShareViaTwitter = () => {
    const text = encodeURIComponent(
      `Check out this delicious recipe for ${recipe.title}!`
    );
    window.open(
      `https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(
        shareableLink
      )}`
    );
  };

  const handleShareViaFacebook = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        shareableLink
      )}`
    );
  };

  const exportAsJson = async () => {
    try {
      // Create a JSON blob
      const data = JSON.stringify(recipe, null, 2);
      const blob = new Blob([data], { type: "application/json" });
      const url = URL.createObjectURL(blob);

      // Create a download link and trigger it
      const a = document.createElement("a");
      a.href = url;
      a.download = `${recipe.slug}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error: any) {
      console.error("Failed to export as JSON:", error);
      setErrorMessage("Failed to export as JSON. Please try again.");
    }
  };

  const exportAllRecipesAsJson = () => {
    try {
      const savedRecipesString = localStorage.getItem("recipes");
      if (!savedRecipesString) {
        setErrorMessage("No saved recipes found.");
        return;
      }

      let savedRecipes;
      try {
        savedRecipes = JSON.parse(savedRecipesString);
      } catch (parseError: any) {
        console.error("Error parsing recipes from localStorage:", parseError);
        setErrorMessage(
          "Error reading saved recipes.  The data may be corrupted."
        );
        return;
      }

      //Sanitize each recipe (example sanitization, more robust solution is preferable)
      const sanitizedRecipes = savedRecipes.map((recipe: any) => ({
        title: recipe.title.replace(/</g, "&lt;").replace(/>/g, "&gt;"),
        ingredients: recipe.ingredients.map((i: string) =>
          i.replace(/</g, "&lt;").replace(/>/g, "&gt;")
        ),
        instructions: recipe.instructions.map((i: string) =>
          i.replace(/</g, "&lt;").replace(/>/g, "&gt;")
        ),
        // Add other properties you want to sanitize
      }));

      const data = JSON.stringify(sanitizedRecipes, null, 2);
      const blob = new Blob([data], { type: "application/json" });
      const url = URL.createObjectURL(blob);

      // Create a download link and trigger it
      const a = document.createElement("a");
      a.href = url;
      a.download = "recipe-notebook.json";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error: any) {
      console.error("Failed to export all recipes:", error);
      setErrorMessage("Failed to export all recipes. Please try again.");
    }
  };

  const exportAsTxt = async () => {
    try {
      // Format recipe as text
      const text = `
${recipe.title}

Prep Time: ${recipe.prepTime}
Cook Time: ${recipe.cookTime}
Servings: ${recipe.servings}
Tags: ${recipe.tags.join(", ")}

INGREDIENTS:
${recipe.ingredients.map((i) => `- ${i}`).join("\n")}

INSTRUCTIONS:
${recipe.instructions.map((step, i) => `${i + 1}. ${step}`).join("\n")}
`.trim();

      // Create a text blob
      const blob = new Blob([text], { type: "text/plain" });
      const url = URL.createObjectURL(blob);

      // Create a download link and trigger it
      const a = document.createElement("a");
      a.href = url;
      a.download = `${recipe.slug}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error: any) {
      console.error("Failed to export as TXT:", error);
      setErrorMessage("Failed to export as TXT. Please try again.");
    }
  };

  const exportAsImage = async () => {
    // Create a temporary div to render the recipe
    const tempDiv = document.createElement("div");
    tempDiv.style.width = "800px";
    tempDiv.style.padding = "20px";
    tempDiv.style.backgroundColor = "white";
    tempDiv.style.position = "absolute";
    tempDiv.style.left = "-9999px";
    tempDiv.innerHTML = `
      <div style="font-family: Arial, sans-serif;">
        <h1 style="color: #ea580c; margin-bottom: 10px;">${recipe.title}</h1>
        <div style="display: flex; margin-bottom: 10px;">
          <div style="margin-right: 20px;"><strong>Prep:</strong> ${
            recipe.prepTime
          }</div>
          <div style="margin-right: 20px;"><strong>Cook:</strong> ${
            recipe.cookTime
          }</div>
          <div><strong>Servings:</strong> ${recipe.servings}</div>
        </div>
        <div style="margin-bottom: 10px;">
          <strong>Tags:</strong> ${recipe.tags.join(", ")}
        </div>
        <div style="margin-bottom: 20px;">
          <h2 style="color: #ea580c; margin-bottom: 10px;">Ingredients</h2>
          <ul style="padding-left: 20px;">
            ${recipe.ingredients.map((i) => `<li>${i}</li>`).join("")}
          </ul>
        </div>
        <div>
          <h2 style="color: #ea580c; margin-bottom: 10px;">Instructions</h2>
          <ol style="padding-left: 20px;">
            ${recipe.instructions.map((step) => `<li>${step}</li>`).join("")}
          </ol>
        </div>
      </div>
    `;

    document.body.appendChild(tempDiv);

    try {
      // Use html2canvas to convert the div to an image
      const canvas = await html2canvas(tempDiv);

      // Convert canvas to blob
      canvas.toBlob((blob) => {
        if (!blob) return;

        // Create download link
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${recipe.slug}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      });
    } catch (error: any) {
      console.error("Error generating image:", error);
      setErrorMessage("Failed to generate image. Please try again.");
    } finally {
      // Clean up
      document.body.removeChild(tempDiv);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Recipe</DialogTitle>
          <DialogDescription>
            Share &quot;{recipe.title}&quot; with friends and family
          </DialogDescription>
        </DialogHeader>
        {errorMessage && (
          <div className="text-red-500">{errorMessage}</div> // Display error
        )}
        <Tabs
          defaultValue="export"
          value={activeTab}
          onValueChange={setActiveTab}
        >
          <TabsList className="grid grid-cols-5">
            {/* <TabsTrigger value="link">Link</TabsTrigger> */}
            {/* <TabsTrigger value="social">Social</TabsTrigger> */}
            <TabsTrigger value="export">Export</TabsTrigger>
          </TabsList>

          {/* <TabsContent value="link" className="p-4">
            <div className="flex items-center space-x-2">
              <div className="grid flex-1 gap-2">
                <Input value={shareableLink} readOnly />
              </div>
              <Button size="sm" onClick={handleCopyLink}>
                {copied ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="social" className="p-4 space-y-4">
            <div className="grid grid-cols-3 gap-2">
              <Button
                onClick={handleShareViaEmail}
                variant="outline"
                className="w-full"
              >
                <Mail className="h-4 w-4 mr-2" />
                Email
              </Button>
              <Button
                onClick={handleShareViaTwitter}
                variant="outline"
                className="w-full"
              >
                <Twitter className="h-4 w-4 mr-2" />
                Twitter
              </Button>
              <Button
                onClick={handleShareViaFacebook}
                variant="outline"
                className="w-full"
              >
                <Facebook className="h-4 w-4 mr-2" />
                Facebook
              </Button>
            </div>
          </TabsContent> */}

          <TabsContent value="export" className="p-4 space-y-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Export this recipe</h3>
              <div className="grid grid-cols-3 gap-2">
                <Button
                  onClick={exportAsJson}
                  variant="outline"
                  className="w-full"
                >
                  <FileJson className="h-4 w-4 mr-2" />
                  JSON
                </Button>
                <Button
                  onClick={exportAsTxt}
                  variant="outline"
                  className="w-full"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Text
                </Button>
                <Button
                  onClick={exportAsImage}
                  variant="outline"
                  className="w-full"
                >
                  <Image className="h-4 w-4 mr-2" />
                  Image
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium">Export all recipes</h3>
              <Button
                onClick={exportAllRecipesAsJson}
                variant="outline"
                className="w-full"
              >
                <Download className="h-4 w-4 mr-2" />
                Export All as JSON
              </Button>
            </div>
          </TabsContent>
        </Tabs>
        <DialogFooter className="sm:justify-start">
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
