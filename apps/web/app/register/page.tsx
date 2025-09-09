import { Button } from "@repo/ui/components/button";
import { Input } from "@repo/ui/components/input";
import { Label } from "@repo/ui/components/label";
import Link from "next/link";

export default function Register() {
  return (
    <div className="flex h-full flex-1 items-center justify-center">
      <div className="border-1 bg-card flex h-fit w-full max-w-[450px] flex-col gap-6 rounded-lg p-8">
        <div className="flex flex-col gap-6">
          <h1 className="text-3xl font-semibold">Register</h1>
          <p>
            Don't have an account yet?{" "}
            <Link
              className="text-blue-600 underline dark:text-blue-400"
              href={"/login"}
            >
              Login
            </Link>
          </p>
        </div>
        <form className="flex flex-col gap-4">
          <div className="flex gap-4">
            <div className="flex flex-col gap-3">
              <Label htmlFor="firstName" className="text-muted-foreground">
                First Name
              </Label>
              <Input type="text" id="firstName" placeholder="Jimmy" />
            </div>
            <div className="flex flex-col gap-3">
              <Label htmlFor="lastName" className="text-muted-foreground">
                Last Name
              </Label>
              <Input type="text" id="lastName" placeholder="James" />
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <Label htmlFor="username" className="text-muted-foreground">
              Username
            </Label>
            <Input type="text" id="username" placeholder="themanhimself3000" />
          </div>
          <div className="flex flex-col gap-3">
            <Label htmlFor="email" className="text-muted-foreground">
              Email
            </Label>
            <Input type="email" id="email" placeholder="theman@email.com" />
          </div>
          <div className="flex flex-col gap-3">
            <Label htmlFor="password" className="text-muted-foreground">
              Password
            </Label>
            <Input type="password" id="password" placeholder="Enter password" />
          </div>
          <div className="flex flex-col gap-3">
            <Label htmlFor="confirmPassword" className="text-muted-foreground">
              Confirm password
            </Label>
            <Input
              type="password"
              id="confirmPassword"
              placeholder="Enter password again"
            />
          </div>
          <Button variant="ghost" className="border-1 mt-2 max-w-48">
            Register
          </Button>
        </form>
      </div>
    </div>
  );
}
