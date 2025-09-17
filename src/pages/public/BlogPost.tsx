import { useParams, Link } from 'react-router-dom';
import { Calendar, User, ArrowLeft, Tag, Share2, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import CompanyHeader from '../../components/layout/CompanyHeader';
import CompanyFooter from '../../components/layout/CompanyFooter';
import apiService from '../../services/api';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  author: string;
  authorBio: string;
  authorImage: string;
  date: string;
  category: string;
  readTime: string;
  image: string;
  featured: boolean;
  tags: string[];
}

const BlogPost = () => {
  const { id } = useParams<{ id: string }>();
  const [currentPost, setCurrentPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlogPost = async () => {
      try {
        const post = await apiService.getBlogPostBySlug(id!);
        setCurrentPost(post.post);
        
        // Fetch related posts from the same category
        const posts = await apiService.getBlogPosts(post.post.category);
        setRelatedPosts(posts.filter(p => p.id !== post.post.id).slice(0, 3));
      } catch (err) {
        setError('Failed to load blog post');
        console.error('Error fetching blog post:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBlogPost();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <CompanyHeader />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </div>
        <CompanyFooter />
      </div>
    );
  }

  if (error || !currentPost) {
    return (
      <div className="min-h-screen bg-white">
        <CompanyHeader />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Post Not Found</h1>
            <p className="text-gray-600 mb-8">{error || 'The blog post you\'re looking for doesn\'t exist.'}</p>
            <Link
              to="/blog"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Blog
            </Link>
          </div>
        </div>
        <CompanyFooter />
      </div>
    );
  }

  // Navigation logic for related posts
  const currentIndex = relatedPosts.findIndex(post => post.slug === id);
  const nextPost = currentIndex < relatedPosts.length - 1 ? relatedPosts[currentIndex + 1] : null;
  const prevPost = currentIndex > 0 ? relatedPosts[currentIndex - 1] : null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <CompanyHeader />
      
      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm">
            <Link to="/" className="text-gray-500 hover:text-gray-700">Home</Link>
            <span className="text-gray-400">/</span>
            <Link to="/blog" className="text-gray-500 hover:text-gray-700">Blog</Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-medium">{currentPost.title}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Article Header */}
            <article className="prose prose-lg max-w-none">
              <header className="mb-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
                  {currentPost.title}
                </h1>
                
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-6">
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-2" />
                    <span>{currentPost.author}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>{formatDate(currentPost.date)}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>{currentPost.readTime}</span>
                  </div>
                  <div className="flex items-center">
                    <Tag className="h-4 w-4 mr-2" />
                    <span>{currentPost.category}</span>
                  </div>
                </div>

                {currentPost.image && (
                  <div className="mb-8">
                    <img
                      src={currentPost.image}
                      alt={currentPost.title}
                      className="w-full h-64 object-cover rounded-lg shadow-lg"
                    />
                  </div>
                )}

                {currentPost.excerpt && (
                  <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-8">
                    <p className="text-lg text-blue-800 font-medium italic">
                      {currentPost.excerpt}
                    </p>
                  </div>
                )}
              </header>

              {/* Article Content */}
              <div 
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: currentPost.content }}
              />

              {/* Tags */}
              {currentPost.tags && currentPost.tags.length > 0 && (
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {currentPost.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-800"
                      >
                        <Tag className="h-3 w-3 mr-1" />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Share Buttons */}
              <div className="mt-8 pt-8 border-t border-gray-200">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Share this article</h3>
                <div className="flex space-x-4">
                  <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </button>
                </div>
              </div>
            </article>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-8">
              {/* Author Info */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">About the Author</h3>
                <div className="flex items-start space-x-4">
                  <img
                    src={currentPost.authorImage}
                    alt={currentPost.author}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-medium text-gray-900">{currentPost.author}</h4>
                    <p className="text-sm text-gray-600 mt-1">{currentPost.authorBio}</p>
                  </div>
                </div>
              </div>

              {/* Related Posts */}
              {relatedPosts.length > 0 && (
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Related Articles</h3>
                  <div className="space-y-4">
                    {relatedPosts.map((post) => (
                      <Link
                        key={post.id}
                        to={`/blog/${post.slug}`}
                        className="block group"
                      >
                        <div className="flex space-x-3">
                          {post.image && (
                            <img
                              src={post.image}
                              alt={post.title}
                              className="w-16 h-16 object-cover rounded-lg"
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                              {post.title}
                            </h4>
                            <p className="text-xs text-gray-500 mt-1">{formatDate(post.date)}</p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Navigation */}
              {(nextPost || prevPost) && (
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">More Articles</h3>
                  <div className="space-y-3">
                    {prevPost && (
                      <Link
                        to={`/blog/${prevPost.slug}`}
                        className="flex items-center space-x-3 group"
                      >
                        <ChevronLeft className="h-4 w-4 text-gray-400 group-hover:text-blue-600" />
                        <div>
                          <p className="text-sm text-gray-500">Previous</p>
                          <p className="text-sm font-medium text-gray-900 group-hover:text-blue-600 line-clamp-1">
                            {prevPost.title}
                          </p>
                        </div>
                      </Link>
                    )}
                    {nextPost && (
                      <Link
                        to={`/blog/${nextPost.slug}`}
                        className="flex items-center space-x-3 group"
                      >
                        <div className="flex-1 text-right">
                          <p className="text-sm text-gray-500">Next</p>
                          <p className="text-sm font-medium text-gray-900 group-hover:text-blue-600 line-clamp-1">
                            {nextPost.title}
                          </p>
                        </div>
                        <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600" />
                      </Link>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <CompanyFooter />
    </div>
  );
};

export default BlogPost;