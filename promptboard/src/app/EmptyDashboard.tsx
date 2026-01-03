'use client';

import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, Chrome, Database, GitBranch, MessageSquare, Tag, TrendingUp } from 'lucide-react';
import Link from 'next/link';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const features = [
  {
    icon: Database,
    title: 'Auto-save prompts',
    description: 'Seamlessly capture prompts as you work',
    color: 'text-violet-600',
    bgColor: 'bg-violet-50',
  },
  {
    icon: Tag,
    title: 'Smart tagging',
    description: 'Organize with intelligent categorization',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
  },
  {
    icon: TrendingUp,
    title: 'Usage analytics',
    description: 'Track performance and usage patterns',
    color: 'text-violet-600',
    bgColor: 'bg-violet-50',
  },
  {
    icon: GitBranch,
    title: 'Version control',
    description: 'Track changes and iterate with confidence',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
  },
];

export default function EmptyDashBoard() {
  const link = "https://chromewebstore.google.com/detail/promptboard/cciapdgmelahbmnjomlbdmpbejedmnkm?authuser=0&hl=en&pli=1"
  
  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4 sm:px-6 py-16 sm:py-24">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="w-full max-w-5xl mx-auto"
      >
        {/* Hero Section */}
        <div className="text-center mb-20">
          {/* Logo/Icon */}
          <motion.div variants={itemVariants} className="flex justify-center mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-violet-500/20 to-purple-500/20 blur-2xl rounded-full" />
              <div className="relative bg-gradient-to-br from-violet-600 to-purple-600 p-4 rounded-2xl shadow-lg">
                <MessageSquare className="w-8 h-8 text-white" />
              </div>
            </div>
          </motion.div>

          {/* Headline */}
          <motion.div variants={itemVariants} className="space-y-4 mb-12">
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight text-foreground">
              Your prompts,{' '}
              <span className="bg-gradient-to-r from-violet-600 to-purple-500 bg-clip-text text-transparent">
                organized
              </span>
            </h1>
            <p className="text-xl sm:text-2xl text-muted-foreground max-w-2xl mx-auto font-light leading-relaxed">
              Manage, organize, and version your AI prompts with enterprise-grade tools.
            </p>
            <p className="text-base text-muted-foreground/80 max-w-xl mx-auto mt-4">
              You haven&rsquo;t saved any prompts yet. Get started by installing our Chrome extension.
            </p>
          </motion.div>

          {/* CTA Button */}
          <motion.div variants={itemVariants} className="flex justify-center">
            <Link
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2.5 bg-gradient-to-r from-violet-600 to-purple-600 text-white px-8 py-4 rounded-lg font-medium hover:from-violet-700 hover:to-purple-700 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <Chrome className="w-5 h-5" />
              <span>Install Chrome Extension</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </motion.div>
        </div>

        {/* How It Works Section */}
        <motion.div variants={itemVariants} className="mb-20">
          <div className="bg-muted/30 border border-border rounded-xl p-8 sm:p-12">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-16">
              {/* AI Chat */}
              <div className="flex flex-col items-center gap-3 text-center">
                <div className="bg-background border border-border p-4 rounded-lg shadow-sm">
                  <BookOpen className="w-6 h-6 text-muted-foreground" />
                </div>
                <span className="text-sm font-medium text-foreground">AI Chat</span>
              </div>

              {/* Arrow */}
              <div className="hidden sm:block">
                <ArrowRight className="w-5 h-5 text-muted-foreground" />
              </div>
              <div className="sm:hidden">
                <ArrowRight className="w-5 h-5 text-muted-foreground rotate-90" />
              </div>

              {/* PromptBoard */}
              <div className="flex flex-col items-center gap-3 text-center">
                <div className="bg-background border border-border p-4 rounded-lg shadow-sm">
                  <MessageSquare className="w-6 h-6 text-purple-600" />
                </div>
                <span className="text-sm font-medium text-foreground">PromptBoard</span>
              </div>
            </div>
            <p className="text-center text-sm text-muted-foreground mt-8">
              Save prompts instantly with our Chrome extension while you chat
            </p>
          </div>
        </motion.div>

        {/* Features Grid */}
        <motion.div variants={itemVariants}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={idx}
                  variants={itemVariants}
                  className="group p-6 bg-background border border-border rounded-lg hover:border-purple-200 hover:shadow-sm transition-all duration-200"
                >
                  <div className="flex items-start gap-4">
                    <div className={`${feature.bgColor} p-2.5 rounded-lg`}>
                      <Icon className={`w-5 h-5 ${feature.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground mb-1.5">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
