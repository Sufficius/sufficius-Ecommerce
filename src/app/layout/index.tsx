interface LayoutProps{
    children:React.ReactNode;
}

export const Layout:React.FC<LayoutProps> = ({children}) => {
    return (
        <main>
            {children}
        </main>
    )
}