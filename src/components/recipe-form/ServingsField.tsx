import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

export default function ServingsField() {
  const { t } = useTranslation();
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name="servings"
      render={({ field }) => (
        <FormItem>
          <FormLabel>{t("forms.servings")}</FormLabel>
          <FormControl>
            <Input
              type="number"
              min="1"
              {...field}
              placeholder={t("forms.servingsPlaceholder")}
              itemProp="recipeYield"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
