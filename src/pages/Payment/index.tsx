"use client";

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
import { toast } from "sonner";

interface ItemCarrinho {
  id: number;
  nome: string;
  preco: number;
  quantidade: number;
}

const Pagamento = () => {
  const location = useLocation();
  const items: ItemCarrinho[] = location.state?.items || [];

  const [name, setName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [cvv, setCvv] = useState("");
  const [sameAddress, setSameAddress] = useState(true);
  const [comments, setComments] = useState("");

  if (items.length === 0)
    return (
      <p className="p-10 text-center text-gray-500">
        Nenhum produto selecionado.
      </p>
    );

  const total = items.reduce(
    (acc, item) => acc + item.preco * item.quantidade,
    0
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(
      `Pagamento de ${total.toLocaleString()} KZ confirmado para ${
        items.length
      } produtos!`
    );
  };

  return (
    <div className="min-h-screen p-10 bg-gray-50 flex flex-col items-center gap-6">
      <h1 className="text-3xl font-bold text-gray-800">Efectuar Pagamento</h1>

      <div className="w-full max-w-md bg-white p-4 rounded-lg shadow-sm">
        {items.map((item) => (
          <div key={item.id} className="flex justify-between mb-2">
            <div>
              <p className="font-semibold">{item.nome}</p>
              <p className="text-gray-500">Qtd: {item.quantidade}</p>
            </div>
            <p className="text-[#D4AF37] font-semibold">
              {(item.preco * item.quantidade).toLocaleString()} KZ
            </p>
          </div>
        ))}
        <div className="border-t mt-2 pt-2 flex justify-between font-bold">
          <span>Total:</span>
          <span className="text-[#D4AF37]">{total.toLocaleString()} KZ</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="w-full max-w-md">
        <FieldGroup>
          <FieldSet>
            <FieldLegend>Método de Pagamento</FieldLegend>
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
                  onChange={(e: any) => setName(e.target.value)}
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
                <FieldDescription>
                  Digite seu número de 16 dígitos
                </FieldDescription>
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
                        <SelectItem
                          key={i + 1}
                          value={String(i + 1).padStart(2, "0")}
                        >
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
                    onChange={(e: any) => setCvv(e.target.value)}
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
                  onCheckedChange={(checked: any) =>
                    setSameAddress(Boolean(checked))
                  }
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
                  onChange={(e: any) => setComments(e.target.value)}
                  className="resize-none"
                />
              </Field>
            </FieldGroup>
          </FieldSet>

          <Field orientation="horizontal" className="mt-4">
            <Button type="submit" className="bg-[#D4AF37] hover:bg-[#dfae0e]">
              Confirmar Pagamento
            </Button>
            <Button
              variant="outline"
              type="button"
              onClick={() => window.history.back()}
            >
              Cancelar
            </Button>
          </Field>
        </FieldGroup>
      </form>
    </div>
  );
};

export default Pagamento;
