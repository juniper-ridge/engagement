import PostForm from "@/components/admin/PostForm";

export default function NewPostPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#1a2316]" style={{ fontFamily: "var(--font-playfair)" }}>
          New Post
        </h1>
        <p className="text-gray-500 text-sm mt-1">Write and publish a new blog article.</p>
      </div>
      <PostForm mode="create" />
    </div>
  );
}
