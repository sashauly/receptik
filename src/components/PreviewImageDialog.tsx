import { useObjectUrl } from "@/hooks/useObjectUrl";
import { RecipeImage } from "@/types/recipe";
import { useTranslation } from "react-i18next";

export default function PreviewImageDialog({ image }: { image: RecipeImage }) {
  const { t } = useTranslation();
  const url = useObjectUrl(image.data);
  if (!url) return null;
  return (
    <img
      src={url}
      alt={t("forms.imagePreview", { name: image.name })}
      className="w-full h-auto rounded-lg"
      draggable={false}
    />
  );
}
