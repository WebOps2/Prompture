'use client';


interface DashboardPromptCardProps {
  id: string;
  title: string;
  prompt: string;
  source: string;
  tags?: string[];
  timestamp: string;
  favorite: boolean;
}

 function DashboardPromptCard({
  id,
  title,
  prompt,
  source,
  tags = [],
  timestamp,
  favorite,
}: DashboardPromptCardProps) {
  return (
    <div
      key={id}
      className="min-w-[350px] max-w-[350px] h-[220px] bg-white rounded-xl shadow-md p-5 hover:shadow-lg transition-transform hover:scale-105 flex flex-col"
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex flex-col">
          <h3 className="text-lg font-semibold text-gray-900 max-w-[250px] overflow-hidden text-ellipsis whitespace-nowrap">
            {title || 'Untitled Prompt'}
          </h3>
          <span className="text-sm text-purple-600 font-medium">{source}</span>
        </div>
        {/* Favorite Icon */}
        <button>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-6 w-6 ${
              favorite ? 'text-yellow-400' : 'text-gray-300'
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.518 4.674a1 1 0 00.95.69h4.914c.969 0 1.371 1.24.588 1.81l-3.978 2.888a1 1 0 00-.364 1.118l1.518 4.674c.3.921-.755 1.688-1.538 1.118l-3.978-2.888a1 1 0 00-1.175 0l-3.978 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.364-1.118L2.07 10.1c-.783-.57-.38-1.81.588-1.81h4.914a1 1 0 00.95-.69l1.518-4.674z" />
          </svg>
        </button>
      </div>

      {/* Description */}
      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{prompt}</p>

      {/* Footer - Pinned to Bottom */}
      <div className="mt-auto flex justify-between items-center text-xs text-gray-500">
        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {tags.length > 0 &&
            tags.map((tag, idx) => (
              <span
                key={idx}
                className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
        </div>
        {/* Date */}
        <span>
          {new Date(timestamp).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
          })}
        </span>
      </div>
    </div>
  );
}

export default DashboardPromptCard;