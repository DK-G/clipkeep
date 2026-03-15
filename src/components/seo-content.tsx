'use client';

interface SEOContentProps {
  content: string;
}

export function SEOContent({ content }: SEOContentProps) {
  if (!content) return null;

  const renderContent = (text: string) => {
    return text
      .split('\n')
      .filter((line) => line.trim() !== '')
      .map((line, i) => {
        if (line.startsWith('## ')) {
          return (
            <h2 key={i} className="text-2xl font-bold mt-10 mb-6 text-gray-900 border-b border-gray-100 pb-2">
              {line.replace('## ', '')}
            </h2>
          );
        }

        if (line.startsWith('### ')) {
          return (
            <h3 key={i} className="text-xl font-semibold mt-8 mb-4 text-gray-800">
              {line.replace('### ', '')}
            </h3>
          );
        }

        const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
        const parts: Array<string | React.ReactNode> = [];
        let lastIndex = 0;
        let match: RegExpExecArray | null;

        while ((match = linkRegex.exec(line)) !== null) {
          if (match.index > lastIndex) {
            parts.push(line.substring(lastIndex, match.index));
          }
          parts.push(
            <a key={match.index} href={match[2]} className="text-blue-600 hover:underline font-semibold decoration-2 underline-offset-4">
              {match[1]}
            </a>
          );
          lastIndex = match.index + match[0].length;
        }

        if (lastIndex < line.length) {
          parts.push(line.substring(lastIndex));
        }

        return (
          <p key={i} className="text-gray-600 leading-relaxed mb-6 text-lg">
            {parts.length > 0 ? parts : line}
          </p>
        );
      });
  };

  return <div className="mt-16 p-8 bg-gray-50 rounded-3xl border border-gray-100 max-w-4xl mx-auto">{renderContent(content)}</div>;
}

