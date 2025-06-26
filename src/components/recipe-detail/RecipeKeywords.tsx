import { Badge } from "@/components/ui/badge";

interface RecipeKeywordsProps {
  keywords: string[];
}

export default function RecipeKeywords({ keywords }: RecipeKeywordsProps) {
  if (!keywords || keywords.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-2">
      {keywords.map((keyword) => (
        <Badge key={keyword} variant="outline" itemProp="keywords">
          {keyword}
        </Badge>
      ))}
    </div>
  );
}
