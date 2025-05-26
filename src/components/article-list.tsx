"use client";

import { useEffect, useState } from "react";
import { apiDeleteArticle, apiGetArticles } from "@/lib/api/articles";
import { Article, Pagination as ResponsePagination } from "@/types/articles";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Card, CardContent, CardHeader } from "./ui/card";
import { FormArticle } from "./form-article";
import Image from "next/image";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArticlePagination } from "./pagination";
import debounce from "lodash.debounce";
import { ArticleListSkeleton } from "./article-skeleton";

const ArticleList = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<ResponsePagination | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [articleToDelete, setArticleToDelete] = useState<Article | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  const fetchArticles = async (page: number, query: string = "") => {
    try {
      setLoading(true);
      const response = await apiGetArticles({
        page,
        pageSize: 10,
        titleEq: query || undefined,
      });
      setArticles(response.data);
      setPagination(response.meta?.pagination || null);
      setError(null);
    } catch (error) {
      console.error("Error fetching articles:", error);
      setError("An error occurred while fetching articles");
    } finally {
      setLoading(false);
    }
  };

  const debouncedSearch = debounce((query: string) => {
    setCurrentPage(1);
    fetchArticles(1, query);
  }, 400);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    debouncedSearch(query);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || (pagination && newPage > pagination.pageCount)) return;
    setCurrentPage(newPage);
    fetchArticles(newPage, searchQuery);
  };

  const handleDeleteClick = (article: Article) => {
    setArticleToDelete(article);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!articleToDelete) return;

    try {
      setLoading(true);
      await apiDeleteArticle(articleToDelete.documentId);
      await fetchArticles(currentPage, searchQuery);
      setDeleteDialogOpen(false);
      setArticleToDelete(null);
    } catch (error) {
      console.error("Error deleting article:", error);
      setError("Failed to delete article");
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (article: Article) => {
    setSelectedArticle(article);
    setDetailDialogOpen(true);
  };

  useEffect(() => {
    fetchArticles(currentPage);
  }, [currentPage]);

  if (error) return <p className="text-center py-8 text-red-500">{error}</p>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-1 gap-2 me-4">
        <div className="relative items-center w-full max-w-lg">
          <Input id="search" type="search" placeholder="Search..." value={searchQuery} onChange={handleSearchChange} className="py-0 pl-10 h-9" />
          <span className="absolute inset-y-0 flex items-center justify-center px-2 py-0 start-0">
            <Search className="h-4 text-muted-foreground" />
          </span>
        </div>
        <FormArticle onSuccess={() => fetchArticles(currentPage, searchQuery)} />
      </div>

      {loading ? (
        <ArticleListSkeleton />
      ) : articles.length === 0 ? (
        <p className="text-center py-8">No articles found{searchQuery ? ` for "${searchQuery}"` : ""}</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {articles.map((article) => (
              <Card key={article.id} className="flex flex-col bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transform hover:scale-[1.02] transition-transform duration-300 max-h-[500px]">
                <CardHeader className="p-0 cursor-pointer" onClick={() => handleViewDetails(article)}>
                  {article.cover_image_url ? (
                    <Image src={article.cover_image_url?.startsWith("http") || article.cover_image_url?.startsWith("/") ? article.cover_image_url : "/img/placeholder-image.png"} alt={article.title} priority width={500} height={500} className="w-full h-48 object-cover" />
                  ) : (
                    <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-500">No Image</span>
                    </div>
                  )}
                </CardHeader>
                <CardContent className="p-4 flex flex-col justify-between h-full">
                  <div className="mb-4 cursor-pointer" onClick={() => handleViewDetails(article)}>
                    <h2 className="text-gray-800 text-lg font-semibold mb-1 line-clamp-2">{article.title || "Untitled"}</h2>
                    <p className="text-gray-600 text-sm line-clamp-3">{article.description || "No description"}</p>
                  </div>

                  <div className="flex flex-wrap items-center justify-end gap-2">
                    {/* <Button variant="outline" size="sm" onClick={() => handleViewDetails(article)}>
                      View
                    </Button> */}

                    <FormArticle
                      id={article.documentId}
                      initialData={{
                        title: article.title,
                        description: article.description,
                        category: article.category?.id.toString(),
                        cover_image_url: article.cover_image_url,
                      }}
                      onSuccess={() => fetchArticles(currentPage, searchQuery)}
                    />

                    <Button variant="destructive" size="sm" onClick={() => handleDeleteClick(article)}>
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}

      {/* Delete Confirmation Dialog */}
      {articleToDelete && (
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              {/* <AlertDialogDescription>This action cannot be undone. This will permanently delete the article &quot;{articleToDelete?.title}&quot;.</AlertDialogDescription> */}
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleConfirmDelete} disabled={loading} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                {loading ? "Deleting..." : "Delete"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}

      {/* Article Detail Dialog - Perbaikan struktur untuk menghindari div dalam p */}
      {selectedArticle && (
        <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{selectedArticle.title}</DialogTitle>
              <div className="text-sm text-muted-foreground">
                <div className="flex items-center gap-2 mt-2">
                  <span>Category: {selectedArticle.category?.name || "No category"}</span>
                </div>
              </div>
            </DialogHeader>

            <div className="space-y-4">
              {selectedArticle.cover_image_url && (
                <div className="relative w-full h-64 rounded-lg overflow-hidden">
                  {selectedArticle.cover_image_url ? (
                    <Image src={selectedArticle.cover_image_url?.startsWith("http") || selectedArticle.cover_image_url?.startsWith("/") ? selectedArticle.cover_image_url : "/img/placeholder-image.png"} alt={selectedArticle.title} priority width={500} height={500} className="w-full h-full object-cover object-center" />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-500">No Image</span>
                    </div>
                  )}
                </div>
              )}

              <div className="prose max-w-none">
                <p>{selectedArticle.description}</p>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold mb-4">Comments ({selectedArticle.comments?.length || 0})</h3>

                {selectedArticle.comments?.length ? (
                  <div className="space-y-4">
                    {selectedArticle.comments.map((comment) => (
                      <div key={comment.id} className="flex gap-3">
                        <Avatar>
                          <AvatarImage src={selectedArticle.user?.avatar} />
                          <AvatarFallback>{selectedArticle.user?.username?.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{selectedArticle.user?.username || "Anonymous"}</span>
                          </div>
                          <p className="text-sm mt-1">{comment.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No comments yet</p>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {pagination && pagination.pageCount > 1 && <ArticlePagination currentPage={currentPage} pageCount={pagination.pageCount} onPageChange={handlePageChange} />}
    </div>
  );
};

export default ArticleList;
