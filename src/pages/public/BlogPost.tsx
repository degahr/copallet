import { useParams, Link } from 'react-router-dom';
import { Calendar, User, ArrowLeft, Tag, Share2, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import CompanyHeader from '../../components/layout/CompanyHeader';
import CompanyFooter from '../../components/layout/CompanyFooter';

const BlogPost = () => {
  const { id } = useParams<{ id: string }>();

  // Mock blog posts data (in a real app, this would come from an API)
  const blogPosts = [
    {
      id: 1,
      title: "The Future of Pallet Freight: Digital Transformation in Logistics",
      content: `
        <p>The logistics industry is undergoing a massive digital transformation, and pallet freight is at the forefront of this revolution. Traditional freight forwarding methods are being replaced by intelligent platforms that connect shippers with carriers in real-time.</p>
        
        <h2>The Current State of Pallet Freight</h2>
        <p>Pallet freight represents one of the most efficient ways to transport goods across Europe. With standardized pallet sizes and established networks, it offers reliability and cost-effectiveness that other transport methods struggle to match.</p>
        
        <p>However, the industry has faced several challenges:</p>
        <ul>
          <li>Fragmented carrier networks</li>
          <li>Manual booking processes</li>
          <li>Limited visibility into shipment status</li>
          <li>Inefficient route planning</li>
        </ul>
        
        <h2>Digital Platforms: The Game Changer</h2>
        <p>Digital freight platforms like CoPallet are revolutionizing the industry by:</p>
        
        <h3>1. Intelligent Matching</h3>
        <p>Advanced algorithms analyze shipment requirements and carrier capabilities to find the perfect match. This reduces empty miles and improves efficiency.</p>
        
        <h3>2. Real-Time Tracking</h3>
        <p>GPS tracking and automated updates provide complete visibility from pickup to delivery. Shippers can track their goods in real-time, reducing anxiety and improving customer service.</p>
        
        <h3>3. Automated Processes</h3>
        <p>From booking to invoicing, digital platforms automate routine tasks, reducing errors and administrative overhead.</p>
        
        <h2>The Benefits for Shippers</h2>
        <p>Shippers are seeing significant benefits from digital freight platforms:</p>
        
        <ul>
          <li><strong>Cost Reduction:</strong> Up to 30% savings through better carrier matching and reduced empty miles</li>
          <li><strong>Improved Reliability:</strong> Verified carriers and performance tracking ensure consistent service</li>
          <li><strong>Better Visibility:</strong> Real-time tracking and automated notifications</li>
          <li><strong>Simplified Management:</strong> One platform for all freight needs</li>
        </ul>
        
        <h2>The Benefits for Carriers</h2>
        <p>Carriers also benefit significantly:</p>
        
        <ul>
          <li><strong>Increased Load Utilization:</strong> Better matching reduces empty return journeys</li>
          <li><strong>Streamlined Operations:</strong> Automated booking and documentation</li>
          <li><strong>Performance Insights:</strong> Analytics help optimize routes and pricing</li>
          <li><strong>Direct Access:</strong> Connect directly with shippers without intermediaries</li>
        </ul>
        
        <h2>Looking Ahead: The Future of Digital Freight</h2>
        <p>The future of pallet freight is undoubtedly digital. We're seeing several trends emerging:</p>
        
        <h3>Artificial Intelligence</h3>
        <p>AI is being used for predictive analytics, demand forecasting, and dynamic pricing. This helps optimize the entire supply chain.</p>
        
        <h3>Blockchain Integration</h3>
        <p>Blockchain technology is being explored for secure, transparent documentation and smart contracts.</p>
        
        <h3>Sustainability Focus</h3>
        <p>Digital platforms are helping reduce carbon emissions through better route optimization and load consolidation.</p>
        
        <h2>Conclusion</h2>
        <p>The digital transformation of pallet freight is not just a trend—it's a necessity. Companies that embrace these technologies will be better positioned to compete in an increasingly complex logistics landscape.</p>
        
        <p>At CoPallet, we're proud to be part of this transformation, helping shippers and carriers alike benefit from the power of digital logistics.</p>
      `,
      excerpt: "Discover how digital platforms are revolutionizing the pallet freight industry, making shipping more efficient and cost-effective for businesses of all sizes.",
      author: "Sarah Johnson",
      authorBio: "Sarah is a logistics expert with over 15 years of experience in freight forwarding and supply chain management. She holds an MBA in Operations Management and has worked with Fortune 500 companies across Europe.",
      authorImage: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
      date: "2024-01-15",
      category: "Industry Insights",
      readTime: "5 min read",
      image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&h=400&fit=crop",
      featured: true,
      tags: ["Digital Transformation", "Logistics", "Freight", "Technology"]
    },
    {
      id: 2,
      title: "How to Choose the Right Carrier for Your Shipments",
      content: `
        <p>Selecting the right carrier is crucial for the success of your logistics operations. With so many options available, it can be challenging to make the right choice. Here's a comprehensive guide to help you choose the perfect carrier for your shipments.</p>
        
        <h2>Understanding Your Requirements</h2>
        <p>Before you start looking for carriers, you need to clearly define your requirements:</p>
        
        <h3>Shipment Characteristics</h3>
        <ul>
          <li>Size and weight of your pallets</li>
          <li>Type of goods (fragile, hazardous, temperature-sensitive)</li>
          <li>Pickup and delivery locations</li>
          <li>Delivery timeframes</li>
        </ul>
        
        <h3>Service Requirements</h3>
        <ul>
          <li>Tracking capabilities</li>
          <li>Insurance coverage</li>
          <li>Customer service availability</li>
          <li>Documentation requirements</li>
        </ul>
        
        <h2>Key Factors to Consider</h2>
        
        <h3>1. Reliability and Performance</h3>
        <p>Look for carriers with:</p>
        <ul>
          <li>High on-time delivery rates</li>
          <li>Good customer reviews and ratings</li>
          <li>Proven track record in your industry</li>
          <li>Consistent service quality</li>
        </ul>
        
        <h3>2. Coverage and Network</h3>
        <p>Ensure the carrier has:</p>
        <ul>
          <li>Coverage in your pickup and delivery areas</li>
          <li>Regular routes that match your needs</li>
          <li>Backup options for route disruptions</li>
          <li>Partnerships with other carriers if needed</li>
        </ul>
        
        <h3>3. Pricing and Value</h3>
        <p>Consider:</p>
        <ul>
          <li>Transparent pricing structure</li>
          <li>Value for money, not just lowest price</li>
          <li>Additional fees and surcharges</li>
          <li>Payment terms and methods</li>
        </ul>
        
        <h3>4. Technology and Communication</h3>
        <p>Modern carriers should offer:</p>
        <ul>
          <li>Real-time tracking</li>
          <li>Digital documentation</li>
          <li>Automated notifications</li>
          <li>Easy communication channels</li>
        </ul>
        
        <h2>Verification and Compliance</h2>
        <p>Always verify that carriers have:</p>
        
        <ul>
          <li><strong>Proper Licensing:</strong> Valid transport licenses and permits</li>
          <li><strong>Insurance Coverage:</strong> Adequate liability and cargo insurance</li>
          <li><strong>Safety Records:</strong> Clean safety records and certifications</li>
          <li><strong>Compliance:</strong> Adherence to industry regulations and standards</li>
        </ul>
        
        <h2>Building Long-Term Relationships</h2>
        <p>The best carrier relationships are built on:</p>
        
        <ul>
          <li><strong>Communication:</strong> Regular, open communication</li>
          <li><strong>Feedback:</strong> Constructive feedback and continuous improvement</li>
          <li><strong>Flexibility:</strong> Willingness to adapt to your changing needs</li>
          <li><strong>Partnership:</strong> Treating carriers as partners, not just vendors</li>
        </ul>
        
        <h2>Red Flags to Avoid</h2>
        <p>Be cautious of carriers that:</p>
        
        <ul>
          <li>Offer prices that seem too good to be true</li>
          <li>Have poor communication or response times</li>
          <li>Lack proper documentation or insurance</li>
          <li>Have negative reviews or safety violations</li>
          <li>Are unwilling to provide references</li>
        </ul>
        
        <h2>Using Digital Platforms</h2>
        <p>Digital freight platforms like CoPallet can help you:</p>
        
        <ul>
          <li>Compare multiple carriers quickly</li>
          <li>Access verified carrier networks</li>
          <li>Get instant quotes and booking</li>
          <li>Track performance and ratings</li>
          <li>Manage all shipments in one place</li>
        </ul>
        
        <h2>Conclusion</h2>
        <p>Choosing the right carrier is a critical decision that can significantly impact your business operations. Take the time to evaluate carriers thoroughly, consider all relevant factors, and build strong relationships with reliable partners.</p>
        
        <p>Remember, the cheapest option isn't always the best. Focus on finding carriers that offer the right combination of reliability, service quality, and value for your specific needs.</p>
      `,
      excerpt: "Learn the key factors to consider when selecting a carrier, from pricing and reliability to specialized services and coverage areas.",
      author: "Mike Chen",
      authorBio: "Mike is a supply chain consultant specializing in carrier selection and logistics optimization. He has helped over 200 companies improve their freight operations.",
      authorImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
      date: "2024-01-10",
      category: "Shipping Tips",
      readTime: "4 min read",
      image: "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=800&h=400&fit=crop",
      featured: false,
      tags: ["Carrier Selection", "Logistics", "Best Practices", "Shipping"]
    },
    {
      id: 3,
      title: "Cost Optimization Strategies for Pallet Shipping",
      content: `
        <p>Reducing shipping costs while maintaining service quality is a constant challenge for businesses. Here are proven strategies to optimize your pallet shipping costs without compromising on delivery performance.</p>
        
        <h2>1. Consolidate Shipments</h2>
        <p>One of the most effective ways to reduce costs is through shipment consolidation:</p>
        
        <ul>
          <li><strong>Batch Orders:</strong> Group multiple orders going to the same region</li>
          <li><strong>Schedule Optimization:</strong> Plan shipments for optimal carrier utilization</li>
          <li><strong>Route Planning:</strong> Combine shipments on efficient routes</li>
        </ul>
        
        <h2>2. Optimize Pallet Utilization</h2>
        <p>Maximize the use of each pallet space:</p>
        
        <ul>
          <li><strong>Efficient Packing:</strong> Use proper palletization techniques</li>
          <li><strong>Mixed Loads:</strong> Combine compatible products on single pallets</li>
          <li><strong>Standard Sizes:</strong> Use standard pallet sizes for better carrier compatibility</li>
        </ul>
        
        <h2>3. Leverage Technology</h2>
        <p>Digital platforms can significantly reduce costs:</p>
        
        <ul>
          <li><strong>Real-Time Pricing:</strong> Compare rates across multiple carriers instantly</li>
          <li><strong>Route Optimization:</strong> AI-powered route planning reduces fuel costs</li>
          <li><strong>Load Matching:</strong> Better matching reduces empty miles</li>
        </ul>
        
        <h2>4. Build Carrier Relationships</h2>
        <p>Long-term relationships often lead to better rates:</p>
        
        <ul>
          <li><strong>Volume Commitments:</strong> Guarantee minimum volumes for better rates</li>
          <li><strong>Regular Routes:</strong> Establish consistent routes for preferred pricing</li>
          <li><strong>Performance Incentives:</strong> Reward carriers for excellent service</li>
        </ul>
        
        <h2>5. Flexible Scheduling</h2>
        <p>Flexibility can lead to significant savings:</p>
        
        <ul>
          <li><strong>Off-Peak Shipping:</strong> Ship during less busy periods for better rates</li>
          <li><strong>Lead Time Optimization:</strong> Give carriers more time for better pricing</li>
          <li><strong>Alternative Routes:</strong> Consider slightly longer routes for better rates</li>
        </ul>
        
        <h2>6. Monitor and Analyze</h2>
        <p>Regular analysis helps identify cost-saving opportunities:</p>
        
        <ul>
          <li><strong>Cost Tracking:</strong> Monitor shipping costs by route, carrier, and time</li>
          <li><strong>Performance Metrics:</strong> Track delivery times and service quality</li>
          <li><strong>Trend Analysis:</strong> Identify patterns and optimization opportunities</li>
        </ul>
        
        <h2>Conclusion</h2>
        <p>Cost optimization is an ongoing process that requires continuous monitoring and adjustment. By implementing these strategies, you can significantly reduce your pallet shipping costs while maintaining or improving service quality.</p>
      `,
      excerpt: "Explore proven strategies to reduce your pallet shipping costs while maintaining service quality and delivery reliability.",
      author: "Emma Davis",
      authorBio: "Emma is a logistics cost optimization specialist with expertise in freight management and supply chain efficiency.",
      authorImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
      date: "2024-01-05",
      category: "Cost Management",
      readTime: "6 min read",
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=400&fit=crop",
      featured: false,
      tags: ["Cost Optimization", "Shipping", "Efficiency", "Logistics"]
    }
  ];

  const currentPost = blogPosts.find(post => post.id === parseInt(id || '0'));
  const currentIndex = blogPosts.findIndex(post => post.id === parseInt(id || '0'));
  const nextPost = currentIndex < blogPosts.length - 1 ? blogPosts[currentIndex + 1] : null;
  const prevPost = currentIndex > 0 ? blogPosts[currentIndex - 1] : null;

  if (!currentPost) {
    return (
      <div className="min-h-screen bg-white">
        <CompanyHeader />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Post Not Found</h1>
            <p className="text-gray-600 mb-8">The blog post you're looking for doesn't exist.</p>
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

  return (
    <div className="min-h-screen bg-white">
      <CompanyHeader />
      
      {/* Breadcrumb */}
      <div className="bg-gray-50 py-4">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center space-x-2 text-sm">
            <Link to="/" className="text-gray-500 hover:text-gray-700">Home</Link>
            <span className="text-gray-400">/</span>
            <Link to="/blog" className="text-gray-500 hover:text-gray-700">Blog</Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-medium">{currentPost.title}</span>
          </nav>
        </div>
      </div>

      {/* Article Header */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Link
            to="/blog"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Blog
          </Link>
          
          <div className="flex items-center space-x-4 mb-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
              <Tag className="h-4 w-4 mr-1" />
              {currentPost.category}
            </span>
            <span className="text-sm text-gray-500">{currentPost.readTime}</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            {currentPost.title}
          </h1>
          
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <img
                  src={currentPost.authorImage}
                  alt={currentPost.author}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <div className="font-medium text-gray-900">{currentPost.author}</div>
                  <div className="text-sm text-gray-500">{currentPost.date}</div>
                </div>
              </div>
            </div>
            
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </button>
          </div>
        </div>

        {/* Featured Image */}
        <div className="mb-8">
          <img
            src={currentPost.image}
            alt={currentPost.title}
            className="w-full h-64 md:h-96 object-cover rounded-lg"
          />
        </div>

        {/* Article Content */}
        <div className="prose prose-lg max-w-none">
          <div dangerouslySetInnerHTML={{ __html: currentPost.content }} />
        </div>

        {/* Tags */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {currentPost.tags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Author Bio */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex items-start space-x-4">
            <img
              src={currentPost.authorImage}
              alt={currentPost.author}
              className="w-16 h-16 rounded-full object-cover"
            />
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">About {currentPost.author}</h3>
              <p className="text-gray-600">{currentPost.authorBio}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {prevPost && (
              <Link
                to={`/blog/${prevPost.id}`}
                className="group flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all"
              >
                <ChevronLeft className="h-5 w-5 text-gray-400 group-hover:text-blue-600" />
                <div>
                  <div className="text-sm text-gray-500 mb-1">Previous Post</div>
                  <div className="font-medium text-gray-900 group-hover:text-blue-600">
                    {prevPost.title}
                  </div>
                </div>
              </Link>
            )}
            
            {nextPost && (
              <Link
                to={`/blog/${nextPost.id}`}
                className="group flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all md:text-right"
              >
                <div className="flex-1">
                  <div className="text-sm text-gray-500 mb-1">Next Post</div>
                  <div className="font-medium text-gray-900 group-hover:text-blue-600">
                    {nextPost.title}
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600" />
              </Link>
            )}
          </div>
        </div>
      </article>

      <CompanyFooter />
    </div>
  );
};

export default BlogPost;
