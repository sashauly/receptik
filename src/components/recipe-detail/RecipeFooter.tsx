import { Clock } from "lucide-react";

interface RecipeFooterProps {
  updatedAt: Date;
  author?: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const RecipeFooter: React.FC<RecipeFooterProps> = ({ updatedAt, author }) => {
  return (
    <>
      {/* TODO add author */}
      {/* <div itemProp="author">{recipe.author}</div> */}
      {updatedAt && (
        <div className="flex items-center">
          <Clock size={14} className="mr-1" />
          <span itemProp="dateModified">
            Last updated:{" "}
            {updatedAt.toLocaleString(
              localStorage.getItem("receptik-i18nextLng") || "en"
            )}
          </span>
        </div>
      )}
    </>
  );
};

export default RecipeFooter;
