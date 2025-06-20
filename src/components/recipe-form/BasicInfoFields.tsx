import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RecipeFormValues } from "@/data/schema";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Textarea } from "@/components/ui/textarea";

function BasicInfoFields() {
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
                autoComplete="off"
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
        name="author"
        render={({ field }) => (
          <FormItem>
            <FormLabel htmlFor="author">{t("forms.author")}</FormLabel>
            <FormControl>
              <Input
                id="author"
                type="text"
                autoComplete="off"
                placeholder={t("forms.authorPlaceholder")}
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("forms.description")}</FormLabel>
            <FormControl>
              <Textarea
                placeholder={t("forms.descriptionPlaceholder")}
                className="resize-none"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}

export default BasicInfoFields;
