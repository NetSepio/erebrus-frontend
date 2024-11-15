import { useState } from 'react';
import axios from 'axios';

// Create axios instance with custom config
const api = axios.create({
  baseURL: 'https://35.227.177.48:8443',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  timeout: 300000, // 5 minutes
  // For development only - remove in production
  httpsAgent: new (require('https').Agent)({  
    rejectUnauthorized: false
  })
});

export default function DeploymentForm() {
  const [formData, setFormData] = useState({
    project_name: '',
    git_url: '',
    env_vars: ''
  });
  const [deployedUrl, setDeployedUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setDeployedUrl(null);
    
    try {
      // Parse environment variables
      const envVars = formData.env_vars
        .split('\n')
        .filter(line => line.trim())
        .reduce((acc, line) => {
          const [key, ...values] = line.split('=');
          if (key && values.length > 0) {
            acc[key.trim()] = values.join('=').trim();
          }
          return acc;
        }, {} as Record<string, string>);

      // Make the API call
      const response = await api.post('/deploy', {
        git_url: formData.git_url,
        project_name: formData.project_name,
        port: "3000",
        env_vars: envVars
      });
      
      if (response.data.status === 'success') {
        // Use the URL from the response directly
        setDeployedUrl(response.data.url);
      } else {
        throw new Error(response.data.error || 'Deployment failed');
      }
    } catch (err) {
      console.error('Deployment failed:', err);
      setError(
        err.response?.data?.error || 
        err.message || 
        'Failed to deploy. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Deploy Project</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-white text-sm font-medium mb-1">
            Project Name
          </label>
          <input
            type="text"
            value={formData.project_name}
            onChange={(e) => setFormData(prev => ({...prev, project_name: e.target.value}))}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
            required
            pattern="[a-z0-9-]+"
            title="Only lowercase letters, numbers, and hyphens are allowed"
          />
        </div>

        <div>
          <label className="block text-white text-sm font-medium mb-1">
            GitHub URL
          </label>
          <input
            type="url"
            value={formData.git_url}
            onChange={(e) => setFormData(prev => ({...prev, git_url: e.target.value}))}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
            required
            pattern="https://github\.com/.*"
            title="Must be a valid GitHub URL"
          />
        </div>

        <div>
          <label className="block text-white text-sm font-medium mb-1">
            Environment Variables (optional)
          </label>
          <textarea
            value={formData.env_vars}
            onChange={(e) => setFormData(prev => ({...prev, env_vars: e.target.value}))}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
            placeholder="KEY=value&#10;ANOTHER_KEY=another_value"
            rows={4}
          />
          <p className="text-sm text-gray-400 mt-1">
            One variable per line in KEY=value format
          </p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 px-4 rounded transition-colors ${
            loading 
              ? 'bg-blue-300 cursor-not-allowed' 
              : 'bg-blue-500 hover:bg-blue-600'
          } text-white`}
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Deploying...
            </span>
          ) : 'Deploy'}
        </button>
      </form>

      {error && (
        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded">
          <h2 className="text-lg font-medium text-red-800 mb-2">Deployment Failed</h2>
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {deployedUrl && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded">
          <h2 className="text-lg font-medium text-green-800 mb-2">Deployment Successful!</h2>
          <p className="mb-2 text-gray-600">Your application has been deployed successfully.</p>
          <a 
            href={deployedUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline break-all flex items-center"
          >
            {deployedUrl}
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      )}
    </div>
  );
}