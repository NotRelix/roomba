"use client";

import { Button } from "@repo/ui/components/button";
import { Input } from "@repo/ui/components/input";
import { useAuth } from "@repo/ui/hooks/auth";

export default function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="flex gap-4">
      <Button className="" variant={"default"}>
        no way it worked
      </Button>
      <Input placeholder="thank god ive been doing this for hours"></Input>

      {isAuthenticated ? <h1>Authenticated</h1> : <h1>Not authenticated</h1>}
    </div>
  );
}
