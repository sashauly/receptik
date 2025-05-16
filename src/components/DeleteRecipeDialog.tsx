import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useIsMobile } from "@/hooks/useMobile";
import type { Recipe } from "@/types/recipe";
import { useTranslation } from "react-i18next";
import { Button } from "./ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "./ui/drawer";

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
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={onClose}>
        <DrawerContent>
          {isLoading && <p>Deleting recipe...</p>}

          {error && <p className="text-destructive">{error.message}</p>}

          <DrawerHeader className="text-left">
            <DrawerTitle>{t("modals.deleteRecipe")}</DrawerTitle>
            <DrawerDescription>
              {t("modals.deleteRecipeConfirm", {
                recipeTitle: `"${recipeToDelete?.name}"`,
              })}
            </DrawerDescription>
          </DrawerHeader>
          <DrawerFooter className="pt-2">
            <DrawerClose asChild>
              <Button variant="outline">{t("common.cancel")}</Button>
            </DrawerClose>
            <Button variant="destructive" onClick={onConfirm}>
              {t("common.delete")}
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        {isLoading && <p>Deleting recipe...</p>}
        <AlertDialogHeader>
          <AlertDialogTitle>{t("modals.deleteRecipe")}</AlertDialogTitle>
          <AlertDialogDescription>
            {t("modals.deleteRecipeConfirm", {
              recipeTitle: `"${recipeToDelete?.name}"`,
            })}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>
            {t("common.delete")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
