import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
} from "@/components/ui/responsive-dialog";
import type { Recipe } from "@/types/recipe";
import { useTranslation } from "react-i18next";
import { Button } from "./ui/button";

interface DeleteRecipeDialogProps {
  recipeToDelete: Recipe | null | undefined;
  isLoading: boolean;
  error: Error | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteRecipeDialog({
  recipeToDelete,
  isLoading,
  error,
  isOpen,
  onClose,
  onConfirm,
}: DeleteRecipeDialogProps) {
  const { t } = useTranslation();

  return (
    <ResponsiveDialog open={isOpen} onOpenChange={onClose}>
      <ResponsiveDialogContent>
        {isLoading && <p>Deleting recipe...</p>}

        {error && <p className="text-destructive">{error.message}</p>}

        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>
            {t("modals.deleteRecipe")}
          </ResponsiveDialogTitle>
          <ResponsiveDialogDescription>
            {t("modals.deleteRecipeConfirm", {
              recipeTitle: `"${recipeToDelete?.name}"`,
            })}
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>
        <ResponsiveDialogFooter>
          <Button variant="outline" onClick={onClose}>
            {t("common.cancel")}
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            {t("common.delete")}
          </Button>
        </ResponsiveDialogFooter>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
}
