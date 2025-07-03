import { Button } from "@/components/ui/button";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { cn } from "@/lib/utils";
import { ChevronLeft, Edit, Share2, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";

interface RecipeHeaderProps {
  onEdit: () => void;
  onDelete: () => void;
  onShare: () => void;
}

export default function RecipeHeader({
  onEdit,
  onDelete,
  onShare,
}: RecipeHeaderProps) {
  const { t } = useTranslation();
  const isSmallDevice = useMediaQuery("(max-width: 768px)");
  const navigate = useNavigate();

  const handleClickBackButton = () => {
    navigate("/");
  };

  // const onAddToFavorites = () => {
  //   // TODO add to favorites
  // };

  return (
    <div
      className={cn(
        "fixed top-0 left-0 right-0 z-50",
        "flex justify-between items-center gap-2",
        "w-full p-4"
      )}
    >
      <Button
        size={isSmallDevice ? "icon" : "sm"}
        variant="outline"
        onClick={handleClickBackButton}
        aria-label={t("common.back")}
      >
        <ChevronLeft size={20} />
        {!isSmallDevice && t("common.back")}
      </Button>
      <div className="flex gap-2">
        {/* <Button variant="outline" disabled onClick={onAddToFavorites}>
          <Heart />
          {!isSmallDevice && t("common.addToFavorites")}
        </Button> */}
        <Button
          onClick={onEdit}
          aria-label="Edit"
          variant="outline"
          size={isSmallDevice ? "icon" : "sm"}
        >
          <Edit size={20} />
          {!isSmallDevice && t("common.edit")}
        </Button>
        <Button
          onClick={onShare}
          aria-label="Share"
          variant="outline"
          size={isSmallDevice ? "icon" : "sm"}
        >
          <Share2 size={20} />
          {!isSmallDevice && t("common.share")}
        </Button>
        <Button
          onClick={onDelete}
          aria-label="Delete"
          variant="destructive"
          size={isSmallDevice ? "icon" : "sm"}
        >
          <Trash2 size={20} />
          {!isSmallDevice && t("common.delete")}
        </Button>
      </div>
    </div>
  );
}
