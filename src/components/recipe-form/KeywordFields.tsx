import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RecipeFormValues } from "@/data/schema";
import { Plus, X } from "lucide-react";
import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

const KeywordFields: React.FC = () => {
  const { t } = useTranslation();
  const form = useFormContext<RecipeFormValues>();

  const [keywordInput, setKeywordInput] = useState("");

  const handleAddKeyword = () => {
    if (keywordInput.trim()) {
      const currentKeywords = form.getValues("keywords");
      if (currentKeywords && !currentKeywords.includes(keywordInput.trim())) {
        form.setValue("keywords", [...currentKeywords, keywordInput.trim()]);
      }
      setKeywordInput("");
    }
  };

  const handleRemoveKeyword = (keyword: string) => {
    const currentKeywords = form.getValues("keywords");
    form.setValue(
      "keywords",
      currentKeywords && currentKeywords.filter((k) => k !== keyword)
    );
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleAddKeyword();
    }
  };

  return (
    <FormField
      control={form.control}
      name="keywords"
      render={({ field }) => (
        <FormItem>
          <FormLabel htmlFor="keywords">{t("forms.keywords")}</FormLabel>
          <div className="flex flex-wrap gap-2">
            {field.value?.map((keyword) => (
              <div
                key={keyword}
                className="flex items-center bg-orange-100 text-orange-800 rounded-full px-3 py-1 text-sm"
              >
                {keyword}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0 ml-1"
                  onClick={() => handleRemoveKeyword(keyword)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <FormControl>
              <Input
                id="keywords"
                value={keywordInput}
                onChange={(e) => setKeywordInput(e.target.value)}
                placeholder={t("forms.keywordsPlaceholder")}
                onKeyDown={handleKeyDown}
              />
            </FormControl>
            <Button
              type="button"
              size="icon"
              onClick={handleAddKeyword}
              variant="outline"
            >
              <Plus />
            </Button>
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default KeywordFields;
