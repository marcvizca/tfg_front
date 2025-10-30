import { Outlet } from "react-router-dom";
import Header from "./Header";
import Header2 from "./Header2";

export const HeaderTemplate = () => {
  return (
    <div>
      <Header /> 
      <Outlet />
    </div>
  );
};