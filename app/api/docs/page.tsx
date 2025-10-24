'use client'
import React, { useState } from 'react';
import { FileText, Code, Layers, Database, Settings, CheckCircle, XCircle, Menu, X, ChevronRight, Copy, Check } from 'lucide-react';

const ApiDocumentation = () => {
  const [activeSection, setActiveSection] = useState('introduction');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [copiedCode, setCopiedCode] = useState('');

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(''), 2000);
  };

  const CodeBlock = ({ code, language = 'typescript', id }) => (
    <div className="relative group">
      <div className="absolute top-2 right-2 flex items-center gap-2">
        <span className="text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded">{language}</span>
        <button
          onClick={() => copyToClipboard(code, id)}
          className="p-2 bg-gray-800 hover:bg-gray-700 rounded transition-colors"
        >
          {copiedCode === id ? (
            <Check className="w-4 h-4 text-green-400" />
          ) : (
            <Copy className="w-4 h-4 text-gray-400" />
          )}
        </button>
      </div>
      <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
        <code>{code}</code>
      </pre>
    </div>
  );

  const navigation = [
    { id: 'introduction', label: 'Introduction', icon: FileText },
    { id: 'quickstart', label: 'Quick Start', icon: CheckCircle },
    { id: 'authentication', label: 'Authentication', icon: Settings },
    { id: 'endpoints', label: 'API Endpoints', icon: Layers },
    { id: 'examples', label: 'Code Examples', icon: Code },
    { id: 'errors', label: 'Error Handling', icon: XCircle },
  ];

  const endpoints = [
    {
      method: 'POST',
      path: '/api/v1/generate-questions',
      description: 'Generate clarifying questions based on project description',
      params: ['description', 'api_key', 'model_name'],
      response: { session_id: 'string', questions: 'array', project_description: 'string' }
    },
    {
      method: 'POST',
      path: '/api/v1/generate-detailed-prompt',
      description: 'Generate detailed database design from answers',
      params: ['session_id', 'answers'],
      response: { session_id: 'string', detailed_prompt: 'string', tables: 'array' }
    },
    {
      method: 'POST',
      path: '/api/v1/generate-table-schema',
      description: 'Generate SQL schema for a specific table',
      params: ['session_id', 'table_name'],
      response: { table_name: 'string', sql_schema: 'string' }
    },
    {
      method: 'POST',
      path: '/api/v1/generate-database-code',
      description: 'Generate ORM code for specified language and framework',
      params: ['session_id', 'language', 'framework', 'include_models', 'include_migrations', 'include_repositories'],
      response: { session_id: 'string', language: 'string', framework: 'string', code: 'object' }
    },
    {
      method: 'GET',
      path: '/api/v1/supported-languages',
      description: 'Get list of supported languages and frameworks',
      params: [],
      response: { languages: 'object' }
    },
    {
      method: 'GET',
      path: '/api/v1/sessions',
      description: 'List all active sessions',
      params: [],
      response: { sessions: 'array', count: 'number' }
    },
    {
      method: 'GET',
      path: '/api/v1/session/:session_id',
      description: 'Get session details',
      params: ['session_id (path)'],
      response: { session: 'object' }
    },
    {
      method: 'DELETE',
      path: '/api/v1/session/:session_id',
      description: 'Delete a session',
      params: ['session_id (path)'],
      response: { message: 'string' }
    },
    {
      method: 'GET',
      path: '/api/v1/health',
      description: 'Health check endpoint',
      params: [],
      response: { status: 'string' }
    },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'introduction':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">API Documentation</h1>
              <p className="text-lg text-gray-600">
                Welcome to the Database Schema Generator API. This API helps you design and generate database schemas, 
                table definitions, and ORM code across multiple languages and frameworks.
              </p>
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
              <h3 className="font-semibold text-blue-900 mb-2">What can you do with this API?</h3>
              <ul className="list-disc list-inside text-blue-800 space-y-1">
                <li>Generate database designs from natural language descriptions</li>
                <li>Create SQL schemas for individual tables</li>
                <li>Generate ORM code for 8+ languages (Python, TypeScript, Java, Go, etc.)</li>
                <li>Manage sessions for multi-step workflows</li>
              </ul>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <Database className="w-8 h-8 text-indigo-600 mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">Multi-Framework Support</h3>
                <p className="text-gray-600 text-sm">
                  Supports 25+ frameworks including SQLAlchemy, Prisma, TypeORM, Spring Data JPA, GORM, and more.
                </p>
              </div>
              <div className="border border-gray-200 rounded-lg p-4">
                <Layers className="w-8 h-8 text-indigo-600 mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">Session-Based Workflow</h3>
                <p className="text-gray-600 text-sm">
                  Maintain context across multiple API calls with session management.
                </p>
              </div>
            </div>
          </div>
        );

      case 'quickstart':
        return (
          <div className="space-y-6">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Quick Start</h1>
            
            <div className="space-y-4">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-3">1. Generate Questions</h2>
                <p className="text-gray-600 mb-3">Start by providing a project description to get clarifying questions:</p>
                <CodeBlock 
                  id="quickstart-1"
                  language="bash"
                  code={`curl -X POST https://your-api.com/api/v1/generate-questions \\
  -H "Content-Type: application/json" \\
  -d '{
    "description": "I need a blog platform with users, posts, and comments",
    "api_key": "your-gemini-api-key",
    "model_name": "gemini-2.5-flash"
  }'`}
                />
              </div>

              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-3">2. Submit Answers</h2>
                <p className="text-gray-600 mb-3">Answer the questions to generate a detailed design:</p>
                <CodeBlock 
                  id="quickstart-2"
                  language="bash"
                  code={`curl -X POST https://your-api.com/api/v1/generate-detailed-prompt \\
  -H "Content-Type: application/json" \\
  -d '{
    "session_id": "session_abc123",
    "answers": {
      "user_roles": "Admin, Editor, Viewer",
      "post_types": "Article, Video, Tutorial"
    }
  }'`}
                />
              </div>

              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-3">3. Generate Table Schemas</h2>
                <CodeBlock 
                  id="quickstart-3"
                  language="bash"
                  code={`curl -X POST https://your-api.com/api/v1/generate-table-schema \\
  -H "Content-Type: application/json" \\
  -d '{
    "session_id": "session_abc123",
    "table_name": "users"
  }'`}
                />
              </div>

              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-3">4. Generate ORM Code</h2>
                <CodeBlock 
                  id="quickstart-4"
                  language="bash"
                  code={`curl -X POST https://your-api.com/api/v1/generate-database-code \\
  -H "Content-Type: application/json" \\
  -d '{
    "session_id": "session_abc123",
    "language": "python",
    "framework": "sqlalchemy",
    "include_models": true,
    "include_migrations": true,
    "include_repositories": false
  }'`}
                />
              </div>
            </div>
          </div>
        );

      case 'authentication':
        return (
          <div className="space-y-6">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Authentication</h1>
            
            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
              <p className="text-yellow-800">
                <strong>Important:</strong> This API uses Google Gemini API for AI-powered generation. 
                You need a valid Gemini API key.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">Getting Your API Key</h2>
              <ol className="list-decimal list-inside space-y-2 text-gray-600">
                <li>Visit <a href="https://makersuite.google.com/app/apikey" className="text-indigo-600 hover:underline">Google AI Studio</a></li>
                <li>Sign in with your Google account</li>
                <li>Create a new API key</li>
                <li>Copy the key and use it in your requests</li>
              </ol>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">Using the API Key</h2>
              <p className="text-gray-600 mb-3">Pass your API key in the request body:</p>
              <CodeBlock 
                id="auth-1"
                language="json"
                code={`{
  "description": "Your project description",
  "api_key": "AIzaSyD...",
  "model_name": "gemini-2.5-flash"
}`}
              />
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">Supported Models</h2>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                <li><code className="bg-gray-100 px-2 py-1 rounded">gemini-2.5-flash</code> - Fast, efficient (default)</li>
                <li><code className="bg-gray-100 px-2 py-1 rounded">gemini-2.0-pro</code> - More capable, slower</li>
                <li><code className="bg-gray-100 px-2 py-1 rounded">gemini-1.5-pro</code> - Production-ready</li>
              </ul>
            </div>
          </div>
        );

      case 'endpoints':
        return (
          <div className="space-y-6">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">API Endpoints</h1>
            
            <div className="space-y-6">
              {endpoints.map((endpoint, idx) => (
                <div key={idx} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        endpoint.method === 'GET' ? 'bg-green-100 text-green-700' :
                        endpoint.method === 'POST' ? 'bg-blue-100 text-blue-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {endpoint.method}
                      </span>
                      <code className="text-sm font-mono text-gray-800">{endpoint.path}</code>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-4">{endpoint.description}</p>
                  
                  {endpoint.params.length > 0 && (
                    <div className="mb-3">
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">Parameters:</h4>
                      <div className="flex flex-wrap gap-2">
                        {endpoint.params.map((param, i) => (
                          <code key={i} className="bg-gray-100 px-2 py-1 rounded text-xs">
                            {param}
                          </code>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Response:</h4>
                    <CodeBlock 
                      id={`endpoint-${idx}`}
                      language="json"
                      code={JSON.stringify(endpoint.response, null, 2)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'examples':
        return (
          <div className="space-y-6">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Code Examples</h1>
            
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-3">JavaScript/TypeScript</h2>
                <CodeBlock 
                  id="example-js"
                  language="typescript"
                  code={`async function generateDatabaseDesign() {
  // Step 1: Generate questions
  const questionsResponse = await fetch('/api/v1/generate-questions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      description: 'E-commerce platform with products, orders, and customers',
      api_key: process.env.GEMINI_API_KEY,
      model_name: 'gemini-2.5-flash'
    })
  });
  
  const { session_id, questions } = await questionsResponse.json();
  
  // Step 2: Answer questions and generate design
  const designResponse = await fetch('/api/v1/generate-detailed-prompt', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      session_id,
      answers: {
        'payment_methods': 'Credit Card, PayPal, Stripe',
        'shipping_options': 'Standard, Express, Overnight'
      }
    })
  });
  
  const { tables } = await designResponse.json();
  
  // Step 3: Generate schema for each table
  for (const table of tables) {
    await fetch('/api/v1/generate-table-schema', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        session_id,
        table_name: table.table_name
      })
    });
  }
  
  // Step 4: Generate TypeORM code
  const codeResponse = await fetch('/api/v1/generate-database-code', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      session_id,
      language: 'typescript',
      framework: 'typeorm',
      include_models: true,
      include_migrations: true,
      include_repositories: true
    })
  });
  
  return await codeResponse.json();
}`}
                />
              </div>

              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-3">Python</h2>
                <CodeBlock 
                  id="example-python"
                  language="python"
                  code={`import requests

def generate_database_design():
    base_url = "https://your-api.com/api/v1"
    
    # Step 1: Generate questions
    response = requests.post(
        f"{base_url}/generate-questions",
        json={
            "description": "Task management system with projects and teams",
            "api_key": os.getenv("GEMINI_API_KEY"),
            "model_name": "gemini-2.5-flash"
        }
    )
    data = response.json()
    session_id = data["session_id"]
    
    # Step 2: Submit answers
    response = requests.post(
        f"{base_url}/generate-detailed-prompt",
        json={
            "session_id": session_id,
            "answers": {
                "user_permissions": "Owner, Admin, Member, Guest",
                "task_priorities": "Low, Medium, High, Critical"
            }
        }
    )
    tables = response.json()["tables"]
    
    # Step 3: Generate SQLAlchemy code
    response = requests.post(
        f"{base_url}/generate-database-code",
        json={
            "session_id": session_id,
            "language": "python",
            "framework": "sqlalchemy",
            "include_models": True,
            "include_migrations": True,
            "include_repositories": False
        }
    )
    
    return response.json()`}
                />
              </div>

              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-3">cURL</h2>
                <CodeBlock 
                  id="example-curl"
                  language="bash"
                  code={`# Complete workflow example
SESSION_ID=$(curl -s -X POST https://your-api.com/api/v1/generate-questions \\
  -H "Content-Type: application/json" \\
  -d '{
    "description": "Social media platform with posts, likes, and follows",
    "api_key": "your-api-key"
  }' | jq -r '.session_id')

curl -X POST https://your-api.com/api/v1/generate-detailed-prompt \\
  -H "Content-Type: application/json" \\
  -d "{
    \\"session_id\\": \\"$SESSION_ID\\",
    \\"answers\\": {
      \\"content_types\\": \\"Text, Image, Video\\",
      \\"privacy_levels\\": \\"Public, Friends, Private\\"
    }
  }"

curl -X POST https://your-api.com/api/v1/generate-database-code \\
  -H "Content-Type: application/json" \\
  -d "{
    \\"session_id\\": \\"$SESSION_ID\\",
    \\"language\\": \\"go\\",
    \\"framework\\": \\"gorm\\",
    \\"include_models\\": true,
    \\"include_migrations\\": true,
    \\"include_repositories\\": true
  }"`}
                />
              </div>
            </div>
          </div>
        );

      case 'errors':
        return (
          <div className="space-y-6">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Error Handling</h1>
            
            <div className="space-y-4">
              <div className="border border-red-200 rounded-lg p-4 bg-red-50">
                <h3 className="font-semibold text-red-900 mb-2">400 - Bad Request</h3>
                <p className="text-red-700 text-sm mb-2">Missing required parameters or invalid input</p>
                <CodeBlock 
                  id="error-400"
                  language="json"
                  code={`{
  "error": "Missing description or api_key"
}`}
                />
              </div>

              <div className="border border-yellow-200 rounded-lg p-4 bg-yellow-50">
                <h3 className="font-semibold text-yellow-900 mb-2">404 - Not Found</h3>
                <p className="text-yellow-700 text-sm mb-2">Session or resource not found</p>
                <CodeBlock 
                  id="error-404"
                  language="json"
                  code={`{
  "error": "Session not found"
}`}
                />
              </div>

              <div className="border border-purple-200 rounded-lg p-4 bg-purple-50">
                <h3 className="font-semibold text-purple-900 mb-2">500 - Internal Server Error</h3>
                <p className="text-purple-700 text-sm mb-2">Server-side error or API failure</p>
                <CodeBlock 
                  id="error-500"
                  language="json"
                  code={`{
  "error": "Failed to generate schema: API timeout"
}`}
                />
              </div>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Best Practices</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                <li>Always validate your API key before making requests</li>
                <li>Implement retry logic for 500 errors with exponential backoff</li>
                <li>Store session IDs securely for multi-step workflows</li>
                <li>Check session existence before making dependent calls</li>
                <li>Handle network timeouts gracefully (Gemini API can take 10-30s)</li>
                <li>Clean up sessions when workflow is complete</li>
              </ul>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <Database className="w-8 h-8 text-indigo-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Schema Generator API</h1>
                <p className="text-xs text-gray-500">v1.0.0</p>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className={`${sidebarOpen ? 'block' : 'hidden'} lg:block w-64 flex-shrink-0`}>
            <nav className="sticky top-24 space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveSection(item.id);
                      if (window.innerWidth < 1024) setSidebarOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg text-left transition-colors ${
                      activeSection === item.id
                        ? 'bg-indigo-50 text-indigo-700 font-medium'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                    {activeSection === item.id && (
                      <ChevronRight className="w-4 h-4 ml-auto" />
                    )}
                  </button>
                );
              })}
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              {renderContent()}
            </div>
          </main>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-600 text-sm">
              © 2025 Schema Generator API. Built with Next.js and Google Gemini.
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-gray-600 hover:text-indigo-600 text-sm">GitHub</a>
              <a href="#" className="text-gray-600 hover:text-indigo-600 text-sm">Support</a>
              <a href="#" className="text-gray-600 hover:text-indigo-600 text-sm">API Status</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ApiDocumentation;