import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { CalendarClock } from "lucide-react";
export default function ContextMenuComponent({
  children,
  onOpenChange,
  openDialog,
}: {
  children: React.ReactNode;
  onOpenChange?: (open: boolean) => void;
  openDialog?: () => void;
}) {
  return (
    <ContextMenu onOpenChange={onOpenChange}>
      <ContextMenuTrigger className="w-full h-full">
        {children}
      </ContextMenuTrigger>
      <ContextMenuContent className="w-56">
        <ContextMenuItem onClick={openDialog}>
          <CalendarClock />
          Create event
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
