import { RecipeFormValues } from "@/lib/schema";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import TimeFields from "./TimeFields";

const BasicInfoFields: React.FC = () => {
  const { t } = useTranslation();
  const { control } = useFormContext<RecipeFormValues>();

  return (
    <>
      <FormField
        control={control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel htmlFor="name">{t("forms.recipeName")}</FormLabel>
            <FormControl>
              <Input
                id="name"
                type="text"
                placeholder={t("forms.namePlaceholder")}
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

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
                onChange={(e) => field.onChange(Number(e.target.value))}
                itemProp="recipeYield"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <TimeFields />
    </>
  );
};

export default BasicInfoFields;
