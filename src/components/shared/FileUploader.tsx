'use client';

import { useCallback, Dispatch, SetStateAction } from 'react';
import { useDropzone } from '@uploadthing/react/hooks';
import { generateClientDropzoneAccept } from 'uploadthing/client';

import { Button } from '@/components/ui/button';
import { convertFileToUrl } from '@/lib/utils';
import Image from 'next/image';

type FileUploaderProps = {
  onFieldChange: (url: string) => void
  imageUrl: string
  setFiles: Dispatch<SetStateAction<File[]>>
}

export function FileUploader({ imageUrl, onFieldChange, setFiles }: FileUploaderProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(acceptedFiles);
    onFieldChange(convertFileToUrl(acceptedFiles[0]));
  }, [setFiles, onFieldChange]);

  const acceptValue = generateClientDropzoneAccept(['image/*']);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: acceptValue,
  });

  return (
    <div
      {...getRootProps()}
      className="flex-center bg-dark-3 flex h-60 cursor-pointer flex-col overflow-hidden rounded-xl bg-grey-50"
    >
      <input {...getInputProps()} className="cursor-pointer" />

      {imageUrl ? (
        <div className="flex h-full w-full flex-1 justify-center ">
          <Image
            src={imageUrl}
            alt="Image Preview"
            width={250}
            height={250}
            className="w-full object-cover object-center"
          />
        </div>
      ) : (
        <div className="flex-center flex-col py-5 text-grey-500">
          <Image src="/assets/icons/upload.svg" width={77} height={77} alt="File Upload" />
          <h3 className="mb-2 mt-2">Arraste a foto aqui</h3>
          <p className="p-medium-12 mb-4">SVG, PNG, JPG</p>
          <Button type="button" className="rounded-full">
            Selecionar arquivo
          </Button>
        </div>
      )}
    </div>
  );
}
