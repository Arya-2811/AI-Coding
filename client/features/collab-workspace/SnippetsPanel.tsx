import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/services/auth-context";
import { health, getJSON } from "@/services/api-client";
import { Sparkles, Wand2, Code, Lightbulb, Copy, RefreshCw } from "lucide-react";

interface Snippet { id: string; content: string; language: string; tags: string[]; authorId: string; createdAt: number }

interface AISnippet {
  id: string;
  title: string;
  content: string;
  language: string;
  tags: string[];
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export default function SnippetsPanel() {
  const { token } = useAuth();
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [q, setQ] = useState("");
  const [content, setContent] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [tags, setTags] = useState("");
  const [online, setOnline] = useState<boolean | null>(null);
  
  // AI Features
  const [aiSnippets, setAiSnippets] = useState<AISnippet[]>([]);
  const [showAI, setShowAI] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  async function load() {
    if (!(await health())) { setOnline(false); return; }
    setOnline(true);
    const data = await getJSON<{ snippets: Snippet[] }>(`/api/snippets?q=${encodeURIComponent(q)}`);
    if (data) setSnippets(data.snippets);
  }
  useEffect(() => { load(); }, [q]);
  useEffect(() => { const t = setInterval(load, 6000); return () => clearInterval(t); }, []);

  async function create() {
    const headers: any = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;
    const res = await fetch("/api/snippets", { method: "POST", headers, body: JSON.stringify({ content, language, tags: tags.split(",").map(t => t.trim()).filter(Boolean) }) });
    if (res.ok) { setContent(""); setTags(""); await load(); }
  }

  // AI-powered snippet generation
  async function generateAISnippet() {
    if (!aiPrompt.trim()) return;
    
    setIsGenerating(true);
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: `Generate a ${language} code snippet for: ${aiPrompt}. Return only the code without explanations.` 
        })
      });
      
      const data = await response.json();
      if (data.answer) {
        // Clean up the AI response to extract just the code
        let code = data.answer.replace(/```[\w]*\n?/g, '').replace(/```/g, '').trim();
        setContent(code);
        setTags(aiPrompt.split(' ').slice(0, 3).join(', '));
        setAiPrompt("");
      }
    } catch (error) {
      console.error('AI generation failed:', error);
    } finally {
      setIsGenerating(false);
    }
  }

  // Curated AI snippets database
  const curatedSnippets: AISnippet[] = [
    {
      id: '1',
      title: 'React useState Hook',
      content: `const [count, setCount] = useState(0);

const increment = () => {
  setCount(prev => prev + 1);
};

return (
  <div>
    <p>Count: {count}</p>
    <button onClick={increment}>+</button>
  </div>
);`,
      language: 'javascript',
      tags: ['react', 'hooks', 'state'],
      description: 'Basic React state management with useState hook',
      difficulty: 'beginner'
    },
    {
      id: '2',
      title: 'Python List Comprehension',
      content: `# Filter and transform data
numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

# Get squares of even numbers
even_squares = [x**2 for x in numbers if x % 2 == 0]
print(even_squares)  # [4, 16, 36, 64, 100]

# Nested comprehension
matrix = [[j for j in range(3)] for i in range(3)]
print(matrix)  # [[0, 1, 2], [0, 1, 2], [0, 1, 2]]`,
      language: 'python',
      tags: ['python', 'comprehension', 'functional'],
      description: 'Efficient data filtering and transformation',
      difficulty: 'intermediate'
    },
    {
      id: '3',
      title: 'JavaScript Async/Await',
      content: `async function fetchUserData(userId) {
  try {
    const response = await fetch(\`/api/users/\${userId}\`);
    
    if (!response.ok) {
      throw new Error(\`HTTP error! status: \${response.status}\`);
    }
    
    const userData = await response.json();
    return userData;
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw error;
  }
}

// Usage
fetchUserData(123)
  .then(user => console.log(user))
  .catch(err => console.error(err));`,
      language: 'javascript',
      tags: ['async', 'fetch', 'api'],
      description: 'Modern async data fetching with error handling',
      difficulty: 'intermediate'
    },
    {
      id: '4',
      title: 'Docker Multi-stage Build',
      content: `# Multi-stage build for Node.js app
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM node:18-alpine AS runtime
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY . .
EXPOSE 3000
USER node
CMD ["npm", "start"]`,
      language: 'dockerfile',
      tags: ['docker', 'optimization', 'security'],
      description: 'Optimized Docker build with security best practices',
      difficulty: 'advanced'
    },
    {
      id: '5',
      title: 'CSS Grid Layout',
      content: `.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  grid-gap: 1rem;
  padding: 1rem;
}

.grid-item {
  background: #f0f0f0;
  padding: 1rem;
  border-radius: 8px;
  transition: transform 0.2s ease;
}

.grid-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

/* Responsive breakpoints */
@media (max-width: 768px) {
  .grid-container {
    grid-template-columns: 1fr;
  }
}`,
      language: 'css',
      tags: ['css', 'grid', 'responsive'],
      description: 'Responsive grid layout with hover effects',
      difficulty: 'intermediate'
    }
  ];

  // Filter AI snippets based on language and category
  const filteredAISnippets = useMemo(() => {
    let filtered = curatedSnippets;
    
    if (language !== 'all' && selectedCategory !== 'all') {
      filtered = filtered.filter(s => s.language === language);
    }
    
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(s => s.difficulty === selectedCategory);
    }
    
    if (q) {
      filtered = filtered.filter(s => 
        s.title.toLowerCase().includes(q.toLowerCase()) ||
        s.tags.some(tag => tag.toLowerCase().includes(q.toLowerCase())) ||
        s.description.toLowerCase().includes(q.toLowerCase())
      );
    }
    
    return filtered;
  }, [language, selectedCategory, q]);

  function copyToEditor(snippet: AISnippet) {
    setContent(snippet.content);
    setLanguage(snippet.language);
    setTags(snippet.tags.join(', '));
  }

  // Initialize AI snippets
  useEffect(() => {
    setAiSnippets(curatedSnippets);
  }, []);

  return (
    <div className="rounded-lg border p-4">
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div>
            <h3 className="font-semibold flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              AI-Powered Snippets
            </h3>
            <p className="text-sm text-foreground/70">Generate, discover, and share intelligent code snippets</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setShowAI(!showAI)}
            className={`px-3 py-1 text-xs rounded-full transition-colors ${
              showAI ? 'bg-primary text-primary-foreground' : 'bg-secondary text-foreground'
            }`}
          >
            <Wand2 className="w-3 h-3 mr-1 inline" />
            AI Mode
          </button>
          <input 
            className="rounded-md border px-3 py-2 w-48" 
            placeholder="Search snippets..." 
            value={q} 
            onChange={(e) => setQ(e.target.value)} 
          />
        </div>
      </div>

      {online === false && <p className="text-sm text-foreground/60 mb-3">Backend offline. Retrying…</p>}

      {/* AI Generation Section */}
      {showAI && (
        <div className="mb-4 p-3 bg-gradient-to-r from-primary/5 to-indigo-200/20 rounded-lg border border-primary/20">
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb className="w-4 h-4 text-primary" />
            <h4 className="font-medium text-sm">AI Code Generator</h4>
          </div>
          <div className="flex gap-2">
            <input
              className="flex-1 rounded-md border px-3 py-2 text-sm"
              placeholder="Describe what you want to code... (e.g., 'sort array by date', 'fetch API with error handling')"
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && generateAISnippet()}
            />
            <button
              onClick={generateAISnippet}
              disabled={!aiPrompt.trim() || isGenerating}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm disabled:opacity-50 flex items-center gap-1"
            >
              {isGenerating ? (
                <RefreshCw className="w-3 h-3 animate-spin" />
              ) : (
                <Wand2 className="w-3 h-3" />
              )}
              Generate
            </button>
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-4">
        {/* Editor Section */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-2">
            <Code className="w-4 h-4" />
            <h4 className="font-medium text-sm">Create Snippet</h4>
          </div>
          <textarea 
            className="w-full h-32 border rounded-md p-3 font-mono text-sm focus:ring-2 focus:ring-primary/40 focus:border-primary" 
            placeholder="Write or paste your code here..." 
            value={content} 
            onChange={(e) => setContent(e.target.value)} 
          />
          <div className="flex gap-2">
            <select 
              className="rounded-md border px-3 py-2 text-sm" 
              value={language} 
              onChange={(e) => setLanguage(e.target.value)}
            >
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="cpp">C++</option>
              <option value="java">Java</option>
              <option value="css">CSS</option>
              <option value="dockerfile">Docker</option>
            </select>
            <input 
              className="flex-1 rounded-md border px-3 py-2 text-sm" 
              placeholder="Tags (comma separated)" 
              value={tags} 
              onChange={(e) => setTags(e.target.value)} 
            />
            <button 
              onClick={create} 
              disabled={!content.trim()}
              className="rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm disabled:opacity-50 hover:bg-primary/90 transition-colors"
            >
              Share
            </button>
          </div>
        </div>

        {/* Snippets Display */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-sm flex items-center gap-2">
              {showAI ? (
                <>
                  <Sparkles className="w-4 h-4 text-primary" />
                  AI Curated Snippets
                </>
              ) : (
                <>Community Snippets</>
              )}
            </h4>
            {showAI && (
              <select 
                className="text-xs border rounded px-2 py-1" 
                value={selectedCategory} 
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="all">All Levels</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            )}
          </div>

          <div className="max-h-64 overflow-auto space-y-2">
            {showAI ? (
              // AI Curated Snippets
              filteredAISnippets.length > 0 ? (
                filteredAISnippets.map((snippet) => (
                  <div key={snippet.id} className="p-3 border rounded-lg hover:bg-secondary/30 transition-colors group">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h5 className="font-medium text-sm">{snippet.title}</h5>
                        <p className="text-xs text-foreground/60">{snippet.description}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          snippet.difficulty === 'beginner' ? 'bg-green-100 text-green-700' :
                          snippet.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {snippet.difficulty}
                        </span>
                        <button
                          onClick={() => copyToEditor(snippet)}
                          className="opacity-0 group-hover:opacity-100 p-1 hover:bg-primary/10 rounded transition-all"
                          title="Copy to editor"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs bg-secondary px-2 py-1 rounded">{snippet.language}</span>
                      <div className="flex gap-1">
                        {snippet.tags.map(tag => (
                          <span key={tag} className="text-xs text-primary bg-primary/10 px-2 py-1 rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <pre className="text-xs font-mono bg-secondary/30 p-2 rounded overflow-x-auto max-h-20 overflow-y-auto">
                      {snippet.content.length > 150 ? snippet.content.substring(0, 150) + '...' : snippet.content}
                    </pre>
                  </div>
                ))
              ) : (
                <p className="text-sm text-foreground/60 text-center py-4">No AI snippets match your criteria</p>
              )
            ) : (
              // Community Snippets
              snippets.length > 0 ? (
                snippets.map((s) => (
                  <div key={s.id} className="p-3 border rounded-lg">
                    <div className="text-xs text-foreground/60 mb-1">
                      {new Date(s.createdAt).toLocaleString()} • {s.language} • {s.tags.join(", ")}
                    </div>
                    <pre className="whitespace-pre-wrap font-mono text-sm">{s.content}</pre>
                  </div>
                ))
              ) : (
                <p className="text-sm text-foreground/60 text-center py-4">No community snippets yet.</p>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
