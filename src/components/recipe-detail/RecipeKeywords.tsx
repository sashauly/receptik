import { Badge } from "../ui/badge";

interface RecipeKeywordsProps {
  keywords: string[];
}

const RecipeKeywords: React.FC<RecipeKeywordsProps> = ({ keywords }) => {
  if (!keywords || keywords.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {keywords.map((keyword) => (
        <Badge
          key={keyword}
          variant="outline"
          className="bg-muted/50 rounded-full"
          itemProp="keywords"
        >
          {keyword}
        </Badge>
      ))}
    </div>
  );
};

export default RecipeKeywords;
