"use client";

interface FooterProps {
  isDark: boolean;
}

export function Footer({ isDark }: FooterProps) {
  return (
    <footer
      className={`mt-16 border-t ${
        isDark ? "border-gray-700 bg-gray-800" : "border-slate-200 bg-white"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <p
          className={`text-center text-sm ${
            isDark ? "text-gray-400" : "text-slate-600"
          }`}
        >
          Powered by Google Gemini 2.0 Flash | Built with Next.js & TypeScript
        </p>
      </div>
    </footer>
  );
}