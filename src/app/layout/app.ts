import sufficiusLogo from "../../../public/logo.jpg";
import sufficiusLogoWhite from "../../../public/logo.jpg";
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
        path: "/dashboard",
        access: [""]
      },
      {
        label: "Agendamentos",
        icon: CalendarCheck,
        path: "",
        access: [""],
        subItems: [
          // { label: "Painel", icon: LayoutDashboard, path: "/akin/schedule/dashboard", access: ["", "CHEFE", "TECNICO"] },
          { label: "Novo", icon: CalendarPlus2, path: "/akin/schedule/new", access: [""] },
          { label: "Solicitações", icon: CalendarSearch, path: "/akin/schedule/request", access: [""] },
          { label: "Gestão de Agendamentos", icon: CalendarCheck2, path: "/akin/schedule/completed", access: ["CHEFE", ""] }
        ]
      },
      {
        label: "Agendamentos",
        icon: CalendarCheck,
        path: "/dashboard",
        access: ["CHEFE"],
        subItems: [
          { label: "Painel", icon: LayoutDashboard, path: "/akin/schedule/dashboard", access: ["", "CHEFE", "TECNICO"] },
          { label: "Novo", icon: CalendarPlus2, path: "/akin/schedule/new", access: [""] },
          { label: "Solicitações", icon: CalendarSearch, path: "/akin/schedule/request", access: [""] },
          { label: "Gestão de Agendamentos", icon: CalendarCheck2, path: "/akin/schedule/completed", access: ["CHEFE", ""] }
        ]
      },
      {
        label: "Pacientes",
        icon: UsersRound,
        path: "/akin/patient/dashboard",
        access: ["", "CHEFE", "TECNICO"],
        subItems: [
          { label: "Painel", icon: LayoutDashboard, path: "/akin/patient/dashboard", access: ["CHEFE", "TECNICO"] },
          { label: "Lista de Pacientes", icon: UsersRound, path: "/akin/patient/list", access: ["", "CHEFE", "TECNICO"] },
        ]
      },
      {
        label: "Exames Laboratoriais",
        icon: SquareActivity,
        path: "/akin/lab-exams",
        access: ["CHEFE", "TECNICO"],
        subItems: [
          { label: "Painel", icon: LayoutDashboard, path: "/akin/lab-exams", access: ["", "CHEFE", "TECNICO"] },
          { label: "Exames Pendentes", icon: SquareActivity, path: "/akin/lab-exams/pending-exams", access: ["", "CHEFE", "TECNICO"] },
          { label: "Exame a Realizar", icon: Play, path: "/akin/lab-exams/ready-exam", access: ["CHEFE", "TECNICO"] },
          { label: "Historico de Exames", icon: History, path: "/akin/lab-exams/exams-history", access: ["", "CHEFE", "TECNICO"] },
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
        access: ["", "CHEFE", "TECNICO"]
      },
    ],

    SCHEDULE: [
      {
        label: "Novo",
        icon: CalendarPlus2,
        path: "/akin/schedule/new",
        access: [""],
        subItems: [
          { label: "Novo", path: "/akin/schedule/new", access: [""] },
          { label: "Solicitações", path: "/akin/schedule/request", access: [""] },
          { label: "Concluídos", path: "/akin/schedule/completed", access: ["", "CHEFE"] }
        ]
      },
      {
        label: "Solicitações",
        icon: CalendarSearch,
        path: "/akin/schedule/request",
        access: [""]
      },
      {
        label: "Concluídos",
        icon: CalendarCheck2,
        path: "/akin/schedule/completed",
        access: ["", "CHEFE"]
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
        access: ["", "CHEFE", "TECNICO"]
      },
    },
  },
};

export const SERVER_ENVIRONMENT = typeof window === "undefined";
