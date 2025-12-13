import { ShoppingCart, User, Search } from "lucide-react";

export const Header = () => {
  return (
    <header className="py-5 px-5 w-full">
      <div className="flex gap-5 items-center">
        <div className="p-5 rounded-full animate-pulse"></div>
        {/* <img src="" alt="LOGOTIPO" /> */}
        <div className="relative w-1/3">
          <input
            type="search"
            placeholder="Pesquise Produtos"
            className="font-sans text-center p-2 border  rounded-md outline-none focus-within:border focus-visible:border-[#D4AF37] w-full"
          />
          <button
            title="Pesquisar"
            className="absolute top-1/2 right-3 transform -translate-y-1/2 -translate-x-[25.7rem] text-gray-500"
          >
            <Search />
          </button>
        </div>
        <div className="flex flex-wrap gap-5 text-end m-auto items-center justify-end">
          <div className="text-[#434343]">
            <a href="#">E-commerce</a>
          </div>
          <div className="text-[#434343]">
            <a href="#">Vendas</a>
          </div>
          <div className="text-[#434343]">
            <a href="#">Homens</a>
          </div>
          <div className="text-[#434343]">
            <a href="#">Mulheres</a>{" "}
          </div>
          <div className="text-[#434343] ml-28 flex gap-4 justify-end">
            <button title="Entrar">
              <User />
            </button>
            <button title="Carrinho">
              <ShoppingCart />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
