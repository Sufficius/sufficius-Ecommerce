import first from "../../assets/img1.jpeg";
import second from "../../assets/img2.jpeg";
import terceira from "../../assets/image3.jpeg";
import quarta from "../../assets/image4.jpeg";
import quinta from "../../assets/image5.jpeg";
import sexta from "../../assets/image6.jpeg";

export const PrimeiraImagem = () => (
  <img
    src={first}
    alt="Primeira Imagem"
    className="max-w-screen-sm  bg-contain max-h-screen rounded-md py-2"
  />
);

export const SegundaImagem = () => (
  <img
    src={second}
    alt="Segunda Imagem"
    className="max-w-screen-sm w-full bg-cover max-h-screen rounded-md py-4"
  />
);

export const TerceiraImagem = () => (
  <img
    src={terceira}
    alt="Terceira Imagem"
    className="max-w-screen-sm w-full bg-cover max-h-screen rounded-md py-4"
  />
);

export const QuartaImagem = () => (
  <img
    src={quarta}
    alt="Quarta Imagem"
    className="max-w-screen-sm w-full bg-cover max-h-screen rounded-md py-4"
  />
);

export const QuintaImagem = () => (
  <img
    src={quinta}
    alt="Quinta Imagem"
    className="max-w-screen-sm w-full bg-cover max-h-screen rounded-md py-4"
  />
);

export const SextaImagem = () => (
  <img
    src={sexta}
    alt="Sexta Imagem"
    className="max-w-screen-sm w-full bg-cover max-h-screen rounded-md py-4"
  />
);

export default function Images() {
  return (
    <>
      <PrimeiraImagem />
    </>
  );
}
