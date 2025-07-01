import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RecipeImage } from "@/types/recipe";
import { v4 as uuidv4 } from "uuid";
import { useTranslation } from "react-i18next";
import { Loader2, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { useFormContext, useWatch } from "react-hook-form";
import { logDebug, logError, logInfo, logWarn } from "@/lib/utils/logger";
import { useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useObjectUrl } from "@/hooks/useObjectUrl";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_IMAGES = 5;

function ImageUploadField() {
  const { t } = useTranslation();
  const { setValue } = useFormContext();
  const images = useWatch({ name: "images" });
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [previewImage, setPreviewImage] = useState<RecipeImage | null>(null);

  const processFiles = useCallback(
    async (files: FileList) => {
      if (!files.length) {
        logDebug("No files selected");
        return;
      }

      if (images.length + files.length > MAX_IMAGES) {
        toast.error(t("validation.tooManyImages"), {
          description: t("validation.maxImages", { count: MAX_IMAGES }),
        });
        return;
      }

      setIsUploading(true);
      logInfo(`Processing ${files.length} files`);
      const newImages: RecipeImage[] = [];

      try {
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          logDebug(
            `Processing file: ${file.name}, type: ${file.type}, size: ${file.size}`
          );

          if (!ALLOWED_FILE_TYPES.includes(file.type)) {
            logWarn(`Invalid file type: ${file.type}`);
            toast.error(t("validation.invalidFileType"), {
              description: t("validation.allowedImageTypes"),
            });
            continue;
          }

          if (file.size > MAX_FILE_SIZE) {
            logWarn(`File too large: ${file.size} bytes`);
            toast.error(t("validation.fileTooLarge"), {
              description: t("validation.maxFileSize", { size: "5MB" }),
            });
            continue;
          }

          try {
            const imageId = uuidv4();
            newImages.push({
              id: imageId,
              data: file,
              type: file.type,
              name: file.name,
            });
            logInfo(`Successfully processed image: ${file.name}`);
            toast.success(t("forms.imageUploadSuccess"));
          } catch (error) {
            logError(`Failed to process image: ${file.name}`, error);
            toast.error(t("validation.uploadFailed"), {
              description: t("validation.tryAgain"),
            });
          }
        }

        if (newImages.length > 0) {
          setValue("images", [...images, ...newImages]);
          logInfo(`Added ${newImages.length} new images to the form`);
        }
      } finally {
        setIsUploading(false);
      }
    },
    [images, setValue, t]
  );

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (files) {
      await processFiles(files);
    }
  };

  const handleDrop = useCallback(
    async (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.stopPropagation();
      setIsDragging(false);

      const files = event.dataTransfer.files;
      await processFiles(files);
    },
    [processFiles]
  );

  const handleDragOver = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.stopPropagation();
      setIsDragging(true);
    },
    []
  );

  const handleDragLeave = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.stopPropagation();
      setIsDragging(false);
    },
    []
  );

  const removeImage = (id: string) => {
    const imageToRemove = images.find((img: RecipeImage) => img.id === id);
    if (imageToRemove) {
      logInfo(`Removing image: ${imageToRemove.name}`);
      setValue(
        "images",
        images.filter((img: RecipeImage) => img.id !== id)
      );
    }
  };

  return (
    <div className="space-y-4" role="region" aria-label={t("forms.images")}>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <label className="text-sm font-medium" htmlFor="image-upload">
          {t("forms.images")}
        </label>
        <span className="text-sm text-muted-foreground">
          {t("forms.imagesCount", { current: images.length, max: MAX_IMAGES })}
        </span>
      </div>

      <div
        className={cn(
          "relative rounded-lg border-2 border-dashed p-8 transition-colors",
          isDragging
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/25",
          isUploading && "pointer-events-none opacity-50"
        )}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        role="button"
        tabIndex={0}
        onClick={() => document.getElementById("image-upload")?.click()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            document.getElementById("image-upload")?.click();
          }
        }}
      >
        <input
          type="file"
          accept={ALLOWED_FILE_TYPES.join(",")}
          multiple
          onChange={handleFileChange}
          className="hidden"
          id="image-upload"
          aria-describedby="image-upload-description"
          disabled={isUploading || images.length >= MAX_IMAGES}
        />

        <div className="flex flex-col items-center justify-center gap-2 text-center">
          <Upload
            className={cn(
              "h-8 w-8 text-muted-foreground",
              isDragging && "text-primary"
            )}
          />
          <div className="flex flex-col gap-1">
            <p className="text-sm font-medium">
              {isUploading
                ? t("forms.uploading")
                : t("forms.imageUploadButton")}
            </p>
            <p className="text-xs text-muted-foreground">
              {t("forms.imageUploadDescription")}
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            className="mt-2"
            onClick={(e) => {
              e.stopPropagation();
              document.getElementById("image-upload")?.click();
            }}
            disabled={isUploading || images.length >= MAX_IMAGES}
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t("forms.uploading")}
              </>
            ) : (
              t("forms.uploadImages")
            )}
          </Button>
          {isUploading && (
            <Loader2 className="mt-2 h-4 w-4 animate-spin text-primary" />
          )}
        </div>
      </div>

      {images.length > 0 && (
        <div
          className={`grid grid-cols-${MAX_IMAGES} gap-2`}
          role="list"
          aria-label={t("forms.uploadedImages")}
        >
          {images.map((image: RecipeImage) => (
            <ImagePreviewCard
              key={image.id}
              image={image}
              onClick={() => setPreviewImage(image)}
              onRemove={() => removeImage(image.id)}
              isUploading={isUploading}
            />
          ))}
        </div>
      )}

      <Dialog open={!!previewImage} onOpenChange={() => setPreviewImage(null)}>
        <DialogContent className="max-w-4xl">
          {previewImage && (
            <div className="relative">
              <PreviewImageDialog image={previewImage} />
              <p className="mt-2 text-sm text-center">{previewImage.name}</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Helper component for preview dialog image
function PreviewImageDialog({ image }: { image: RecipeImage }) {
  const { t } = useTranslation();
  const url = useObjectUrl(image.data);
  if (!url) return null;
  return (
    <img
      src={url}
      alt={t("forms.imagePreview", { name: image.name })}
      className="w-full h-auto rounded-lg"
    />
  );
}

function ImagePreviewCard({
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

export default ImageUploadField;
