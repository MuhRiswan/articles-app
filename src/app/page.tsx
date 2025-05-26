import ArticleList from "@/components/article-list";

export default function Home() {
  return (
    <main>
      <div className="pt-20 mb-5 container mx-auto">
        <h1 className="text-2xl font-bold mb-4">Articles</h1>
        <ArticleList />
      </div>
    </main>
  );
}
