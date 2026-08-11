import Link from 'next/link';

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-[#111111] text-white flex flex-col items-center justify-center p-6 md:p-12">
      <div className="max-w-3xl w-full">
        <Link href="/" className="text-[#f8b11c] hover:text-white transition-colors text-sm font-medium mb-12 inline-block">
          &larr; Back to Home
        </Link>
        
        <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-8">Blog</h1>
        
        <div className="space-y-6 text-gray-300 text-base md:text-lg leading-relaxed">
          <p>
            Welcome to the Hidden Eats blog. Here we share stories about the amazing local restaurants, chefs, and street food vendors we discover across the region.
          </p>
          <p>
            Stay tuned for our upcoming articles, food reviews, and deep dives into the local food culture.
          </p>
        </div>
      </div>
    </div>
  );
}
