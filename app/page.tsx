import Form from "@/components/form";
import Navbar from "@/components/navbar";
import TaskList from "@/components/task-list";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

export default function Home() {
  return (
    <div className="h-screen flex flex-col px-4 md:px-16 lg:px-32 xl:px-56 2xl:px-80">
      <Navbar />
      <ResizablePanelGroup
        className="flex-1 w-full border rounded-lg overflow-hidden"
        direction="vertical"
      >
        <ResizablePanel defaultSize={45} minSize={20}>
          <div className="h-full overflow-y-auto p-6">
            <Card className="border-0 shadow-none">
              <CardHeader className="px-0 pt-0">
                <CardTitle>Create a New Task</CardTitle>
                <CardDescription>
                  What do you want to accomplish today?
                </CardDescription>
              </CardHeader>
              <CardContent className="px-0 pb-0">
                <Form />
              </CardContent>
            </Card>
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={65} minSize={25}>
          <div className="h-full overflow-y-auto p-6">
            <TaskList />
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
