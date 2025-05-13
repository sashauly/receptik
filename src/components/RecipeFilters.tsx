import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslation } from "react-i18next";
import Overflow from "./Overflow";

interface RecipeFiltersProps {
  activeKeyword: string;
  keywords: string[];
  onKeywordChange: (value: string) => void;
}

export default function RecipeFilters({
  activeKeyword,
  keywords,
  onKeywordChange,
}: RecipeFiltersProps) {
  const { t } = useTranslation();

  return (
    <div className="relative">
      <Overflow>
        <Overflow.Content>
          <Tabs
            value={activeKeyword}
            onValueChange={onKeywordChange}
            className="w-full"
          >
            <TabsList className="min-w-full sm:min-w-0 whitespace-nowrap">
              <TabsTrigger value="all">{t("home.allRecipes")}</TabsTrigger>
              {keywords &&
                keywords.map((tag) => (
                  <TabsTrigger key={tag} value={tag}>
                    {tag}
                  </TabsTrigger>
                ))}
            </TabsList>
          </Tabs>
        </Overflow.Content>

        <Overflow.Indicator direction="left">
          {(canScroll) =>
            canScroll && (
              <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-background to-transparent pointer-events-none z-10" />
            )
          }
        </Overflow.Indicator>

        <Overflow.Indicator direction="right">
          {(canScroll) =>
            canScroll && (
              <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-background to-transparent pointer-events-none z-10" />
            )
          }
        </Overflow.Indicator>
      </Overflow>
    </div>
  );
}
