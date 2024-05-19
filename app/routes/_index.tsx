import type { MetaFunction } from "@remix-run/node";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "~/components/ui/carousel";
import { Root } from "~/posts";
import { Users } from "~/users";

export const meta: MetaFunction = () => {
  return [{ title: "Final Yahoo" }, { name: "description", content: "Lemme get that final" }];
};

const getPosts = async (): Promise<Root> => {
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

  return (
    <div className="flex flex-col gap-4 h-screen">
      <h1>Yahoo</h1>
      <div className="container m-auto">
        <Carousel className="basis-1/2">
          <CarouselContent>
            {posts?.map((post) => (
              <CarouselItem key={post.id}>
                <Card key={post.id}>
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
      </div>
    </div>
  );
}
