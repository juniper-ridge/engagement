import PostForm from "@/components/admin/PostForm";

export default function NewPostPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="font-[family-name:var(--font-playfair)] text-3xl font-bold text-[#2c3320]">
          New Post
        </h1>
        <p className="text-gray-500 text-sm mt-1">Write and publish a new blog article.</p>
      </div>
      <PostForm mode="create" />
    </div>
  );
}
