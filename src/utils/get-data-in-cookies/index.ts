
import Cookies from "js-cookie";

interface AkinUserData {
  id: string;
  access_token: string;
  refresh_token: string;
  health_unit_ref: string;
  roleId: string;
}

export const getCookieByName = (cookieName: string) => {
  const data = typeof window !== "undefined" ? Cookies.get(cookieName) || "" : "";
  return data;
}

export const getAllDataInCookies = () => {
  const userRole = getCookieByName("akin-role");
  const userdata: AkinUserData = JSON.parse(getCookieByName("akin-userdata") || '{}');

  return {
    userRole,
    userdata
  }
}