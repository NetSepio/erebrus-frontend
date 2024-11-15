import { useState } from 'react';
import axios from 'axios';

export default function DeploymentForm() {
  const [formData, setFormData] = useState({
    project_name: '',
    git_url: '',
    env_vars: ''
  });
  const [deployedUrl, setDeployedUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const envLines = formData.env_vars.split('\n').filter(line => line.trim());
      const filteredEnvVars = Object.fromEntries(
        envLines.map(line => {
          const [key, value] = line.split('=');
          return [key.trim(), value.trim()];
        })
      );

      const response = await axios.post('https://35.227.177.48:8443/deploy', {
        git_url: formData.git_url,
        project_name: formData.project_name,
        port: "3000",
        env_vars: filteredEnvVars
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        timeout: 300000,
      });
      
      const deployedPort = response.data.port || "3000";
      const formattedUrl = `https://35.227.177.48:${deployedPort}`;
      setDeployedUrl(formattedUrl);
    } catch (error) {
      console.error('Deployment failed:', error);
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
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:bg-blue-300"
        >
          {loading ? 'Deploying...' : 'Deploy'}
        </button>
      </form>

      {deployedUrl && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded">
          <h2 className="text-lg font-medium text-green-800 mb-2">Deployment Successful!</h2>
          <a 
            href={deployedUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline break-all"
          >
            {deployedUrl}
          </a>
        </div>
      )}
    </div>
  );
}