import React, { useState, useEffect, useCallback } from 'react';
import {
  Sun,
  Moon,
  Code2,
  Play,
  Download,
  Trash2,
  Maximize2,
  Minimize2,
  RefreshCw,
  Pause,
  ExternalLink,
  Layout,
  FileCode2
} from 'lucide-react';
import './App.css';

function App() {
  const [html, setHtml] = useState(localStorage.getItem('html') || '');
  const [css, setCss] = useState(localStorage.getItem('css') || '');
  const [js, setJs] = useState(localStorage.getItem('js') || '');
  const [darkMode, setDarkMode] = useState(() => {
    return JSON.parse(localStorage.getItem('darkMode') || 'false');
  });
  const [autoRun, setAutoRun] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeTab, setActiveTab] = useState('html');

  const runCode = useCallback(() => {
    const combinedOutput = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>${css}</style>
        </head>
        <body>${html}</body>
        <script>${js}</script>
      </html>
    `;
    
    const iframe = document.getElementById('preview');
    if (iframe) {
      iframe.srcdoc = combinedOutput;
    }
  }, [html, css, js]);

  useEffect(() => {
    localStorage.setItem('html', html);
    localStorage.setItem('css', css);
    localStorage.setItem('js', js);
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [html, css, js, darkMode]);

  useEffect(() => {
    if (autoRun) {
      const timeoutId = setTimeout(runCode, 1000);
      return () => clearTimeout(timeoutId);
    }
  }, [html, css, js, autoRun, runCode]);

  const toggleAutoRun = () => {
    setAutoRun(!autoRun);
    if (!autoRun) {
      runCode();
    }
  };

  const toggleDarkMode = () => setDarkMode(!darkMode);

  const toggleFullscreen = () => {
    const element = document.documentElement;
    if (!isFullscreen) {
      if (element.requestFullscreen) {
        element.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    setIsFullscreen(!isFullscreen);
  };

  const openInNewTab = () => {
    const newWindow = window.open('', '_blank');
    const combinedOutput = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>${css}</style>
        </head>
        <body>${html}</body>
        <script>${js}</script>
      </html>
    `;
    newWindow.document.write(combinedOutput);
    newWindow.document.close();
  };

  const clearCode = () => {
    if (window.confirm('Are you sure you want to clear all code?')) {
      setHtml('');
      setCss('');
      setJs('');
    }
  };

  return (
    <div className={`App ${darkMode ? 'dark-mode' : ''}`}>
      <nav className="navbar">
        <div className="logo-section">
          <Code2 size={24} />
          <h1>Code Editor </h1>
        </div>
        <div className="toolbar">
          <button 
            onClick={toggleAutoRun} 
            className={`icon-button ${autoRun ? 'active' : ''}`} 
            title={autoRun ? 'Auto-run Enabled' : 'Auto-run Disabled'}
          >
            {autoRun ? <RefreshCw size={18} /> : <Pause size={18} />}
          </button>
          <button onClick={toggleFullscreen} className="icon-button" title="Toggle Fullscreen">
            {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
          </button>
          <button onClick={toggleDarkMode} className="icon-button" title="Toggle Theme">
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </nav>
      
      <div className="sub-navbar">
        <div className="tab-buttons">
          <button 
            className={`tab-button ${activeTab === 'html' ? 'active' : ''}`}
            onClick={() => setActiveTab('html')}
          >
            <FileCode2 size={16} />
            HTML
          </button>
          <button 
            className={`tab-button ${activeTab === 'css' ? 'active' : ''}`}
            onClick={() => setActiveTab('css')}
          >
            <Layout size={16} />
            CSS
          </button>
          <button 
            className={`tab-button ${activeTab === 'js' ? 'active' : ''}`}
            onClick={() => setActiveTab('js')}
          >
            <Code2 size={16} />
            JavaScript
          </button>
        </div>
        <div className="action-buttons">
          <button onClick={clearCode} className="action-button danger">
            <Trash2 size={16} />
            Clear
          </button>
        </div>
      </div>

      <div className="main-container">
        <div className={`editor-panel ${activeTab === 'html' ? 'active' : ''}`}>
          <div className="editor-content">
            <div className="editor-header">
              <FileCode2 size={16} />
              <h3>HTML</h3>
            </div>
            <textarea
              value={html}
              onChange={(e) => setHtml(e.target.value)}
              placeholder="Enter HTML code..."
              spellCheck="false"
            />
          </div>
        </div>

        <div className={`editor-panel ${activeTab === 'css' ? 'active' : ''}`}>
          <div className="editor-content">
            <div className="editor-header">
              <Layout size={16} />
              <h3>CSS</h3>
            </div>
            <textarea
              value={css}
              onChange={(e) => setCss(e.target.value)}
              placeholder="Enter CSS code..."
              spellCheck="false"
            />
          </div>
        </div>

        <div className={`editor-panel ${activeTab === 'js' ? 'active' : ''}`}>
          <div className="editor-content">
            <div className="editor-header">
              <Code2 size={16} />
              <h3>JavaScript</h3>
            </div>
            <textarea
              value={js}
              onChange={(e) => setJs(e.target.value)}
              placeholder="Enter JavaScript code..."
              spellCheck="false"
            />
          </div>
        </div>

        <div className="preview-container">
          <div className="preview-header">
            <h2>Preview</h2>
            <div className="preview-actions">
              <button 
                onClick={runCode} 
                className="run-button"
                disabled={autoRun}
              >
                <Play size={16} />
                Run Code
              </button>
              <button onClick={openInNewTab} className="preview-button">
                <ExternalLink size={16} />
                Open Preview
              </button>
            </div>
          </div>
          <iframe id="preview" title="preview" sandbox="allow-scripts" />
        </div>
      </div>
    </div>
  );
}

export default App;
