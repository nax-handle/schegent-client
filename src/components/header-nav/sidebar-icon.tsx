import React from "react";
import {
  House,
  Logs,
  UsersRound,
  ClipboardList,
  TextSelect,
} from "lucide-react";

export default function SideBarIcon() {
  return (
    <div className="w-14 px-2 flex justify-center border-r items-center">
      <div className=" block ">
        <House className="w-6 h-6 mb-10 text-black hover:text-blue-500 cursor-pointer" />
        <UsersRound className="w-6 h-6 mb-10 text-black hover:text-blue-500 cursor-pointer" />
        <Logs className="w-6 h-6 mb-10 text-black hover:text-blue-500 cursor-pointer" />
        <ClipboardList className="w-6 h-6 mb-10 text-black hover:text-blue-500 cursor-pointer" />
        <TextSelect className="w-6 h-6 mb-10 text-black hover:text-blue-500 cursor-pointer" />
      </div>
    </div>
  );
}
