/* eslint-disable @next/next/no-img-element */
import { BsFiletypeXlsx } from "react-icons/bs";
import { useState, useCallback, useEffect, useMemo } from "react";
import { Accept, useDropzone } from "react-dropzone";
import { ControllerRenderProps } from "react-hook-form";

import { FaFileCsv, FaFileImage, FaFilePdf } from "react-icons/fa";
import { File } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type AcceptedFiles =
  | "image/png"
  | "image/jpeg"
  | "image/jpg"
  | "image/gif"
  | "application/pdf"
  | "application/csv"
  | "image/svg+xml"
  | "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

type UploadAreaProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  props?: ControllerRenderProps<any, string>;
  setPropsPreview?: (path: string) => void;
  acceptedTypes?: AcceptedFiles[];
  previewClassName?: string;
  hideText?: boolean;
  onChange?: (file: globalThis.File) => void;
  value?: string;
};
export default function UploadArea({
  props,
  setPropsPreview,
  acceptedTypes,
  previewClassName,
  hideText = false,
  onChange,
}: UploadAreaProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      props?.onChange(file);
      onChange?.(file); // Garante que o arquivo seja passado para o prop onChange
      const fileURL = URL.createObjectURL(file);
      setPreview(fileURL);
      setFile(file);
      setPropsPreview?.(fileURL);
    },
    [props, setPropsPreview, onChange]
  );

  const handleRemoveFile = useCallback(() => {
    setPreview(null);
    setFile(null);
    props?.onChange(null);
    setPropsPreview?.("");
  }, [props, setPropsPreview]);

  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedTypes?.reduce<Accept>(
      (acc, type) => ({ ...acc, [type]: [] }),
      {}
    ),
    multiple: false,
  });

  const showText = useMemo(() => {
    if (hideText === true && preview) return false;
    return true;
  }, [preview, hideText]);

  return (
    <div
      {...getRootProps()}
      className={`border-dashed flex flex-col justify-center items-center border-2 rounded-lg cursor-pointer min-w-[200px] px-4 w-full h-[200px] min-h-max relative ${isDragActive ? "border-ipilOrange" : "border-gray-300"
        }`}
    >
      {isDragActive && (
        <div className="absolute top-0 left-0 h-full w-full bg-[#d96f329f] transition-all rounded-lg"></div>
      )}
      <input {...getInputProps()} />
      {showText && (
        <div className="text-center text-sm">
          {isDragActive ? (
            <p className="text-blue-500">Solte o arquivo aqui...</p>
          ) : (
            <p className="text-ipilOrange">
              Arraste e solte um arquivo ou clique para
              {preview ? " trocar" : " seleccionar"}
            </p>
          )}
        </div>
      )}
      {preview && (
        <div
          className={
            hideText == true
              ? ""
              : " mt-1 " + " flex justify-center relative items-center flex-1 "
          }
        >
          {/* Renderiza o preview de imagens */}
          {file?.type?.startsWith("image/") ? (
            <div
              style={{ backgroundImage: `url('${preview}')` }}
              className={
                " bg-no-repeat flex items-center justify-center bg-contain bg-center h-28 w-28 " +
                previewClassName
              }
            >
              <Dialog>
                <DialogTrigger onClick={(e) => e.stopPropagation()}>
                  <Button
                    type="button"
                    className="opacity-0 hover:opacity-100 transition-all "
                  >
                    Pré-Visualizar
                  </Button>
                </DialogTrigger>

                <DialogContent onClick={(e) => e.stopPropagation()}>
                  <DialogTitle>
                    Pré-visualização do da imagem carregada
                  </DialogTitle>
                  <img
                    src={preview}
                    title="Preview do PDF"
                    className=" w-full h-[500px] rounded-md object-contain object-center "
                    alt=" Preview"
                  />
                </DialogContent>
              </Dialog>
            </div>
          ) : file?.type?.startsWith("application/pdf" as AcceptedFiles) ? (
            <Dialog>
              <DialogTrigger
                onClick={(e) => e.stopPropagation()}
                className="flex flex-col gap-2 items-center"
              >
                <FaFilePdf size={30} />
                <Button
                  role="button"
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                  }}
                  className="z-10 flex gap-2"
                >
                  Visualizar documento
                </Button>
              </DialogTrigger>

              <DialogContent onClick={(e) => e.stopPropagation()}>
                <DialogTitle>
                  Pré-visualização do ficheiro carregado
                </DialogTitle>
                <iframe
                  src={preview}
                  title="Preview do PDF"
                  className="w-full h-[500px] rounded-md"
                />
              </DialogContent>
            </Dialog>
          ) : (
            <p className="text-gray-500 flex justify-center items-center flex-col">
              {icons[file?.type as AcceptedFiles] || <File />}
              Arquivo não suportado para pré-visualização
            </p>
          )}
        </div>
      )}
      {preview && (
        <Button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleRemoveFile();
          }}
          className="mt-2 bg-red-500 text-white rounded-md px-4 py-2"
        >
          Remover
        </Button>
      )}
      {file?.name}
    </div>
  );
}

const icons: Record<AcceptedFiles, React.ReactNode> = {
  "application/pdf": <FaFilePdf size={30} />,
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": (
    <BsFiletypeXlsx size={30} />
  ),
  "application/csv": <FaFileCsv size={30} />,
  "image/jpeg": <FaFileImage size={30} />,
  "image/png": <FaFileImage size={30} />,
  "image/gif": <FaFileImage size={30} />,
  "image/svg+xml": <FaFileImage size={30} />,
  "image/jpg": <FaFileImage size={30} />,
};