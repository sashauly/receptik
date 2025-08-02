import { useObjectUrl } from "@/hooks/useObjectUrl";
import { RecipeImage } from "@/types/recipe";
import { X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "../ui/button";
import { Card } from "../ui/card";

export default function ImagePreviewCard({
  image,
  onClick,
  onRemove,
  isUploading,
}: {
  image: RecipeImage;
  onClick: () => void;
  onRemove: () => void;
  isUploading: boolean;
}) {
  const { t } = useTranslation();
  const objectUrl = useObjectUrl(image.data);
  return (
    <Card className="relative overflow-hidden" role="listitem">
      <div className="aspect-square relative">
        <img
          src={objectUrl}
          alt={t("forms.imagePreview", { name: image.name })}
          className="h-full w-full object-cover cursor-pointer"
          onClick={onClick}
        />
        <div className="absolute right-1 top-1 flex gap-1">
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="h-5 w-5"
            onClick={onRemove}
            aria-label={t("forms.removeImage", { name: image.name })}
            disabled={isUploading}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
