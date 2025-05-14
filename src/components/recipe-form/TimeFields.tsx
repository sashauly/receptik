import TimeInput from "@/components/recipe-form/TimeInput";
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

const TimeFields = () => {
  const { t } = useTranslation();
  const { control } = useFormContext();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <FormField
        control={control}
        name="prepTime"
        render={({ field }) => (
          <FormItem>
            <FormLabel htmlFor="prepTime-hours">
              {t("forms.prepTime")}
            </FormLabel>
            <FormControl>
              <TimeInput
                name="prepTime"
                value={field.value}
                onChange={field.onChange}
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
            <FormLabel htmlFor="cookTime-hours">
              {t("forms.cookTime")}
            </FormLabel>
            <FormControl>
              <TimeInput
                name="cookTime"
                value={field.value}
                onChange={field.onChange}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default TimeFields;
