import { MessageSquareIcon } from "lucide-react";

export default function AuthHeader() {
  return (
    <div className="flex items-center space-x-3">
      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#4F46E5] to-[#9333EA] flex items-center justify-center">
        <MessageSquareIcon className="text-white w-6 h-6" />
      </div>
      <h1 className="text-2xl font-semibold bg-gradient-to-r from-[#4F46E5] to-[#9333EA] text-transparent bg-clip-text">
        PromptBoard
      </h1>
    </div>
  );
}
