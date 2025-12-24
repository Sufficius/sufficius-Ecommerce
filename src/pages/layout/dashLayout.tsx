import { Outlet } from "react-router-dom";

export const DashLayout = () => {
  return (
    <main className="flex-1 overflow-auto">
      <Outlet />
    </main>
  );
};
