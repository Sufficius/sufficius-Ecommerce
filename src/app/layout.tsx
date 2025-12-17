// import { Suspense, useMemo, useState, type ReactNode } from "react";
// import { APP_CONFIG } from "./layout/app";
// import QueryProvider from "@/config/tanstack-query/queryClientProvider";
// import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
// import { ExpandableAppSidebar } from "./layout/sidebarConfig/expandable-app-sidebar";
// import { MessageCircleMoreIcon } from "lucide-react";
// import { useLocation, Link } from "react-router-dom";
// import { Separator } from "@/components/ui/separator";
// import { motion } from "framer-motion";
// import NotificationIndicator from "@/components/notifications/NotificationIndicator";
// import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

// function generateBreadcrumbs(pathname: string) {
//   if (!pathname || pathname === "/akin" || pathname === "/akin/" || pathname === "/akin/dashboard") {
//     return [
//       {
//         label: "Painel Geral",
//         href: "/akin/dashboard",
//         isCurrentPage: true
//       }
//     ];
//   }

//   let bestMatch = null;
//   let matchedSubItem = null;
//   let bestMatchLength = 0;

//   // Primeiro, encontrar o melhor match no menu
//   for (const menuItem of APP_CONFIG.ROUTES.MENU) {
//     // Verificar item principal
//     if (pathname.startsWith(menuItem.path) && menuItem.path.length > bestMatchLength) {
//       bestMatch = menuItem;
//       matchedSubItem = null;
//       bestMatchLength = menuItem.path.length;
//     }

//     // Verificar subitens
//     if (menuItem.subItems) {
//       for (const subItem of menuItem.subItems) {
//         if (pathname.startsWith(subItem.path) && subItem.path.length > bestMatchLength) {
//           bestMatch = menuItem;
//           matchedSubItem = subItem;
//           bestMatchLength = subItem.path.length;
//         }
//       }
//     }
//   }

//   const breadcrumbs = [];

//   if (bestMatch) {
//     if (matchedSubItem) {
//       // Se está em um subitem
//       if (pathname === matchedSubItem.path) {
//         // Mostrar: MenuPrincipal > SubItem (exato)
//         breadcrumbs.push({
//           label: bestMatch.label,
//           href: bestMatch.path,
//           isCurrentPage: false
//         });
//         breadcrumbs.push({
//           label: matchedSubItem.label,
//           href: matchedSubItem.path,
//           isCurrentPage: true
//         });
//       } else {
//         // Mostrar: MenuPrincipal > SubItem > PáginaAtual
//         breadcrumbs.push({
//           label: bestMatch.label,
//           href: bestMatch.path,
//           isCurrentPage: false
//         });
//         breadcrumbs.push({
//           label: matchedSubItem.label,
//           href: matchedSubItem.path,
//           isCurrentPage: false
//         });

//         // Adicionar último segmento como página atual
//         const segments = pathname.split('/').filter(Boolean);
//         const lastSegment = segments[segments.length - 1];
//         const formattedLabel = lastSegment
//           .split('-')
//           .map(word => word.charAt(0).toUpperCase() + word.slice(1))
//           .join(' ');

//         breadcrumbs.push({
//           label: formattedLabel,
//           href: pathname,
//           isCurrentPage: true
//         });
//       }
//     } else {
//       // Se está no item principal
//       if (pathname === bestMatch.path) {
//         // Exatamente no item principal
//         breadcrumbs.push({
//           label: bestMatch.label,
//           href: bestMatch.path,
//           isCurrentPage: true
//         });
//       } else {
//         // Numa subpágina do item principal
//         breadcrumbs.push({
//           label: bestMatch.label,
//           href: bestMatch.path,
//           isCurrentPage: false
//         });

//         // Adicionar segmentos adicionais
//         const itemPathSegments = bestMatch.path.split('/').filter(Boolean);
//         const currentPathSegments = pathname.split('/').filter(Boolean);

//         for (let i = itemPathSegments.length; i < currentPathSegments.length; i++) {
//           const isLast = i === currentPathSegments.length - 1;
//           const segmentPath = '/' + currentPathSegments.slice(0, i + 1).join('/');

//           const formattedLabel = currentPathSegments[i]
//             .split('-')
//             .map(word => word.charAt(0).toUpperCase() + word.slice(1))
//             .join(' ');

//           breadcrumbs.push({
//             label: formattedLabel,
//             href: segmentPath,
//             isCurrentPage: isLast
//           });
//         }
//       }
//     }
//   } else {
//     // Se não encontrou no menu, gerar baseado na URL
//     const segments = pathname.split('/').filter(Boolean);
    
//     // Pular segmento "akin" se existir
//     const startIndex = segments[0] === 'akin' ? 1 : 0;
    
//     for (let i = startIndex; i < segments.length; i++) {
//       const isLast = i === segments.length - 1;
//       const segmentPath = '/' + segments.slice(0, i + 1).join('/');

//       const formattedLabel = segments[i]
//         .split('-')
//         .map(word => word.charAt(0).toUpperCase() + word.slice(1))
//         .join(' ');

//       breadcrumbs.push({
//         label: formattedLabel,
//         href: segmentPath,
//         isCurrentPage: isLast
//       });
//     }
//   }

//   // Garantir que temos pelo menos um breadcrumb
//   if (breadcrumbs.length === 0) {
//     breadcrumbs.push({
//       label: "Dashboard",
//       href: "/dashboard",
//       isCurrentPage: true
//     });
//   }

//   return breadcrumbs;
// }

// interface IDashboard {
//   children: ReactNode;
// }

// export default function Akin({ children }: IDashboard) {
//   const [isChatOpen, setIsChatOpen] = useState(false);

//   return (
//     <QueryProvider>
//       <SidebarProvider>
//         <ExpandableAppSidebar />
//         <SidebarContentWrapper>{children}</SidebarContentWrapper>

//         {/* Botão flutuante do chat */}
//         <motion.button
//           whileHover={{ scale: 1.1 }}
//           whileTap={{ scale: 0.9 }}
//           onClick={() => setIsChatOpen(!isChatOpen)}
//           className="fixed bottom-6 right-6 z-50 p-4 bg-akin-turquoise text-white rounded-full shadow-lg hover:bg-akin-turquoise/80 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-300"
//           aria-label="Abrir chat"
//         >
//           <MessageCircleMoreIcon size={24} />
//         </motion.button>
        
//         {/* Componente do chat (comentado por enquanto) */}
//         {/* <Chatbot isChatOpen={isChatOpen} onClose={() => setIsChatOpen(false)} /> */}
//       </SidebarProvider>
//     </QueryProvider>
//   );
// }

// // Wrapper para o conteúdo principal
// function SidebarContentWrapper({ children }: { children: ReactNode }) {
// //   const { state } = useSidebar();
//   const location = useLocation();
//   const pathname = location.pathname;

//   const breadcrumbs = useMemo(() => {
//     return generateBreadcrumbs(pathname);
//   }, [pathname]);

//   return (
//     <SidebarInset className={`flex-1 flex flex-col transition-all duration-300 gap-3`}>
//       {/* Header com breadcrumbs */}
//       <header className="flex h-[51px] shrink-0 items-center gap-2 border-b px-4 bg-white">
//         <SidebarTrigger className="-ml-1" />
//         <Separator orientation="vertical" className="mr-2 h-4" />
        
//         <Breadcrumb className="w-full">
//           <BreadcrumbList className="w-full flex flex-wrap md:flex-nowrap items-center">
//             {breadcrumbs.map((breadcrumb, index) => (
//               <div key={`${breadcrumb.href}-${index}`} className="flex items-center">
//                 {index > 0 && <BreadcrumbSeparator className="hidden md:block" />}
//                 <BreadcrumbItem className={index === 0 ? "hidden md:block" : ""}>
//                   {breadcrumb.isCurrentPage ? (
//                     <BreadcrumbPage className="max-w-[200px] truncate">
//                       {breadcrumb.label}
//                     </BreadcrumbPage>
//                   ) : (
//                     <BreadcrumbLink
//                       asChild
//                       className="text-akin-turquoise hover:text-akin-turquoise/80 transition-colors"
//                     >
//                       <Link to={breadcrumb.href} className="max-w-[200px] truncate block">
//                         {breadcrumb.label}
//                       </Link>
//                     </BreadcrumbLink>
//                   )}
//                 </BreadcrumbItem>
//               </div>
//             ))}
//           </BreadcrumbList>
//         </Breadcrumb>

//         {/* Indicador de notificações */}
//         <div className="ml-auto flex items-center gap-4">
//           <NotificationIndicator />
//         </div>
//       </header>

//       {/* Conteúdo principal */}
//       <main className="flex-1 overflow-auto p-4 md:p-6">
//         <Suspense 
//           fallback={
//             <div className="flex items-center justify-center h-full">
//               <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-akin-turquoise"></div>
//             </div>
//           }
//         >
//           {children}
//         </Suspense>
//       </main>
//     </SidebarInset>
//   );
// }

// src/App.tsx (ou src/main.tsx)
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'sonner';
import { PrimeReactProvider } from 'primereact/api';
import "primereact/resources/themes/lara-light-cyan/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import './index.css';
import App from './App';


function RootLayout() {
  return (
    <React.StrictMode>
      <PrimeReactProvider value={{
        ripple:true,
        inputStyle: 'filled',
        pt:{}
      }}>
        <BrowserRouter>
          <div className="min-h-screen bg-akin-cosmic-latte text-gray-700 font-sans">
            <App />
          </div>
          <Toaster
            position="top-right"
            richColors={true}
            duration={1000}
            closeButton
            toastOptions={{
              className: 'font-sans',
            }}
          />
        </BrowserRouter>
      </PrimeReactProvider>
    </React.StrictMode>
  );
}

export default RootLayout;