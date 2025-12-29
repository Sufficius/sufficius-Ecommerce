export const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
      <p className="text-xl text-gray-600 mb-8">Página Não Encontrada</p>
      <a href="/" className="hover:underline">
        Voltar para a Página Inicial
      </a>
    </div>
  );
};
export default NotFound;
