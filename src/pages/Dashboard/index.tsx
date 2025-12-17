"use client"

import { useState } from "react";
import { View } from "@/components/view";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarDays, Users, FlaskConical, TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Clock, DollarSign, Activity, UserCheck, Calendar, Stethoscope, FileText, PieChart } from "lucide-react";
import VerticalBarChart from "./chart-a";
import DoughnutChart from "./chart-b";

// Dados fictícios para as estatísticas
const DASHBOARD_STATS = {
  overview: [
    {
      id: 1,
      title: "Total de Pacientes",
      value: 1247,
      change: "+12.5%",
      changeType: "increase",
      icon: Users,
      description: "Pacientes registrados no sistema"
    },
    {
      id: 2,
      title: "Exames Pendentes",
      value: 89,
      change: "-5.2%",
      changeType: "decrease",
      icon: Clock,
      description: "Aguardando processamento"
    },
    {
      id: 3,
      title: "Exames Concluídos",
      value: 345,
      change: "+18.3%",
      changeType: "increase",
      icon: CheckCircle,
      description: "Finalizados este mês"
    },
    {
      id: 4,
      title: "Receita Mensal",
      value: "2.4M AOA",
      change: "+23.1%",
      changeType: "increase",
      icon: DollarSign,
      description: "Faturamento do mês atual"
    }
  ],
  quickStats: [
    { label: "Agendamentos Hoje", value: 24, color: "bg-blue-500" },
    { label: "Técnicos Ativos", value: 12, color: "bg-green-500" },
    { label: "Laboratórios", value: 8, color: "bg-purple-500" },
    { label: "Equipamentos", value: 15, color: "bg-orange-500" }
  ],
  recentExams: [
    { id: 1, patient: "Ana Silva", exam: "COVID-19", status: "Concluído", time: "14:30", type: "complete" },
    { id: 2, patient: "João Santos", exam: "Hemograma", status: "Em Andamento", time: "15:00", type: "progress" },
    { id: 3, patient: "Maria José", exam: "HIV", status: "Pendente", time: "15:30", type: "pending" },
    { id: 4, patient: "Carlos Lima", exam: "Malária", status: "Concluído", time: "16:00", type: "complete" },
    { id: 5, patient: "Paula André", exam: "Urina", status: "Em Andamento", time: "16:30", type: "progress" }
  ],
  alerts: [
    { id: 1, type: "warning", message: "5 exames aguardam há mais de 2 horas", priority: "medium" },
    { id: 2, type: "info", message: "Novo equipamento disponível - Lab 3", priority: "low" },
    { id: 3, type: "error", message: "Material insuficiente para exames de sangue", priority: "high" }
  ]
};

export default function Dashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState("month");

  const getStatusBadge = (status: string, type: string) => {
    const variants = {
      complete: "bg-green-100 text-green-800 border-green-200",
      progress: "bg-blue-100 text-blue-800 border-blue-200",
      pending: "bg-yellow-100 text-yellow-800 border-yellow-200"
    };
    return variants[type as keyof typeof variants] || variants.pending;
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "error": return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case "warning": return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      default: return <Activity className="h-4 w-4 text-blue-500" />;
    }
  };

  return (
    <View.Vertical className="min-h-screen bg-gray-50/10 space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Visão geral das atividades do laboratório</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Calendar className="h-4 w-4 mr-2" />
            Hoje
          </Button>
          <Button variant="outline" size="sm">
            <FileText className="h-4 w-4 mr-2" />
            Relatório
          </Button>
        </div>
      </div>

      {/* Estatísticas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {DASHBOARD_STATS.overview.map((stat) => (
          <Card key={stat.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-5 w-5 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <div className="flex items-center space-x-2 mt-2">
                <span className={`inline-flex items-center text-xs font-medium ${stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                  }`}>
                  {stat.changeType === 'increase' ?
                    <TrendingUp className="h-3 w-3 mr-1" /> :
                    <TrendingDown className="h-3 w-3 mr-1" />
                  }
                  {stat.change}
                </span>
                <span className="text-xs text-gray-500">vs mês anterior</span>
              </div>
              <p className="text-xs text-gray-600 mt-1">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Estatísticas Rápidas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Activity className="h-5 w-5 mr-2" />
            Estatísticas Rápidas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {DASHBOARD_STATS.quickStats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className={`w-12 h-12 ${stat.color} rounded-full flex items-center justify-center mx-auto mb-2`}>
                  <span className="text-white font-bold text-lg">{stat.value}</span>
                </div>
                <p className="text-sm text-gray-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Conteúdo em Abas */}
      <Tabs defaultValue="analytics" className="space-y-6">
        <TabsList className="grid w-full lg:w-[400px] grid-cols-3">
          <TabsTrigger value="analytics">Análises</TabsTrigger>
          <TabsTrigger value="activity">Atividade</TabsTrigger>
          <TabsTrigger value="alerts">Alertas</TabsTrigger>
        </TabsList>

        <TabsContent value="analytics" className="space-y-6">
          {/* Gráficos */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PieChart className="h-5 w-5 mr-2" />
                  Exames por Mês
                </CardTitle>
                <CardDescription>
                  Comparativo de pedidos vs exames concluídos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <VerticalBarChart />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FlaskConical className="h-5 w-5 mr-2" />
                  Distribuição por Tipo
                </CardTitle>
                <CardDescription>
                  Tipos de exames mais solicitados
                </CardDescription>
              </CardHeader>
              <CardContent>
                <DoughnutChart />
              </CardContent>
            </Card>
          </div>

          {/* Métricas Adicionais */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Taxa de Conclusão</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">94.2%</div>
                <p className="text-sm text-gray-600">Exames finalizados no prazo</p>
                <div className="mt-2 bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '94.2%' }}></div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Tempo Médio</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">2.4h</div>
                <p className="text-sm text-gray-600">Para conclusão de exames</p>
                <Badge variant="secondary" className="mt-2">-15 min vs ontem</Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Satisfação</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-600">4.8/5</div>
                <p className="text-sm text-gray-600">Avaliação dos pacientes</p>
                <div className="flex mt-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span key={star} className="text-yellow-400">★</span>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Stethoscope className="h-5 w-5 mr-2" />
                Exames Recentes
              </CardTitle>
              <CardDescription>
                Últimas atividades do laboratório
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {DASHBOARD_STATS.recentExams.map((exam) => (
                  <div key={exam.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <UserCheck className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{exam.patient}</p>
                        <p className="text-sm text-gray-600">{exam.exam}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-sm text-gray-500">{exam.time}</span>
                      <Badge className={getStatusBadge(exam.status, exam.type)}>
                        {exam.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2" />
                Alertas e Notificações
              </CardTitle>
              <CardDescription>
                Monitoramento de situações que requerem atenção
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {DASHBOARD_STATS.alerts.map((alert) => (
                  <div key={alert.id} className={`p-4 rounded-lg border-l-4 ${alert.priority === 'high' ? 'border-red-500 bg-red-50' :
                      alert.priority === 'medium' ? 'border-yellow-500 bg-yellow-50' :
                        'border-blue-500 bg-blue-50'
                    }`}>
                    <div className="flex items-center space-x-3">
                      {getAlertIcon(alert.type)}
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{alert.message}</p>
                        <p className="text-xs text-gray-600 mt-1">
                          Prioridade: {alert.priority === 'high' ? 'Alta' : alert.priority === 'medium' ? 'Média' : 'Baixa'}
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        Resolver
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </View.Vertical>
  );
}
