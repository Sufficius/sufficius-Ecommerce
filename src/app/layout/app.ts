import sufficiusLogo from "@/assets/images/sufficius-logo.png";
import sufficiusLogoWhite from "@/assets/images/sufficius-logo-white.png";
import {
  CalendarCheck,
  LayoutDashboard,
  UserRound,
  MessageSquareMore,
  LogOut,
  Settings,
  SquareActivity,
  UsersRound,
  CalendarPlus2,
  CalendarSearch,
  CalendarCheck2,
  UserRoundCog,
  Package,
  FileText,
  Bell,
  History,
  Play
} from "lucide-react";

export const APP_CONFIG = {
  COMPANY_NAME: "Sufficius",
  APP_NAME: "SUFFICIUS",
  VERSION: "1.0",
  LOGO: sufficiusLogo,
  LOGO_WHITE: sufficiusLogoWhite,
  ROUTES: {
    MENU: [
      {
        label: "Painel Geral",
        icon: LayoutDashboard,
        path: "/",
        access: ["ADMIN"]
      },
      {
        label: "Agendamentos",
        icon: CalendarCheck,
        path: "",
        access: ["ADMIN"],
        subItems: [
          // { label: "Painel", icon: LayoutDashboard, path: "/akin/schedule/dashboard", access: ["ADMIN", "CHEFE", "TECNICO"] },
          { label: "Novo", icon: CalendarPlus2, path: "/akin/schedule/new", access: ["ADMIN"] },
          { label: "Solicitações", icon: CalendarSearch, path: "/akin/schedule/request", access: ["ADMIN"] },
          { label: "Gestão de Agendamentos", icon: CalendarCheck2, path: "/akin/schedule/completed", access: ["CHEFE", "ADMIN"] }
        ]
      },
      {
        label: "Agendamentos",
        icon: CalendarCheck,
        path: "/akin/schedule/dashboard",
        access: ["CHEFE"],
        subItems: [
          { label: "Painel", icon: LayoutDashboard, path: "/akin/schedule/dashboard", access: ["ADMIN", "CHEFE", "TECNICO"] },
          { label: "Novo", icon: CalendarPlus2, path: "/akin/schedule/new", access: ["ADMIN"] },
          { label: "Solicitações", icon: CalendarSearch, path: "/akin/schedule/request", access: ["ADMIN"] },
          { label: "Gestão de Agendamentos", icon: CalendarCheck2, path: "/akin/schedule/completed", access: ["CHEFE", "ADMIN"] }
        ]
      },
      {
        label: "Pacientes",
        icon: UsersRound,
        path: "/akin/patient/dashboard",
        access: ["ADMIN", "CHEFE", "TECNICO"],
        subItems: [
          { label: "Painel", icon: LayoutDashboard, path: "/akin/patient/dashboard", access: ["CHEFE", "TECNICO"] },
          { label: "Lista de Pacientes", icon: UsersRound, path: "/akin/patient/list", access: ["ADMIN", "CHEFE", "TECNICO"] },
        ]
      },
      {
        label: "Exames Laboratoriais",
        icon: SquareActivity,
        path: "/akin/lab-exams",
        access: ["CHEFE", "TECNICO"],
        subItems: [
          { label: "Painel", icon: LayoutDashboard, path: "/akin/lab-exams", access: ["ADMIN", "CHEFE", "TECNICO"] },
          { label: "Exames Pendentes", icon: SquareActivity, path: "/akin/lab-exams/pending-exams", access: ["ADMIN", "CHEFE", "TECNICO"] },
          { label: "Exame a Realizar", icon: Play, path: "/akin/lab-exams/ready-exam", access: ["CHEFE", "TECNICO"] },
          { label: "Historico de Exames", icon: History, path: "/akin/lab-exams/exams-history", access: ["ADMIN", "CHEFE", "TECNICO"] },
        ]
      },
      {
        label: "Gestão de Laudo",
        icon: FileText,
        path: "/akin/report",
        access: ["CHEFE", "TECNICO"]
      },
      {
        label: "Gestão Equipe",
        icon: UserRoundCog,
        path: "/akin/team-management/dashboard",
        access: ["CHEFE"],
        subItems: [
          { label: "Painel", icon: LayoutDashboard, path: "/akin/team-management/dashboard", access: ["CHEFE"] },
          { label: "Lista de Equipe", icon: UsersRound, path: "/akin/team-management/list", access: ["CHEFE"] },
        ]
      },
      {
        label: "Gestão de stock",
        icon: Package,
        path: "/akin/stock/",
        access: ["CHEFE", "TECNICO"],

      },
      // {
      //   label: "Pagamentos",
      //   icon: CreditCard,
      //   path: "/akin/payment",
      //   access: ["ADMIN"]
      // },
      {
        label: "Mensagens",
        icon: MessageSquareMore,
        path: "/akin/message",
        access: ["TECNICO", "CHEFE"]
      },
      {
        label: "Notificações",
        icon: Bell,
        path: "/akin/notifications",
        access: ["TECNICO", "CHEFE"]
      },
      {
        label: "Definições",
        icon: Settings,
        path: "/akin/setting",
        access: ["CHEFE"]
      },
      {
        label: "Perfil",
        icon: UserRound,
        path: "/akin/profile",
        access: ["CHEFE", "TECNICO"]
      },
      {
        label: "Sair",
        icon: LogOut,
        path: "/logout",
        access: ["ADMIN", "CHEFE", "TECNICO"]
      },
    ],

    SCHEDULE: [
      {
        label: "Novo",
        icon: CalendarPlus2,
        path: "/akin/schedule/new",
        access: ["ADMIN"],
        subItems: [
          { label: "Novo", path: "/akin/schedule/new", access: ["ADMIN"] },
          { label: "Solicitações", path: "/akin/schedule/request", access: ["ADMIN"] },
          { label: "Concluídos", path: "/akin/schedule/completed", access: ["ADMIN", "CHEFE"] }
        ]
      },
      {
        label: "Solicitações",
        icon: CalendarSearch,
        path: "/akin/schedule/request",
        access: ["ADMIN"]
      },
      {
        label: "Concluídos",
        icon: CalendarCheck2,
        path: "/akin/schedule/completed",
        access: ["ADMIN", "CHEFE"]
      },
    ],
    PATIENT: {
      INDIVIDUAL_PATIENT_LINK(id: string) {
        return `/akin/patient/${id}`;
      },
    },
    ALTERNATIVE: {
      PROFILE: {
        label: "Perfil",
        icon: null,
        path: "/akin/...",
        access: ["ADMIN", "CHEFE", "TECNICO"]
      },
    },
  },
};

export const SERVER_ENVIRONMENT = typeof window === "undefined";
