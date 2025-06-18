import { RecipeImage } from "@/types/recipe";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

interface RecipeImagesProps {
  images: RecipeImage[];
}

export default function RecipeImages({ images }: RecipeImagesProps) {
  if (!images || images.length === 0) {
    return null;
  }

  if (images.length === 1) {
    return (
      <div className="w-full max-w-3xl mx-auto">
        <Dialog>
          <DialogTrigger asChild>
            <Card className="cursor-pointer overflow-hidden group">
              <div className="relative aspect-[16/9]">
                <img
                  src={images[0].data}
                  alt={images[0].name}
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </Card>
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <img
              src={images[0].data}
              alt={images[0].name}
              className="w-full h-auto object-contain"
            />
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto">
      <Carousel className="w-full">
        <CarouselContent>
          {images.map((image) => (
            <CarouselItem key={image.id}>
              <Dialog>
                <DialogTrigger asChild>
                  <Card className="cursor-pointer overflow-hidden group">
                    <div className="relative aspect-[16/9]">
                      <img
                        src={image.data}
                        alt={image.name}
                        className="h-full w-full object-cover transition-transform group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </Card>
                </DialogTrigger>
                <DialogContent className="max-w-4xl">
                  <img
                    src={image.data}
                    alt={image.name}
                    className="w-full h-auto object-contain"
                  />
                </DialogContent>
              </Dialog>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-2" />
        <CarouselNext className="right-2" />
      </Carousel>
    </div>
  );
}
