import { useState } from 'react';
import axios from 'axios';
import { FiCopy, FiExternalLink, FiBarChart2, FiSun, FiMoon } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const UrlShortener = () => {
  const [url, setUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [analytics, setAnalytics] = useState(null);
  const [showAnalytics, setShowAnalytics] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!url) {
      toast.error('Please enter a URL');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post('http://localhost:8001/url', {
        url: url,
      });
      setShortUrl(`http://localhost:8001/${response.data.id}`);
      setAnalytics(null);
      setShowAnalytics(false);
      toast.success('URL shortened successfully!');
    } catch (error) {
      toast.error('Failed to shorten URL');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shortUrl);
    toast.success('Copied to clipboard!');
  };

  const fetchAnalytics = async () => {
    if (!shortUrl) return;
    
    try {
      setLoading(true);
      const shortId = shortUrl.split('/').pop();
      const response = await axios.get(`http://localhost:8001/url/analytics/${shortId}`);
      setAnalytics(response.data);
      setShowAnalytics(true);
    } catch (error) {
      toast.error('Failed to fetch analytics');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };


  return (
    
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden p-6"
    >

      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <motion.input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter your long URL"
            className="flex-grow px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-all"
            whileFocus={{ scale: 1.01 }}
          />
          <motion.button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            whileHover={{ scale: loading ? 1 : 1.05 }}
            whileTap={{ scale: loading ? 1 : 0.95 }}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="inline-block mr-2"
                >
                  ⏳
                </motion.span>
                Shortening...
              </span>
            ) : (
              'Shorten'
            )}
          </motion.button>
        </div>
      </form>

      <AnimatePresence>
        {shortUrl && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-6"
          >
            <div className="flex items-center justify-between bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
              <a
                href={shortUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline break-all"
              >
                {shortUrl}
              </a>
              <div className="flex gap-2 ml-4">
                <motion.button
                  onClick={handleCopy}
                  className="p-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  title="Copy"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FiCopy size={20} />
                </motion.button>
                <motion.a
                  href={shortUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  title="Open"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FiExternalLink size={20} />
                </motion.a>
                <motion.button
                  onClick={fetchAnalytics}
                  disabled={loading}
                  className="p-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors disabled:opacity-50"
                  title="Analytics"
                  whileHover={{ scale: loading ? 1 : 1.1 }}
                  whileTap={{ scale: loading ? 1 : 0.9 }}
                >
                  <FiBarChart2 size={20} />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showAnalytics && analytics && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600"
          >
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3">
              URL Analytics
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <motion.div 
                className="bg-white dark:bg-gray-600 p-3 rounded-lg shadow-sm"
                whileHover={{ y: -2 }}
              >
                <p className="text-sm text-gray-500 dark:text-gray-300">Total Clicks</p>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {analytics.totalClicks}
                </p>
              </motion.div>
              <motion.div 
                className="bg-white dark:bg-gray-600 p-3 rounded-lg shadow-sm"
                whileHover={{ y: -2 }}
              >
                <p className="text-sm text-gray-500 dark:text-gray-300">Last Click</p>
                <p className="text-lg font-medium text-gray-700 dark:text-gray-200">
                  {analytics.totalClicks > 0 ? 
                    new Date(analytics.analytics[analytics.totalClicks - 1].timestamp).toLocaleString() : 
                    'Never'}
                </p>
              </motion.div>
            </div>
            
            {analytics.totalClicks > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="mt-4"
              >
                <h4 className="text-md font-medium text-gray-700 dark:text-gray-200 mb-2">
                  Click History
                </h4>
                <div className="max-h-60 overflow-y-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
                    <thead className="bg-gray-100 dark:bg-gray-600">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          #
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Timestamp
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-700 divide-y divide-gray-200 dark:divide-gray-600">
                      {analytics.analytics.map((click, index) => (
                        <motion.tr 
                          key={index}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                            {index + 1}
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                            {new Date(click.timestamp).toLocaleString()}
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default UrlShortener;