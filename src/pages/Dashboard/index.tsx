import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ShoppingCart,
  Package,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  Activity,
  UserCheck,
  Calendar,
  ShoppingBag,
  FileText,
  PieChart,
  Star,
  Truck,
  RefreshCw,
} from "lucide-react";
import { View } from "@/components/view";
import SalesChart from "./chart-a";
import CategoryChart from "./chart-b";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AppSidebar } from "@/app/layout/sidebarConfig/app-sidebar";

// Dados fictícios para as estatísticas de E-commerce
const DASHBOARD_STATS = {
  overview: [
    {
      id: 1,
      title: "Vendas do Mês",
      value: "124.7K",
      change: "+12.5%",
      changeType: "increase",
      icon: ShoppingCart,
      description: "Valor total das vendas",
    },
    {
      id: 2,
      title: "Pedidos Pendentes",
      value: 89,
      change: "-5.2%",
      changeType: "decrease",
      icon: Clock,
      description: "Aguardando processamento",
    },
    {
      id: 3,
      title: "Pedidos Concluídos",
      value: 345,
      change: "+18.3%",
      changeType: "increase",
      icon: CheckCircle,
      description: "Entregues este mês",
    },
    {
      id: 4,
      title: "Receita Mensal",
      value: "2.4M AOA",
      change: "+23.1%",
      changeType: "increase",
      icon: DollarSign,
      description: "Faturamento do mês atual",
    },
  ],
  quickStats: [
    { label: "Clientes Novos", value: 124, color: "bg-blue-500" },
    { label: "Taxa de Conversão", value: "3.2%", color: "bg-green-500" },
    { label: "Produtos em Estoque", value: 856, color: "bg-purple-500" },
    { label: "Devoluções", value: 15, color: "bg-orange-500" },
  ],
  recentOrders: [
    {
      id: 1,
      customer: "Ana Silva",
      product: "Smartphone XYZ Pro",
      amount: "245.990 AOA",
      time: "14:30",
      status: "delivered",
    },
    {
      id: 2,
      customer: "João Santos",
      product: "Notebook Ultra Slim",
      amount: "1.245.990 AOA",
      time: "15:00",
      status: "processing",
    },
    {
      id: 3,
      customer: "Maria José",
      product: "Fones Bluetooth",
      amount: "45.990 AOA",
      time: "15:30",
      status: "pending",
    },
    {
      id: 4,
      customer: "Carlos Lima",
      product: "Smartwatch Pro",
      amount: "125.990 AOA",
      time: "16:00",
      status: "delivered",
    },
    {
      id: 5,
      customer: "Paula André",
      product: "Tablet 10''",
      amount: "345.990 AOA",
      time: "16:30",
      status: "shipped",
    },
  ],
  alerts: [
    {
      id: 1,
      type: "warning",
      message: "5 produtos com estoque baixo",
      priority: "medium",
    },
    {
      id: 2,
      type: "info",
      message: "Campanha Black Friday disponível",
      priority: "low",
    },
    {
      id: 3,
      type: "error",
      message: "3 pedidos com atraso na entrega",
      priority: "high",
    },
  ],
  topProducts: [
    { name: "Smartphone XYZ Pro", sales: 245, revenue: "245.990 AOA" },
    { name: "Notebook Ultra Slim", sales: 89, revenue: "1.245.990 AOA" },
    { name: "Fones Bluetooth", sales: 456, revenue: "45.990 AOA" },
    { name: "Smartwatch Pro", sales: 167, revenue: "125.990 AOA" },
    { name: "Tablet 10''", sales: 92, revenue: "345.990 AOA" },
  ],
};

export default function Dashboard() {
  const getStatusBadge = (status: string) => {
    const variants = {
      delivered: "bg-green-100 text-green-800 border-green-200",
      processing: "bg-blue-100 text-blue-800 border-blue-200",
      pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
      shipped: "bg-purple-100 text-purple-800 border-purple-200",
    };
    return variants[status as keyof typeof variants] || variants.pending;
  };

  const getStatusText = (status: string) => {
    const texts = {
      delivered: "Entregue",
      processing: "Processando",
      pending: "Pendente",
      shipped: "Enviado",
    };
    return texts[status as keyof typeof texts] || "Pendente";
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "error":
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      default:
        return <Activity className="h-4 w-4 text-blue-500" />;
    }
  };

  return (
    <>
    <AppSidebar />
    <View.Vertical className="min-h-screen bg-gray-50/10 space-y-6 p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">
            Visão geral das vendas e desempenho da loja
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Calendar className="h-4 w-4 mr-2" />
            Hoje
          </Button>
          <Button variant="outline" size="sm">
            <FileText className="h-4 w-4 mr-2" />
            Exportar
          </Button>
          <Button className="bg-[#D4AF37] hover:bg-[#B8860B]">
            <ShoppingCart className="h-4 w-4 mr-2" />
            Novo Pedido
          </Button>
        </div>
      </div>

      {/* Estatísticas Principais */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {DASHBOARD_STATS.overview.map((stat) => (
          <Card key={stat.id} className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-5 w-5 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-xl md:text-2xl font-bold text-gray-900">
                {stat.value}
              </div>
              <div className="flex items-center space-x-2 mt-2">
                <span
                  className={`inline-flex items-center text-xs font-medium ${
                    stat.changeType === "increase"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {stat.changeType === "increase" ? (
                    <TrendingUp className="h-3 w-3 mr-1" />
                  ) : (
                    <TrendingDown className="h-3 w-3 mr-1" />
                  )}
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
            Métricas Rápidas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {DASHBOARD_STATS.quickStats.map((stat, index) => (
              <div key={index} className="text-center">
                <div
                  className={`w-12 h-12 ${stat.color} rounded-full flex items-center justify-center mx-auto mb-2`}
                >
                  <span className="text-white font-bold text-lg">
                    {stat.value}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Conteúdo em Abas */}
      <Tabs defaultValue="analytics" className="space-y-4 md:space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
          <TabsTrigger value="analytics">Análises</TabsTrigger>
          <TabsTrigger value="activity">Atividade</TabsTrigger>
          <TabsTrigger value="alerts">Alertas</TabsTrigger>
        </TabsList>

        <TabsContent value="analytics" className="space-y-4 md:space-y-6">
          {/* Gráficos */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PieChart className="h-5 w-5 mr-2" />
                  Vendas por Mês
                </CardTitle>
                <CardDescription>
                  Comparativo de vendas vs meta mensal
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SalesChart />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ShoppingBag className="h-5 w-5 mr-2" />
                  Vendas por Categoria
                </CardTitle>
                <CardDescription>
                  Distribuição de vendas por categoria de produtos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CategoryChart />
              </CardContent>
            </Card>
          </div>

          {/* Métricas Adicionais e Top Produtos */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Star className="h-5 w-5 mr-2" />
                  Produtos Mais Vendidos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {DASHBOARD_STATS.topProducts.map((product, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Package className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {product.name}
                          </p>
                          <p className="text-sm text-gray-600">
                            {product.sales} unidades
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">
                          {product.revenue}
                        </p>
                        <Badge variant="outline" className="mt-1">
                          Top {index + 1}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Taxa de Conversão</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">3.2%</div>
                <p className="text-sm text-gray-600">
                  Visitantes que compram
                </p>
                <div className="mt-2 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: "32%" }}
                  ></div>
                </div>
                <Badge variant="secondary" className="mt-4">
                  +0.5% vs semana passada
                </Badge>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4 md:space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ShoppingCart className="h-5 w-5 mr-2" />
                Pedidos Recentes
              </CardTitle>
              <CardDescription>
                Últimos pedidos realizados na loja
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {DASHBOARD_STATS.recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center space-x-3 mb-3 sm:mb-0">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <UserCheck className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {order.customer}
                        </p>
                        <p className="text-sm text-gray-600">{order.product}</p>
                        <p className="text-sm font-medium text-gray-900 mt-1">
                          {order.amount}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end space-x-3">
                      <span className="text-sm text-gray-500">{order.time}</span>
                      <Badge className={getStatusBadge(order.status)}>
                        {getStatusText(order.status)}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4 md:space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  Alertas e Notificações
                </CardTitle>
                <CardDescription>
                  Situações que requerem atenção imediata
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {DASHBOARD_STATS.alerts.map((alert) => (
                    <div
                      key={alert.id}
                      className={`p-4 rounded-lg border-l-4 ${
                        alert.priority === "high"
                          ? "border-red-500 bg-red-50"
                          : alert.priority === "medium"
                          ? "border-yellow-500 bg-yellow-50"
                          : "border-blue-500 bg-blue-50"
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        {getAlertIcon(alert.type)}
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            {alert.message}
                          </p>
                          <p className="text-xs text-gray-600 mt-1">
                            Prioridade:{" "}
                            {alert.priority === "high"
                              ? "Alta"
                              : alert.priority === "medium"
                              ? "Média"
                              : "Baixa"}
                          </p>
                        </div>
                        <Button variant="outline" size="sm">
                          <RefreshCw className="h-3 w-3 mr-1" />
                          Resolver
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Truck className="h-5 w-5 mr-2" />
                  Status de Entregas
                </CardTitle>
                <CardDescription>
                  Monitoramento de entregas em tempo real
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-green-800">Em Trânsito</p>
                        <p className="text-sm text-green-600">15 pedidos</p>
                      </div>
                      <Truck className="h-6 w-6 text-green-500" />
                    </div>
                  </div>
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-yellow-800">Processando</p>
                        <p className="text-sm text-yellow-600">24 pedidos</p>
                      </div>
                      <Package className="h-6 w-6 text-yellow-500" />
                    </div>
                  </div>
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-red-800">Atrasados</p>
                        <p className="text-sm text-red-600">3 pedidos</p>
                      </div>
                      <Clock className="h-6 w-6 text-red-500" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Rodapé do Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Tempo Médio de Entrega
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">2.4 dias</div>
            <p className="text-xs text-gray-600 mt-1">
              -0.5 dias vs mês anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Satisfação do Cliente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">4.8/5</div>
            <p className="text-xs text-gray-600 mt-1">
              Avaliação média dos clientes
            </p>
            <div className="flex mt-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <span key={star} className="text-yellow-400">
                  ★
                </span>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Taxa de Retorno
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">24%</div>
            <p className="text-xs text-gray-600 mt-1">
              Clientes que compram novamente
            </p>
            <div className="mt-2 bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full"
                style={{ width: "24%" }}
              ></div>
            </div>
          </CardContent>
        </Card>
      </div>
    </View.Vertical>
    </>
  );
}