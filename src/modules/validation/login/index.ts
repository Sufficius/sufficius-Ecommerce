import { z } from "zod";
import { noSpaces } from "../noSpace";

export const loginSchema = z.object({
    email: z.string({
        error: "Introduza o seu email!",
    }).email({
        message: "Digite um email válido!"
    })
        .refine(noSpaces, { message: "O email não pode ser vazio ou conter apenas espaços!" })
        .transform((val) => val.trim()),

    password: z.string({
        error: "Introduza a sua senha!",
    })
        .min(8, {
            message: "A senha deve ter no mínimo 8 caracteres! "
        })
        .refine(noSpaces, { message: "A senha não pode ser vazia ou conter apenas espaços!" })
        .transform((val) => val.trim()),
});

export type LoginSchema = z.infer<typeof loginSchema>; 