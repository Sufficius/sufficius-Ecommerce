import { FC } from "react";

interface IRouteProps {
    path?: string;
    element: FC;
    visibility: "public" | "private" | "auth" | "guest";
    children?: IRouteProps[];
    index?: boolean; 
}

interface IRouteWrapperProps {
    visibility: "public" | "private" | "auth" | "guest";
    element: FC;
}
