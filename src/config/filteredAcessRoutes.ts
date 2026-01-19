import { APP_CONFIG } from "@/app/layout/app";


export const filterRoutesByAccess = (userRole: string) => {
  return APP_CONFIG.ROUTES.MENU.filter((route) =>
    route.access?.includes(userRole)
  );
};



export const filterSheduleByAccess = (schedule: string): boolean => {
  // Validação inicial
  return APP_CONFIG.ROUTES.SCHEDULE.some((route) =>
    route.access?.includes(schedule)
  );
};
