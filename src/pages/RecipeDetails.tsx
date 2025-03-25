import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Clock, Users, Trash2, Edit, Share2 } from "lucide-react";
import { Recipe } from "@/types/recipe";
import { idbStorage } from "@/lib/storage";
import { Modal, Button, Text, Group } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { toast } from "sonner";

export default function RecipeDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const user = {
    sub: "userId",
  };
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [opened, { open, close }] = useDisclosure(false);

  useEffect(() => {
    const loadRecipeById = async () => {
      setLoading(true);
      if (id) {
        const foundRecipe = await idbStorage.getRecipeById(id);
        setRecipe(foundRecipe || null);
      }
      setLoading(false);
    };
    loadRecipeById();
  }, [id]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!recipe) {
    return <div>Recipe not found</div>;
  }

  const isOwner = user?.sub === recipe.userId;

  const handleDelete = async () => {
    if (id) {
      await idbStorage.deleteRecipe(id);
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
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-4xl font-bold">{recipe.title}</h1>
          <p className="mt-2 text-muted-foreground">{recipe.description}</p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={handleShare}>
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>

          {isOwner && (
            <>
              <Button
                variant="outline"
                onClick={() => navigate(`/edit-recipe/${recipe.id}`)}
              >
                <Edit className="w-4 h-4 mr-2" />
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
                  <Button variant="default" onClick={close}>
                    Cancel
                  </Button>
                  <Button variant="filled" color="red" onClick={handleDelete}>
                    Delete
                  </Button>
                </Group>
              </Modal>

              <Button variant="outline" color="red" onClick={open}>
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="flex items-center mb-8 space-x-4 text-sm text-muted-foreground">
        {(recipe.prepTime || recipe.cookTime) && (
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            <span>
              {recipe.prepTime && `${recipe.prepTime} min prep`}
              {recipe.prepTime && recipe.cookTime && " + "}
              {recipe.cookTime && `${recipe.cookTime} min cook`}
            </span>
          </div>
        )}
        {recipe.servings && (
          <div className="flex items-center">
            <Users className="w-4 h-4 mr-1" />
            <span>{recipe.servings} servings</span>
          </div>
        )}
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Ingredients</h2>
          <ul className="space-y-2">
            {recipe.ingredients.map((ingredient, index) => (
              <li key={index} className="flex items-center">
                <span className="w-2 h-2 mr-2 rounded-full bg-primary" />
                {ingredient}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="mb-4 text-2xl font-semibold">Instructions</h2>
          <ol className="space-y-4">
            {recipe.instructions.map((instruction, index) => (
              <li key={index} className="flex">
                <span className="mr-4 font-bold">{index + 1}.</span>
                {instruction}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}
