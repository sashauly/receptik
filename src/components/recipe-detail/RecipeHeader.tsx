import { Button } from "@/components/ui/button";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { ChevronLeft, Edit, Share2, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";

interface RecipeHeaderProps {
  onEdit: () => void;
  onDelete: () => void;
  onShare: () => void;
}

function RecipeHeader({ onEdit, onDelete, onShare }: RecipeHeaderProps) {
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
    <div className="flex items-center justify-between mb-4 gap-2">
      <Button
        variant="ghost"
        onClick={handleClickBackButton}
        className="flex items-center"
      >
        <ChevronLeft />
        {t("common.back")}
      </Button>

      <div className="flex flex-wrap gap-2">
        {/* <Button variant="outline" disabled onClick={onAddToFavorites}>
          <Heart />
          {!isSmallDevice && t("common.addToFavorites")}
        </Button> */}
        <Button variant="outline" onClick={onEdit}>
          <Edit />
          {!isSmallDevice && t("common.edit")}
        </Button>
        <Button variant="outline" onClick={onShare}>
          <Share2 />
          {!isSmallDevice && t("common.share")}
        </Button>
        <Button variant="destructive" onClick={onDelete}>
          <Trash2 />
          {!isSmallDevice && t("common.delete")}
        </Button>
      </div>
    </div>
  );
}

export default RecipeHeader;
