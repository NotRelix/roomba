import { ModeToggle } from "@/components/toggle-mode";
import { Button } from "@repo/ui/components/button";
import { Input } from "@repo/ui/components/input";

export default function Home() {
  return (
    <div className="gap-4 flex">
      <Button className="" variant={"default"}>
        no way it worked
      </Button>
      <Input placeholder="thank god ive been doing this for hours"></Input>
      <ModeToggle />
    </div>
  );
}
