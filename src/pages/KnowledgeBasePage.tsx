import React, { useState } from 'react';
import { useRouter } from '../context/RouterContext';
import { KNOWLEDGE_ARTICLES } from '../data/mockData';
import { KnowledgeArticle } from '../types';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import {
  BookOpen,
  Search,
  Clock,
  ThumbsUp,
  X,
  ArrowRight,
  LifeBuoy,
} from 'lucide-react';

export const KnowledgeBasePage: React.FC = () => {
  const { navigate } = useRouter();
  const [articles, setArticles] = useState<KnowledgeArticle[]>(KNOWLEDGE_ARTICLES);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeArticle, setActiveArticle] = useState<KnowledgeArticle | null>(null);
  const [votedArticles, setVotedArticles] = useState<Record<string, boolean>>({});

  const categories = [
    'All',
    'Payroll & Pensions',
    'IT & Systems Access',
    'Travel & Expenses',
    'Procurement',
    'HR Policies',
  ];

  const filteredArticles = articles.filter((art) => {
    const matchesCategory = selectedCategory === 'All' || art.category === selectedCategory;
    const matchesSearch =
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.content.some((para) => para.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleHelpfulVote = (articleId: string) => {
    if (votedArticles[articleId]) return;
    setArticles((prev) =>
      prev.map((a) => (a.id === articleId ? { ...a, helpfulCount: a.helpfulCount + 1 } : a))
    );
    setVotedArticles((prev) => ({ ...prev, [articleId]: true }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <Breadcrumbs items={[{ label: 'Knowledge Base', path: '/knowledgebase/' }]} />

      <div className="border-b border-slate-200 dark:border-slate-800 pb-6 transition-colors">
        <span className="text-xs font-semibold uppercase text-sky-700 dark:text-sky-400 tracking-wider block mb-1">
          Self-Service Repository
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
          Knowledge Base
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Search verified NHS guidance, payroll cut-off calendars, IT troubleshooting procedures, and statutory leave policies.
        </p>
      </div>

      {/* Search Header Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs transition-colors">
        <div className="max-w-2xl mx-auto space-y-4">
          <div className="relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search knowledge articles by keyword, policy number, or query..."
              className="w-full pl-11 pr-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:border-sky-600 focus:bg-white dark:focus:bg-slate-800 text-slate-900 dark:text-white transition-all"
            />
          </div>

          {/* Category Filter Pills (Functional Buttons) */}
          <div className="flex flex-wrap items-center gap-1.5 justify-center">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  selectedCategory === cat
                    ? 'bg-sky-700 text-white font-semibold shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredArticles.length === 0 ? (
          <div className="col-span-full py-16 text-center bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-8">
            <BookOpen className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">No articles matched your criteria</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-4">
              Try searching with different terms or select another category.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-semibold"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          filteredArticles.map((article) => (
            <div
              key={article.id}
              className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 flex flex-col justify-between hover:border-sky-300 dark:hover:border-sky-600 transition-all shadow-xs cursor-pointer group"
              onClick={() => setActiveArticle(article)}
            >
              <div>
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-2.5">
                  <span className="font-semibold text-sky-800 dark:text-sky-300">{article.category}</span>
                  <span aria-hidden="true">·</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    {article.readTime}
                  </span>
                </div>

                <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 group-hover:text-sky-800 dark:group-hover:text-sky-300 transition-colors leading-snug mb-2">
                  {article.title}
                </h2>

                <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed mb-4">
                  {article.summary}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400 tabular-nums">Updated {article.lastUpdated}</span>
                <span className="text-sky-700 dark:text-sky-400 font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                  Read article <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Support Escalation Notice */}
      <div className="bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800 p-6 flex flex-col sm:flex-row items-center justify-between gap-4 transition-colors">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Didn&apos;t find the answer you need?</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
            You can log a formal support enquiry with NHS SBS operations desk for personalized assistance.
          </p>
        </div>
        <button
          onClick={() => navigate('/support/')}
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 transition-colors"
        >
          <LifeBuoy className="w-3.5 h-3.5" />
          <span>Raise a Support Ticket</span>
        </button>
      </div>

      {/* Article Detail Modal */}
      {activeArticle && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-1">
                  <span className="font-semibold text-sky-800 dark:text-sky-300">{activeArticle.category}</span>
                  <span aria-hidden="true">·</span>
                  <span className="tabular-nums font-mono">{activeArticle.readTime}</span>
                </div>
                <h2 className="text-xl font-bold">{activeArticle.title}</h2>
              </div>
              <button
                onClick={() => setActiveArticle(null)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs leading-relaxed text-slate-700 dark:text-slate-300">
              <div className="p-3 bg-sky-50 dark:bg-sky-950/40 border border-sky-100 dark:border-sky-800 rounded-lg text-sky-900 dark:text-sky-200 font-medium">
                {activeArticle.summary}
              </div>

              <div className="space-y-3 pt-2 text-sm text-slate-800 dark:text-slate-200">
                {activeArticle.content.map((paragraph, idx) => (
                  <p key={idx} className="leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>

              <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  Was this information helpful to your enquiry?
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleHelpfulVote(activeArticle.id)}
                    disabled={votedArticles[activeArticle.id]}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium border transition-colors ${
                      votedArticles[activeArticle.id]
                        ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                        : 'bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700'
                    }`}
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>
                      {votedArticles[activeArticle.id] ? 'Thank you!' : 'Yes, helpful'} ({activeArticle.helpfulCount})
                    </span>
                  </button>
                  <button
                    onClick={() => setActiveArticle(null)}
                    className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-md text-xs font-medium"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
