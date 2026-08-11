import Link from 'next/link';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#111111] text-white flex flex-col items-center justify-center p-6 md:p-12">
      <div className="max-w-3xl w-full">
        <Link href="/" className="text-[#f8b11c] hover:text-white transition-colors text-sm font-medium mb-12 inline-block">
          &larr; Back to Home
        </Link>
        
        <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-8">Contact Us</h1>
        
        <div className="space-y-6 text-gray-300 text-base md:text-lg leading-relaxed">
          <p>
            Have a question or a restaurant recommendation? We'd love to hear from you.
          </p>
          <p>
            Email us at: <strong>support@hiddeneats.com</strong>
          </p>
        </div>
      </div>
    </div>
  );
}
