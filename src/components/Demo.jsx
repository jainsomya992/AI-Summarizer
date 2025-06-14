import { useState, useEffect } from "react";

import jsPDF from 'jspdf';
import { copy, linkIcon, loader, tick } from "../assets";
import { useLazyGetSummaryQuery } from "../services/article";

const Demo = ({ language, setLanguage }) => {
  const [Currentarticle, setCurrentArticle] = useState({
    url: "",
    summary: "",
    isFavorite: false,
  });
  const [allsavedArticles, setAllArticles] = useState([]);
  const [recentcopied, setCopied] = useState("");
  const [showFavorites, setShowFavorites] = useState(false);
  const [getSummary, { error, isFetching }] = useLazyGetSummaryQuery();
  const [summaryLength, setSummaryLength] = useState('medium');
  


  // Download summary handler
  const downloadSummary = (summary, type) => {
    if (type === 'pdf') {
      const doc = new jsPDF();
      const lines = doc.splitTextToSize(summary, 180);
      doc.text(lines, 10, 10);
      doc.save('summary.pdf');
    } else {
      const element = document.createElement("a");
      const file = new Blob([summary], { type: 'text/plain' });
      element.href = URL.createObjectURL(file);
      element.download = `summary.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }
  };

  // Load saved articles from local storage on mount
  useEffect(() => {
    const articlesFromLocalStorage = JSON.parse(localStorage.getItem("articles"));
    if (articlesFromLocalStorage) {
      setAllArticles(articlesFromLocalStorage);
    }
  }, []);

  // Submit URL handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    const existingArticle = allsavedArticles.find(
      (item) => item.url === Currentarticle.url && item.lengthMode === summaryLength && item.language === language
    );
    if (existingArticle) return setCurrentArticle(existingArticle);

    const { data } = await getSummary({
      articleUrl: Currentarticle.url,
      lengthMode: summaryLength,
      language
    });

    if (data?.summary) {
      const truncatedSummary = truncateSummary(data.summary, summaryLength);

      const newArticle = {
        ...Currentarticle,
        summary: truncatedSummary,
        createdAt: Date.now(),
        isFavorite: false,
        lengthMode: summaryLength,
        language,
      };
      const filteredArticles = allsavedArticles.filter(
        (item) => !(item.url === newArticle.url && item.lengthMode === newArticle.lengthMode)
      );
      const updatedAllArticles = [newArticle, ...filteredArticles];
      setCurrentArticle(newArticle);
      setAllArticles(updatedAllArticles);
      localStorage.setItem("articles", JSON.stringify(updatedAllArticles));
    }
  };

  // Truncate summary based on length mode
  const truncateSummary = (text, lengthMode) => {
    const paragraphLimits = {
      short: 1,
      medium: 3,
      long: 5,
    };
  
    const paragraphs = text.split(/\n\s*\n/);
    const limit = paragraphLimits[lengthMode] || 3;
  
    if (paragraphs.length >= limit) {
      return paragraphs.slice(0, limit).join("\n\n");
    }
  
    const wordLimits = {
      short: 50,
      medium: 100,
      long: 200,
    };
  
    const words = text.split(/\s+/);
    const wordLimit = wordLimits[lengthMode] || 100;
  
    if (words.length <= wordLimit) {
      return text;
    }
  
    return words.slice(0, wordLimit).join(" ") + "...";
  };

  // Copy URL handler
  const handleCopy = (copyUrl) => {
    setCopied(copyUrl);
    navigator.clipboard.writeText(copyUrl);
    setTimeout(() => setCopied(false), 3000);
  };
  const handleKeyDown = (e) => {
    if (e.keyCode === 13) handleSubmit(e);
  };

  const clearHistory = () => {
    setAllArticles([]);
    localStorage.removeItem("articles");
    setCurrentArticle({ url: "", summary: "", isFavorite: false });
  };

  // Toggle favorite status
  const toggleFavorite = (article) => {
    const updatedArticle = { ...article, isFavorite: !article.isFavorite };
    const updatedAllArticles = allsavedArticles.map((item) =>
      item.url === article.url ? updatedArticle : item
    );
    setAllArticles(updatedAllArticles);
    localStorage.setItem("articles", JSON.stringify(updatedAllArticles));
  };

  const toggleShowFavorites = () => setShowFavorites((prev) => !prev);

  const displayedArticles = showFavorites
  ? allsavedArticles.filter((article) => article.isFavorite)
  : allsavedArticles;


  return (
    <section className="mt-16 w-full max-w-xl relative bg-white dark:bg-gray-900 text-black dark:text-white p-4 rounded shadow">

      {/* Favorites Toggle */}
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={toggleShowFavorites}
          className="border px-3 py-1 rounded text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          {showFavorites ? "Show All" : "Show Favorites Only"}
        </button>
      </div>

      {/* Summary Length Selection */}
      <div className="flex items-center gap-2 mb-4">
        <label className="text-sm font-medium">Summary Length:</label>
        <select
          value={summaryLength}
          onChange={(e) => setSummaryLength(e.target.value)}
          className="border px-2 py-1 rounded text-sm dark:bg-gray-800 dark:text-white"
        >
          <option value="short">📑 Short (~50 words)</option>
          <option value="medium">📝 Medium (~100 words)</option>
          <option value="long">📖 Detailed (~200 words)</option>
        </select>
        <label className="text-sm font-medium">Language:</label>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="border px-2 py-1 rounded text-sm dark:bg-gray-800 dark:text-white"
        >
          <option value="en">🇬🇧 English</option>
          <option value="hi">🇮🇳 Hindi</option>
          <option value="es">🇪🇸 Spanish</option>
          <option value="fr">🇫🇷 French</option>
        </select>
      </div>

      {/* URL Submission */}
      <div className="flex flex-col w-full gap-2">
        <form className="relative flex justify-center items-center" onSubmit={handleSubmit}>
          <img src={linkIcon} alt="link-icon" className="absolute left-0 my-2 ml-3 w-5" />
          <input
            type="url"
            placeholder="Paste the article link"
            value={Currentarticle.url}
            onChange={(e) => setCurrentArticle({ ...Currentarticle, url: e.target.value })}
            onKeyDown={handleKeyDown}
            required
            className="url_input peer border rounded px-3 py-2 w-full dark:bg-gray-800 dark:text-white"
          />
          <button
            type="submit"
            disabled={!Currentarticle.url || isFetching}
            className={`ml-2 border px-3 py-1 rounded ${(!Currentarticle.url || isFetching) ? 'opacity-50 cursor-not-allowed' : 'peer-focus:border-gray-700 peer-focus:text-gray-700 dark:border-gray-600 dark:hover:bg-gray-800'}`}
          >
            ↵
          </button>
        </form>

        {/* Article List */}
        <div className="flex flex-col gap-1 max-h-40 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-gray-100 dark:scrollbar-track-gray-800">
          {displayedArticles.slice().reverse().map((item, index) => (
            <div
              key={`link-${index}`}
              onClick={() => setCurrentArticle(item)}
              className="link_card flex items-center gap-2 p-2 border rounded hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
            >
              <p className="text-gray-500 text-xs w-32">
                {item.createdAt ? new Date(item.createdAt).toLocaleString() : "No date"}
              </p>
              <div
                className="copy_btn cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCopy(item.url);
                }}
              >
                <img
                  src={recentcopied === item.url ? tick : copy}
                  alt={recentcopied === item.url ? "tick_icon" : "copy_icon"}
                  className="w-5 h-5"
                />
              </div>
              <p className="flex-1 font-satoshi text-blue-700 dark:text-blue-300 font-medium text-sm truncate">
                {item.url}
              </p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(item);
                }}
                className={`ml-2 text-xl transition-colors ${item.isFavorite ? "text-yellow-400 hover:text-yellow-300" : "text-gray-400 hover:text-yellow-400"}`}
              >
                {item.isFavorite ? "★" : "☆"}
              </button>
            </div>
          ))}
        </div>

        {/* Clear History */}
        {allsavedArticles.length > 0 && (
          <div className="mt-2">
            <button
              type="button"
              onClick={clearHistory}
              className="w-full p-2 text-sm text-red-500 border border-blue-400 rounded hover:bg-red-100 dark:hover:bg-gray-700"
            >
              🗑️ Clear History
            </button>
          </div>
        )}
      </div>

      {/* Summary Section */}
      <div className="my-10 max-w-full flex justify-center items-center">
        {isFetching ? (
          <img src={loader} alt="loader" className="w-20 h-20 object-contain" />
        ) : error ? (
          <p className="font-inter font-bold text-center text-red-500">
            Well, that was not supposed to happen...
            <br />
            <span className="font-satoshi font-normal text-gray-700">{error?.data?.error}</span>
          </p>
        ) : (
          Currentarticle.summary && (
            <div className="flex flex-col gap-4 w-full max-w-2xl">
              <h2 className="font-satoshi font-bold text-2xl text-black dark:text-white">
                Article <span className="text-blue-500">Summary</span>
              </h2>
              <div className="summary_box bg-gray-100 dark:bg-gray-800 p-4 rounded text-black dark:text-white">
                <p className="font-inter font-medium text-base">
                  {Currentarticle.summary}
                </p>
              </div>

              <div className="flex justify-between items-center mt-2">
                <button
                  onClick={() => downloadSummary(Currentarticle.summary, 'txt')}
                  className="border px-4 py-2 rounded text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                >
                  📄 Download as TXT
                </button>
                <button
                  onClick={() => downloadSummary(Currentarticle.summary, 'pdf')}
                  className="border px-4 py-2 rounded text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                >
                  📝 Download as PDF
                </button>
              </div>
            </div>
          )
        )}
      </div>
    </section>
  );
};

export default Demo;



