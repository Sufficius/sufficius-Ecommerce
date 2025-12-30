import { ShoppingCart, Package, DollarSign, Users, TrendingUp, Bell } from 'lucide-react';
import SalesChart from './chart-a';
import RecentOrders from './recent-orders';


export default function Dashboard() {
  // Dados de exemplo
  const stats = [
    { 
      title: 'Vendas Hoje', 
      value: 'KZ 4,892', 
      change: '+12.5%', 
      icon: <DollarSign className="h-6 w-6" />,
      color: 'bg-green-500'
    },
    { 
      title: 'Pedidos', 
      value: '342', 
      change: '+8.2%', 
      icon: <ShoppingCart className="h-6 w-6" />,
      color: 'bg-blue-500'
    },
    { 
      title: 'Produtos em Estoque', 
      value: '1,254', 
      change: '-3.1%', 
      icon: <Package className="h-6 w-6" />,
      color: 'bg-purple-500'
    },
    { 
      title: 'Novos Clientes', 
      value: '89', 
      change: '+5.7%', 
      icon: <Users className="h-6 w-6" />,
      color: 'bg-orange-500'
    }
  ];

  const topProducts = [
    { id: 1, name: 'iPhone 15 Pro', price: 8999, sales: 234, image: '/products/iphone.jpg' },
    { id: 2, name: 'Notebook Dell XPS', price: 7599, sales: 189, image: '/products/dell.jpg' },
    { id: 3, name: 'AirPods Pro', price: 1999, sales: 456, image: '/products/airpods.jpg' },
    { id: 4, name: 'Monitor Samsung 4K', price: 3299, sales: 123, image: '/products/monitor.jpg' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600">Bem-vindo de volta, Admin!</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-600 hover:text-gray-900">
                <Bell className="h-6 w-6" />
                <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
              </button>
              
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center">
                  <span className="text-indigo-600 font-semibold">A</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Administrador</p>
                  <p className="text-sm text-gray-600">admin@sufficius.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div 
              key={index}
              className="bg-white rounded-xl shadow p-6 border-l-4 border-blue-500"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.color} bg-opacity-10`}>
                  {stat.icon}
                </div>
              </div>
              <div className="flex items-center mt-4">
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-sm text-green-500 font-medium">{stat.change}</span>
                <span className="text-sm text-gray-500 ml-2">vs. ontem</span>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Gráfico de Vendas */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Desempenho de Vendas</h2>
              <select className="border rounded-lg px-3 py-1 text-sm">
                <option>Últimos 7 dias</option>
                <option>Últimos 30 dias</option>
                <option>Últimos 3 meses</option>
              </select>
            </div>
            <SalesChart />
          </div>

          {/* Produtos Mais Vendidos */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Produtos Populares</h2>
            <div className="space-y-4">
              {topProducts.map((product) => (
                <div key={product.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="h-12 w-12 bg-gray-200 rounded-lg flex items-center justify-center">
                      <Package className="h-6 w-6 text-gray-500" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{product.name}</p>
                      <p className="text-sm text-gray-600">{product.sales} vendas</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">KZ {product.price.toLocaleString()}</p>
                    <p className="text-sm text-green-500">+{Math.floor(Math.random() * 20) + 5}%</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Seção Inferior */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {/* Pedidos Recentes */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Pedidos Recentes</h2>
            <RecentOrders />
          </div>

          {/* Anúncios */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl shadow p-6 text-white">
            <h2 className="text-lg font-semibold mb-4">Promoção Especial</h2>
            <p className="mb-4">Black Friday Sufficius Commerce</p>
            <div className="text-3xl font-bold mb-2">ATÉ 60% OFF</div>
            <p className="text-blue-100 mb-6">Em toda a linha de eletrônicos</p>
            <button className="w-full bg-white text-blue-600 font-semibold py-3 rounded-lg hover:bg-gray-100 transition">
              Ver Ofertas
            </button>
            
            <div className="mt-8 pt-6 border-t border-blue-500">
              <h3 className="font-semibold mb-3">Metas do Mês</h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Meta de Vendas</span>
                    <span>85%</span>
                  </div>
                  <div className="h-2 bg-blue-500 rounded-full">
                    <div className="h-full bg-white rounded-full w-4/5"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Satisfação do Cliente</span>
                    <span>94%</span>
                  </div>
                  <div className="h-2 bg-blue-500 rounded-full">
                    <div className="h-full bg-white rounded-full w-[94%]"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}