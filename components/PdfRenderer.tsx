"use client";

import React, { useState } from "react";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import SimpleBar from "simplebar-react";
import { useToast } from "./ui/use-toast";
import { useForm } from "react-hook-form";
import PdfFullScreen from "./PdfFullScreen";
import { Document, Page, pdfjs } from "react-pdf";
import { zodResolver } from "@hookform/resolvers/zod";
import { useResizeDetector } from "react-resize-detector";
import {
  ChevronDown,
  ChevronUp,
  Loader2,
  RotateCw,
  Search,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import "react-pdf/dist/esm/Page/TextLayer.css";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

interface Props {
  url: string;
}

const PdfRenderer = ({ url }: Props) => {
  const { toast } = useToast();

  const { width, ref } = useResizeDetector();

  const [scale, setScale] = useState(1);

  const [currPage, setCurrPage] = useState(1);

  const [rotation, setRotation] = useState(0);

  const [numPages, setNumPages] = useState<number>();

  const [renderedScale, setRenderedScale] = useState<number | null>(null);

  const isLoading = renderedScale !== scale;

  const pageSchema = z.object({
    page: z
      .string()
      .refine((num) => Number(num) > 0 && Number(num) <= numPages!),
  });

  type pageData = z.infer<typeof pageSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<pageData>({
    defaultValues: {
      page: "1",
    },
    resolver: zodResolver(pageSchema),
  });

  const onSubmit = ({ page }: pageData) => {
    setCurrPage(Number(page));
  };

  return (
    <div className="bg-white w-full flex flex-col items-center rounded-md shadow">
      <div className="h-14 w-full flex items-center justify-between px-2 border-b border-zinc-200">
        <div className="flex items-center gap-1.5">
          <Button
            variant="ghost"
            aria-label="previous-page"
            onClick={() => {
              setCurrPage((prev) => (prev - 1 > 1 ? prev - 1 : 1));

              setValue("page", `${currPage - 1}`);
            }}
            disabled={currPage === 1}
          >
            <ChevronDown className="h-4 w-4" />
          </Button>

          <div className="flex items-center gap-1.5">
            <Input
              {...register("page")}
              className={cn(
                "w-12 h-8",
                errors.page && "focus-visible:ring-red-500"
              )}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSubmit(onSubmit)();
                }
              }}
            />

            <p className="text-sm text-zinc-700 space-x-1">
              <span>/</span>

              <span>{numPages ?? "x"}</span>
            </p>
          </div>

          <Button
            variant="ghost"
            aria-label="next-page"
            onClick={() => {
              setCurrPage((prev) =>
                prev + 1 > numPages! ? numPages! : prev + 1
              );

              setValue("page", `${currPage + 1}`);
            }}
            disabled={numPages === undefined || currPage === numPages}
          >
            <ChevronUp className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                className="gap-1.5 text-sm"
                aria-label="zoom"
                variant="ghost"
              >
                <Search className="h-4 w-4" />
                {scale * 100}%
                <ChevronDown className="h-3 w-3 opacity-50" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent>
              <DropdownMenuItem onSelect={() => setScale(1)}>
                100%
              </DropdownMenuItem>

              <DropdownMenuItem onSelect={() => setScale(1.5)}>
                150%
              </DropdownMenuItem>

              <DropdownMenuItem onSelect={() => setScale(2)}>
                200%
              </DropdownMenuItem>

              <DropdownMenuItem onSelect={() => setScale(2.5)}>
                250%
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="flex flex-col sm:flex-row">
            <Button
              variant="ghost"
              aria-label="rotate 90 degrees"
              onClick={() => setRotation((prev) => prev + 90)}
            >
              <RotateCw className="h-4 w-4" />
            </Button>

            <PdfFullScreen url={url} />
          </div>
        </div>
      </div>

      <div className="flex-1 w-full max-h-screen">
        <SimpleBar autoHide={false} className="max-h-[calc(100vh-10rem)]">
          <div ref={ref}>
            <Document
              className="max-h-full"
              file={url}
              loading={
                <div className="flex justify-center">
                  <Loader2 className="my-24 h-6 w-6 animate-spin" />
                </div>
              }
              onLoadSuccess={({ numPages }) => setNumPages(numPages)}
              onLoadError={() => {
                toast({
                  title: "Error loading PDF",
                  description: "Please try again later",
                  variant: "destructive",
                });
              }}
            >
              {isLoading && renderedScale ? (
                <Page
                  width={width ? width : 1}
                  pageNumber={currPage}
                  scale={scale}
                  rotate={rotation}
                  key={"@" + renderedScale}
                />
              ) : null}

              <Page
                className={cn(isLoading ? "hidden" : "")}
                pageNumber={currPage}
                scale={scale}
                width={width || 1}
                rotate={rotation}
                key={"@" + scale}
                loading={
                  <div className="flex justify-center">
                    <Loader2 className="my-24 h-6 w-6 animate-spin" />
                  </div>
                }
                onRenderSuccess={() => setRenderedScale(scale)}
              />
            </Document>
          </div>
        </SimpleBar>
      </div>
    </div>
  );
};

export default PdfRenderer;
