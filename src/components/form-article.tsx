"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { apiAddArticle, apiUpdateArticle } from "@/lib/api/articles";
import { CreateArticlePayload } from "@/types/articles";
import { useEffect, useMemo, useState } from "react";
import { toast } from "@/hooks/use-toast";
import { CategoryResponse } from "@/types/categories";
import { apiGetCategories } from "@/lib/api/categories";
import { X } from "lucide-react";

// Schema validasi menggunakan Zod
const articleFormSchema = z.object({
  title: z.string().min(1, "Judul harus diisi").max(100),
  description: z.string().min(1, "Deskripsi harus diisi").max(500),
  cover_image_url: z.string().url("URL gambar tidak valid").optional(),
  category: z.string().min(1, "Kategori harus dipilih"),
});

type ArticleFormValues = z.infer<typeof articleFormSchema>;

interface FormArticleProps {
  id?: string;
  initialData?: Partial<ArticleFormValues>;
  onSuccess?: () => void;
}

export function FormArticle({ id, initialData, onSuccess }: FormArticleProps) {
  const isEdit = !!id;
  const defaultValues = useMemo(() => initialData || { title: "", description: "", cover_image_url: "", category: "" }, [initialData]);
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ArticleFormValues>({
    resolver: zodResolver(articleFormSchema),
    defaultValues,
  });

  const handleOpenChange = async (open: boolean) => {
    setOpen(open);

    if (open) {
      try {
        setLoadingCategories(true);
        const response = await apiGetCategories();
        setCategories(response.data);
      } catch (error: Error | any) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoadingCategories(false);
      }
    }
  };

  // Reset form ketika initialData berubah
  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, initialData, reset]);

  const handleClose = () => {
    reset();
    setOpen(false);
  };

  const onSubmit = async (data: ArticleFormValues) => {
    try {
      const payload: CreateArticlePayload = {
        title: data.title,
        description: data.description,
        cover_image_url: data.cover_image_url || "",
        category: parseInt(data.category),
      };

      if (isEdit && id) {
        await apiUpdateArticle(id.toString(), payload);
        toast({
          title: "Artikel berhasil diperbarui",
          description: "Artikel telah diperbarui.",
          variant: "success",
        });
      } else {
        await apiAddArticle(payload);
        toast({
          title: "Artikel berhasil ditambahkan",
          description: "Artikel baru telah dibuat.",
          variant: "success",
        });
      }

      onSuccess?.();
    } catch (error) {
      console.error("Error saving article:", error);
      toast({
        title: "Gagal menyimpan artikel",
        description: "Terjadi kesalahan saat menyimpan data.",
        variant: "error",
      });
    } finally {
      handleClose();
    }
  };

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        <Button variant={isEdit ? "default" : "default"}>{isEdit ? "Edit" : "Tambah Artikel"}</Button>
      </SheetTrigger>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <div className="flex justify-between items-center mb-2">
            <SheetTitle>{isEdit ? "Edit Artikel" : "Tambah Artikel Baru"}</SheetTitle>
            <X onClick={() => handleClose()} className="cursor-pointer" />
          </div>
          <SheetDescription>{isEdit ? "Perbarui detail artikel di bawah ini." : "Isi form berikut untuk menambahkan artikel baru."}</SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Judul Artikel</Label>
            <Input id="title" placeholder="Masukkan judul artikel" {...register("title")} />
            {errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Deskripsi</Label>
            <Input id="description" placeholder="Masukkan deskripsi artikel" {...register("description")} />
            {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="cover_image_url">URL Gambar Cover</Label>
            <Input id="cover_image_url" placeholder="https://example.com/image.jpg" {...register("cover_image_url")} />
            {errors.cover_image_url && <p className="text-sm text-red-500">{errors.cover_image_url.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Kategori</Label>
            <Select onValueChange={(value) => setValue("category", value)} value={watch("category")} disabled={loadingCategories}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Pilih Kategori" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id.toString()}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && <p className="text-sm text-red-500">{errors.category.message}</p>}
          </div>

          <SheetFooter>
            <Button type="submit" disabled={isSubmitting || loadingCategories}>
              {isSubmitting ? "Menyimpan..." : "Simpan"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
