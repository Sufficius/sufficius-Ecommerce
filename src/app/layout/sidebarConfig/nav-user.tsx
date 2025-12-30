import { LogOut, Settings, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/modules/services/store/auth-store";

export function NavUser() {
  const navigate = useNavigate();

  // Função para pegar dados do usuário dos cookies
  const getUserData = () => {
    const userCookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith("user="));

    if (userCookie) {
      try {
        const userData = JSON.parse(
          decodeURIComponent(userCookie.split("=")[1])
        );
        return userData;
      } catch {
        return null;
      }
    }
    return null;
  };

  const userData = getUserData();
  const logout = useAuthStore((state) => state.logout);

  const handleLogout =  async () => {
    await logout();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-8 w-full justify-start gap-2 px-3 text-white hover:bg-white/10 hover:text-white"
        >
          <Avatar className="h-6 w-6">
            {userData?.avatar ? (
              <AvatarImage src={userData.avatar} alt={userData.name} />
            ) : null}
            <AvatarFallback className="bg-white text-akin-turquoise text-xs">
              {userData?.name ? userData.name.charAt(0) : "U"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 text-left">
            <p className="text-sm font-medium">{userData?.name || "Usuário"}</p>
            <p className="text-xs text-white/70">{userData?.role || "Admin"}</p>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        <DropdownMenuItem onClick={() => navigate("/perfil")}>
          <User className="mr-2 h-4 w-4" />
          Perfil
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate("/configuracoes")}>
          <Settings className="mr-2 h-4 w-4" />
          Configurações
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleLogout}
          className="text-red-600 focus:text-red-600"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sair
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
