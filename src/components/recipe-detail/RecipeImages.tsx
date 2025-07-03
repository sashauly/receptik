import { useState } from "react";
import { cn } from "@/lib/utils";
import { RecipeImage } from "@/types/recipe";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { useTranslation } from "react-i18next";
import { useObjectUrl } from "@/hooks/useObjectUrl";
import PreviewImageDialog from "../PreviewImageDialog";

interface RecipeImagesProps {
  images: RecipeImage[];
  className?: string;
}

export default function RecipeImages({ images, className }: RecipeImagesProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const thumbUrl = useObjectUrl(
    images && images.length > 0 ? images[0].data : undefined
  );

  if (!images || images.length === 0) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div
          className={cn("w-full h-full relative z-0", className)}
          onClick={() => setOpen(false)}
        >
          <img
            src={thumbUrl}
            alt={images[0].name}
            className="w-full h-full object-cover object-center"
            loading="lazy"
            draggable={false}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />
        </div>
      </DialogTrigger>
      <DialogContent className="fixed inset-0 left-0 top-0 translate-x-0 translate-y-0 w-full h-full z-[1001] flex items-center justify-center bg-black/95 p-0 border-0 max-w-none rounded-none shadow-none">
        <DialogHeader className="sr-only">
          <DialogTitle className="sr-only">
            {t("forms.imagePreview")}
          </DialogTitle>
          <DialogDescription className="sr-only">
            {images[0].name}
          </DialogDescription>
        </DialogHeader>
        <PreviewImageDialog image={images[0]} />
      </DialogContent>
    </Dialog>
  );
}
