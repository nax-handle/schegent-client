import ContextMenuComponent from "@/components/context-menu/create-event";
export default function TestPage() {
  return (
    <ContextMenuComponent>
      <div className="w-64 h-64 bg-gray-200 flex items-center justify-center">
        Right-click me!
      </div>
    </ContextMenuComponent>
  );
}
