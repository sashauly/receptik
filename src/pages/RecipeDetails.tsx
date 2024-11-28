import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
// import { useAuth0 } from "@auth0/auth0-react";
import { Clock, Users, Trash2, Edit, Share2 } from "lucide-react";
import { Recipe } from "@/types/recipe";
import { storage } from "@/lib/storage";
import { Modal, Button, Text, Group } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { toast } from "sonner";

export default function RecipeDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  // const { user } = useAuth0();
  const user = {
    sub: "userId",
  };
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [opened, { open, close }] = useDisclosure(false);

  useEffect(() => {
    if (id) {
      const allRecipes = storage.getRecipes();
      const foundRecipe = allRecipes.find((r) => r.id === id);
      setRecipe(foundRecipe || null);
    }
  }, [id]);

  if (!recipe) {
    return <div>Recipe not found</div>;
  }

  const isOwner = user?.sub === recipe.userId;

  const handleDelete = () => {
    if (id) {
      storage.deleteRecipe(id);
      toast.success("Recipe deleted successfully");
      navigate("/my-recipes");
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: recipe.title,
          text: recipe.description,
          url: window.location.href,
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      // Fallback to copying URL
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard");
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-4xl font-bold">{recipe.title}</h1>
          <p className="text-muted-foreground mt-2">{recipe.description}</p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={handleShare}>
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>

          {isOwner && (
            <>
              <Button
                variant="outline"
                onClick={() => navigate(`/edit-recipe/${recipe.id}`)}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>

              {/* TODO modal on delete */}
              <Modal
                opened={opened}
                onClose={close}
                size="auto"
                centered
                title="Are you sure?"
              >
                <Text>
                  This action cannot be undone. This will permanently delete
                  your recipe.
                </Text>
                <Group align="right">
                  <Button onClick={close}>Cancel</Button>
                  <Button onClick={handleDelete}>Delete</Button>
                </Group>
              </Modal>

              <Button onClick={open}>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-8">
        {(recipe.prepTime || recipe.cookTime) && (
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            <span>
              {recipe.prepTime && `${recipe.prepTime} min prep`}
              {recipe.prepTime && recipe.cookTime && " + "}
              {recipe.cookTime && `${recipe.cookTime} min cook`}
            </span>
          </div>
        )}
        {recipe.servings && (
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-1" />
            <span>{recipe.servings} servings</span>
          </div>
        )}
      </div>

      {/* TODO: add ingredients and instructions */}
      {/* <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Ingredients</h2>
          <ul className="space-y-2">
            {recipe.ingredients.map((ingredient, index) => (
              <li key={index} className="flex items-center">
                <span className="w-2 h-2 bg-primary rounded-full mr-2" />
                {ingredient}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4">Instructions</h2>
          <ol className="space-y-4">
            {recipe.instructions.map((instruction, index) => (
              <li key={index} className="flex">
                <span className="font-bold mr-4">{index + 1}.</span>
                {instruction}
              </li>
            ))}
          </ol>
        </div>
      </div> */}
    </div>
  );
}
