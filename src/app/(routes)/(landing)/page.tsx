import { LoginLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { Button } from "@/components/ui/button";

const Page = () => (
  <div>
    <h1 className="font-bold text-2xl">Welcome to Orkestr</h1>
    <p className="mt-4 text-lg text-muted-foreground">
      Orkestr is an AI-native workflow system that designs, executes, and
      optimizes processes using agents, memory, and real-world integrations.
    </p>
    <p className="mt-2 text-lg text-muted-foreground">
      Please log in to access your dashboard and start creating workflows.
    </p>
    <LoginLink>
      <Button className="h-10 px-8">Log In</Button>
    </LoginLink>
  </div>
);

export default Page;
