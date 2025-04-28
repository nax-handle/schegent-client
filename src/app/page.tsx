import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <Button variant={"blue"} size={"sm"} className="w-full">
        Hello
      </Button>
    </div>
  );
}
