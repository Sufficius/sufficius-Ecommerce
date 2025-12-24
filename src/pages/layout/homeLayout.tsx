
import { Outlet } from "react-router-dom";

export const HomeLayout = () => {

  return (
        <main className="flex-1 bg-red-500 p-4 overflow-auto">
          <Outlet />
        </main>
  );
};
