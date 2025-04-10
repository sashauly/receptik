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
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from "./ui/drawer";

interface DeleteRecipeDialogProps {
  recipe: Recipe | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteRecipeDialog({
  recipe,
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
          <DrawerHeader className="text-left">
            <DrawerTitle>{t("modals.deleteRecipe")}</DrawerTitle>
            <DrawerDescription>
              {t("modals.deleteRecipeConfirm", {
                recipeTitle: `"${recipe?.title}"`,
              })}
            </DrawerDescription>
          </DrawerHeader>
          <DrawerFooter className="pt-2">
            <DrawerClose asChild>
              <Button variant="outline">{t("common.cancel")}</Button>
            </DrawerClose>
            <Button onClick={onConfirm} className="bg-red-600 hover:bg-red-700">
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
        <AlertDialogHeader>
          <AlertDialogTitle>{t("modals.deleteRecipe")}</AlertDialogTitle>
          <AlertDialogDescription>
            {t("modals.deleteRecipeConfirm", {
              recipeTitle: `"${recipe?.title}"`,
            })}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700"
          >
            {t("common.delete")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
