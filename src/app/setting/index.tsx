import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { View } from "@/components/view";
// import { AppLayout } from "../layout";
import { Button } from "@/components/button";
import { Switch } from "@/components/ui/switch";

interface ISetting {}

export default function Setting({}: ISetting) {
  return (
    <View.Vertical>
      {/* Header */}
      {/* <AppLayout.ContainerHeader label="Configurações" /> */}

      <div className="p-6 space-y-6">
        {/* Seção 1: Configurações Gerais */}
        <section className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-800">Configurações Gerais</h2>
          <p className="text-sm text-gray-500 mb-4">Ajuste as preferências básicas da aplicação.</p>
          <div className="flex items-center justify-between py-2">
            <Label>Notificações</Label>
            <Switch />
          </div>
          <div className="flex items-center justify-between py-2">
            <Label>Modo Escuro</Label>
            <Switch />
          </div>
        </section>

        {/* Seção 2: Segurança */}
        <section className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-800">Segurança</h2>
          <p className="text-sm text-gray-500 mb-4">Gerencie as configurações de segurança da sua conta.</p>
          <div className="space-y-4">
            <div>
              <Label>Atualizar Senha</Label>
              <Input
                type="password"
                placeholder="Digite sua nova senha"
                className="mt-1"
              />
            </div>
            <Button.Primary className="w-full">Salvar Alterações</Button.Primary>
          </div>
        </section>

        {/* Seção 3: Autenticação em 2 Fatores */}
        <section className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-800">Autenticação em 2 Fatores</h2>
          <p className="text-sm text-gray-500 mb-4">
            Ative a autenticação em dois fatores para maior segurança.
          </p>
          <div className="flex flex-col items-center space-y-4">
            {/* Componente OTP */}
            <Button.Primary>Ativar 2FA</Button.Primary>
          </div>
        </section>
      </div>
    </View.Vertical>
  );
}
