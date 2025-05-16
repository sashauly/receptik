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
    </>
  );
};

export default BasicInfoFields;
