import type { MetaFunction } from "@remix-run/node";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "~/components/ui/carousel";
import { TypewriterEffect } from "~/components/ui/typewriter-effect";
import { Posts } from "~/posts";
import { Users } from "~/users";

export const meta: MetaFunction = () => {
  return [
    { title: "Final Yahoo" },
    { name: "description", content: "Lemme get that final" },
    { name: "og:image", content: "https://i.ytimg.com/vi/za4gpbYCuSs/maxresdefault.jpg" },
  ];
};

const getPosts = async (): Promise<Posts> => {
  const response = await fetch("https://jsonplaceholder.typicode.com/posts");
  return await response.json();
};

const getUsers = async (): Promise<Users> => {
  const response = await fetch("https://jsonplaceholder.typicode.com/users");
  return await response.json();
};

export default function Index() {
  const { data: posts } = useQuery({ queryKey: ["posts"], queryFn: getPosts });
  const { data: users } = useQuery({ queryKey: ["users"], queryFn: getUsers });
  const [api, setApi] = useState<CarouselApi>();

  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    window.addEventListener("keydown", (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") {
        api.scrollNext();
      } else if (event.key === "ArrowLeft") {
        api.scrollPrev();
      }
    });

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  return (
    <div className="flex flex-col gap-4 h-screen">
      <TypewriterEffect words={[{ text: "Yahoo" }]} />
      <div className="container m-auto">
        <Carousel setApi={setApi} className="basis-1/2">
          <CarouselContent>
            {posts?.map((post) => (
              <CarouselItem key={post.id}>
                <Card>
                  <CardHeader>
                    <CardTitle>{post.title}</CardTitle>
                    <CardContent>{post.body}</CardContent>
                  </CardHeader>
                  <CardFooter>{users?.find((user) => user.id === post.userId)?.name}</CardFooter>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
        <div className="py-2 text-center text-sm text-muted-foreground">
          {current} of {count}
        </div>
      </div>
    </div>
  );
}
