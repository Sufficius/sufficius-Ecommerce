import { useLocation } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const Pagamento = () => {
  const location = useLocation();
  const { produto, quantidade } = location.state || {};
  const [name, setName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [cvv, setCvv] = useState("");
  const [sameAddress, setSameAddress] = useState(true);
  const [comments, setComments] = useState("");

  if (!produto)
    return <p className="p-10 text-center text-gray-500">Nenhum produto selecionado.</p>;

  const total = produto.preco * quantidade;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Pagamento de ${total.toLocaleString()} KZ confirmado para ${produto.nome}!`);
  };

  return (
    <div className="min-h-screen p-10 bg-gray-50 flex flex-col items-center gap-6">
      <h1 className="text-3xl font-bold text-gray-800">Pagamento</h1>

      <p className="text-gray-600">
        Produto: <span className="font-semibold">{produto.nome}</span>
      </p>
      <p className="text-gray-600">
        Quantidade: <span className="font-semibold">{quantidade}</span>
      </p>
      <p className="text-[#D4AF37] font-semibold text-lg">
        Total: {total.toLocaleString()} KZ
      </p>

      <form onSubmit={handleSubmit} className="w-full max-w-md">
        <FieldGroup>
          <FieldSet>
            <FieldLegend>Payment Method</FieldLegend>
            <FieldDescription>
              Todas as transações são seguras e criptografadas
            </FieldDescription>

            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="card-name">Nome no Cartão</FieldLabel>
                <Input
                  id="card-name"
                  placeholder="Seu Nome"
                  value={name}
                  onChange={(e:any) => setName(e.target.value)}
                  required
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="card-number">Número do Cartão</FieldLabel>
                <Input
                  id="card-number"
                  placeholder="1234 5678 9012 3456"
                  value={cardNumber}
                  onChange={(e: any) => setCardNumber(e.target.value)}
                  required
                />
                <FieldDescription>Digite seu número de 16 dígitos</FieldDescription>
              </Field>

              <div className="grid grid-cols-3 gap-4">
                <Field>
                  <FieldLabel htmlFor="exp-month">Mês</FieldLabel>
                  <Select value={month} onValueChange={setMonth}>
                    <SelectTrigger id="exp-month">
                      <SelectValue placeholder="MM" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 12 }, (_, i) => (
                        <SelectItem key={i + 1} value={String(i + 1).padStart(2, "0")}>
                          {String(i + 1).padStart(2, "0")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>

                <Field>
                  <FieldLabel htmlFor="exp-year">Ano</FieldLabel>
                  <Select value={year} onValueChange={setYear}>
                    <SelectTrigger id="exp-year">
                      <SelectValue placeholder="YYYY" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 6 }, (_, i) => (
                        <SelectItem key={i} value={String(2024 + i)}>
                          {2024 + i}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>

                <Field>
                  <FieldLabel htmlFor="cvv">CVV</FieldLabel>
                  <Input
                    id="cvv"
                    placeholder="123"
                    value={cvv}
                    onChange={(e:any) => setCvv(e.target.value)}
                    required
                  />
                </Field>
              </div>
            </FieldGroup>
          </FieldSet>

          <FieldSeparator />

          <FieldSet>
            <FieldLegend>Endereço de Cobrança</FieldLegend>
            <FieldDescription>
              O endereço de cobrança associado ao seu método de pagamento
            </FieldDescription>
            <FieldGroup>
              <Field orientation="horizontal">
                <Checkbox
                  id="same-as-shipping"
                  checked={sameAddress}
                  onCheckedChange={(checked: any) => setSameAddress(Boolean(checked))}
                />
                <FieldLabel htmlFor="same-as-shipping" className="font-normal">
                  Mesmo endereço de envio
                </FieldLabel>
              </Field>
            </FieldGroup>
          </FieldSet>

          <FieldSet>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="comments">Comentários</FieldLabel>
                <Textarea
                  id="comments"
                  placeholder="Comentários adicionais"
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  className="resize-none"
                />
              </Field>
            </FieldGroup>
          </FieldSet>

          <Field orientation="horizontal" className="mt-4">
            <Button type="submit" className="bg-[#D4AF37] hover:bg-[#dfae0e]">
              Confirmar Pagamento
            </Button>
            <Button variant="outline" type="button" onClick={() => window.history.back()}>
              Cancelar
            </Button>
          </Field>
        </FieldGroup>
      </form>
    </div>
  );
};

export default Pagamento;
