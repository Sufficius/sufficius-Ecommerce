import { Outlet } from "react-router-dom";

export const AuthLayout = () => {
  return (
    <div className="w-full flex m-auto justify-around">
      <Outlet />
    </div>
  );
};
