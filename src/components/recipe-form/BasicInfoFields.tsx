import { useTranslation } from "react-i18next";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { useFormContext } from "react-hook-form";
import { RecipeFormValues } from "@/lib/schema";

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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormField
          control={control}
          name="prepTime"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="prepTime">{t("forms.prepTime")}</FormLabel>
              <FormControl>
                <Input
                  id="prepTime"
                  placeholder={t("forms.prepTimePlaceholder")}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="cookTime"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="cookTime">{t("forms.cookTime")}</FormLabel>
              <FormControl>
                <Input
                  id="cookTime"
                  placeholder={t("forms.cookTimePlaceholder")}
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
              <FormLabel htmlFor="servings">{t("forms.servings")}</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  id="servings"
                  min="1"
                  placeholder={t("forms.servingsPlaceholder")}
                  {...field}
                  onChange={(e) =>
                    field.onChange(Number.parseInt(e.target.value))
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </>
  );
};

export default BasicInfoFields;
