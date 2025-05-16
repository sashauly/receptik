import { RecipeFormValues } from "@/data/schema";
import { Plus, X } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { FormControl, FormField, FormMessage } from "../ui/form";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";

const InstructionFields = () => {
  const { t } = useTranslation();
  const {
    setValue,
    getValues,
    watch,
    control,
    formState: { errors },
  } = useFormContext<RecipeFormValues>();

  const instructions = watch("instructions");

  const handleAddInstruction = () => {
    const currentInstructions = getValues("instructions");
    setValue("instructions", [...currentInstructions, ""]);
  };

  const handleRemoveInstruction = (index: number) => {
    const currentInstructions = getValues("instructions");
    if (currentInstructions.length > 1) {
      const newInstructions = [...currentInstructions];
      newInstructions.splice(index, 1);
      setValue("instructions", newInstructions);
    }
  };
  return (
    <div>
      <Label
        className={`text-sm font-medium text-inherit m-0 p-0 ${errors.instructions ? "text-destructive" : ""}`}
      >
        {t("forms.instructions")}
      </Label>
      <div className="space-y-2 mt-2">
        {instructions.map((_, index) => (
          <Card key={index}>
            <CardContent className="p-3">
              <div className="flex gap-2">
                <div className="pt-3 font-medium text-muted-foreground">
                  {index + 1}.
                </div>
                <div className="flex-grow">
                  <FormField
                    control={control}
                    name={`instructions.${index}`}
                    render={({ field }) => (
                      <>
                        <Label
                          htmlFor={`instruction-${index}`}
                          className="sr-only"
                        >
                          {t("forms.stepPlaceholder", { index: index + 1 })}
                        </Label>
                        <FormControl>
                          <Textarea
                            id={`instruction-${index}`}
                            placeholder={`${t("forms.stepPlaceholder", {
                              index: index + 1,
                            })}`}
                            rows={2}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </>
                    )}
                  />
                </div>
                <div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveInstruction(index)}
                    disabled={instructions.length <= 1}
                  >
                    <X />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleAddInstruction}
          className="mt-2"
        >
          <Plus />
          {t("forms.addStep")}
        </Button>
      </div>
    </div>
  );
};

export default InstructionFields;
