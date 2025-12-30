export default function RecentOrders() {
  const orders = [
    { id: '#ORD-001', customer: 'João Silva', amount: 8999, status: 'Entregue', date: '15 Nov 2024' },
    { id: '#ORD-002', customer: 'Maria Santos', amount: 3299, status: 'Processando', date: '14 Nov 2024' },
    { id: '#ORD-003', customer: 'Pedro Costa', amount: 1999, status: 'Pendente', date: '14 Nov 2024' },
    { id: '#ORD-004', customer: 'Ana Oliveira', amount: 7599, status: 'Entregue', date: '13 Nov 2024' },
  ];

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="text-left text-gray-500 text-sm">
            <th className="pb-3">Pedido</th>
            <th className="pb-3">Cliente</th>
            <th className="pb-3">Valor</th>
            <th className="pb-3">Status</th>
            <th className="pb-3">Data</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} className="border-t hover:bg-gray-50">
              <td className="py-3 font-medium">{order.id}</td>
              <td className="py-3">{order.customer}</td>
              <td className="py-3 font-medium">KZ {order.amount.toLocaleString()}</td>
              <td className="py-3">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  order.status === 'Entregue' 
                    ? 'bg-green-100 text-green-800'
                    : order.status === 'Processando'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {order.status}
                </span>
              </td>
              <td className="py-3 text-gray-600">{order.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}