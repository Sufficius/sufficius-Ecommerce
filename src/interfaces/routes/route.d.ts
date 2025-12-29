interface IRouteProps {
    path?: string;
    element: FC;
    visibility: "public" | "private" | "auth";
    children?: IRouteProps[];
    index?: boolean; 
}

interface IRouteWrapperProps {
    visibility: "public" | "private" | "auth";
    element: FC;
}
