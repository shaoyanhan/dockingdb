import { useParams, Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const ResultPage = () => {
  const { moleculeId } = useParams();
  
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-green-700 mb-6">
            {moleculeId} 分子详情
          </h1>
          
          <div className="mb-8 bg-gray-50 p-6 rounded-md">
            <p className="text-gray-700 mb-4">
              这是 <span className="font-bold text-green-700">{moleculeId}</span> 分子的详细信息页面。
              在实际应用中，这里会展示该分子的3D结构、属性和相关文献等信息。
            </p>
          </div>
          
          <Link 
            to="/" 
            className="inline-block bg-green-700 text-white px-6 py-3 rounded-md hover:bg-green-800 transition-colors"
          >
            返回首页
          </Link>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ResultPage; 