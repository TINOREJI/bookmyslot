import { Link } from 'react-router-dom';

const EmptyState = ({ title, description, ctaText, ctaLink }) => (
  <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
    <div className="mx-auto flex justify-center">
      <div className="bg-gray-100 p-4 rounded-full">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      </div>
    </div>
    <h3 className="mt-6 text-xl font-medium text-gray-900">{title}</h3>
    <p className="mt-2 max-w-md mx-auto text-gray-600">{description}</p>
    <div className="mt-6">
      <Link
        to={ctaLink}
        className="inline-flex items-center px-5 py-2.5 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
      >
        {ctaText}
      </Link>
    </div>
  </div>
);

export default EmptyState;
