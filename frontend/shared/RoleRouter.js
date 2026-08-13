import { AppConfig, AppRole } from '../config/AppConfig';

export function getDashboardRoute(role) {
  switch (role) {
    case "admin":
      return AppConfig.dashboardRoutes[AppRole.ADMIN];
    case "teacher":
      return AppConfig.dashboardRoutes[AppRole.TEACHER];
    case "student":
      return AppConfig.dashboardRoutes[AppRole.STUDENT];
    default:
      return "Login";
  }
}
