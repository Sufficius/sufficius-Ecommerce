// app/api/upload/route.ts
import { randomUUID } from 'crypto';
import { writeFile } from 'fs/promises';
import path from 'path';

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get('image') as File;

        if (!file) {
            return Response.json(
                { success: false, message: 'Nenhum arquivo enviado' },
                { status: 400 }
            );
        }

        // Validar tipo do arquivo
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
        if (!validTypes.includes(file.type)) {
            return Response.json(
                { success: false, message: 'Tipo de arquivo não suportado' },
                { status: 400 }
            );
        }

        // Validar tamanho (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
            return Response.json(
                { success: false, message: 'Arquivo muito grande (max 10MB)' },
                { status: 400 }
            );
        }

        // Criar nome único
        const extension = file.name.split('.').pop();
        const filename = `${randomUUID()}.${extension}`;
        const uploadsDir = path.join(process.cwd(), 'public', 'uploads');

        // Garantir que o diretório existe
        const fs = await import('fs/promises');
        await fs.mkdir(uploadsDir, { recursive: true });

        // Converter para buffer e salvar
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const filepath = path.join(uploadsDir, filename);
        await writeFile(filepath, buffer);

        // Retornar o caminho relativo
        return Response.json({
            success: true,
            filename: `/uploads/${filename}`,
            url: `/uploads/${filename}`
        });

    } catch (error) {
        console.error('Erro no upload:', error);
        return Response.json(
            { success: false, message: 'Erro interno no servidor' },
            { status: 500 }
        );
    }
}