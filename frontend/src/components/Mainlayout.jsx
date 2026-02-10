import React from "react";
import { Outlet } from "react-router-dom";

export default function Mainlayout() {
  return (
    <div>
      Sidebar
      <div>
        <Outlet />
      </div>
    </div>
  );
}
