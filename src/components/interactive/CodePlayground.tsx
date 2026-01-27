import { useState, useEffect, useRef } from 'react';

interface CodePlaygroundProps {
  defaultCode?: string;
  className?: string;
}

const DEFAULT_CODE = `fn main() {
    println!("Hello, world!");
}`;

export default function CodePlayground({ defaultCode, className }: CodePlaygroundProps) {
  const [code, setCode] = useState(defaultCode || DEFAULT_CODE);
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // 自动调整 textarea 高度
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      // 重置高度以获取正确的 scrollHeight
      textarea.style.height = 'auto';
      // 设置为内容高度，最小 200px，最大 600px
      const newHeight = Math.max(200, Math.min(600, textarea.scrollHeight));
      textarea.style.height = `${newHeight}px`;
    }
  }, [code]);

  const runCode = async () => {
    setIsRunning(true);
    setError('');
    setOutput('');

    try {
      const response = await fetch('https://play.rust-lang.org/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          channel: 'stable',
          mode: 'debug',
          edition: '2021',
          crateType: 'bin',
          tests: false,
          code: code,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        setOutput(result.stdout || '(程序运行成功，无输出)');
      } else {
        setError(result.stderr || '编译失败');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '未知错误';
      setError(`网络错误: ${errorMessage}\n\n请检查网络连接或稍后再试。`);
    } finally {
      setIsRunning(false);
    }
  };

  const resetCode = () => {
    setCode(defaultCode || DEFAULT_CODE);
    setOutput('');
    setError('');
  };

  return (
    <div className={`flex flex-col h-full bg-white ${className || ''}`}>
      {/* Header */}
      <div className="border-b border-gray-200 p-3 bg-gray-50 flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-700">🦀 Rust 代码编辑器</h3>
        <span className="text-xs text-gray-500">Powered by Rust Playground</span>
      </div>

      {/* Code Editor */}
      <div className="overflow-auto">
        <textarea
          ref={textareaRef}
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full font-mono text-sm p-4 bg-gray-900 text-gray-100 border-none outline-none resize-none leading-relaxed"
          spellCheck={false}
          style={{ tabSize: 4 }}
          placeholder="在这里编写 Rust 代码..."
        />
      </div>

      {/* Control Bar */}
      <div className="border-t border-gray-300 p-3 bg-gray-50 flex items-center space-x-3">
        <button
          onClick={runCode}
          disabled={isRunning}
          className="bg-primary text-white px-6 py-2 rounded-lg font-medium hover:bg-primary-dark transition-all duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center space-x-2"
          title="运行代码"
        >
          <span>{isRunning ? '⏳' : '▶'}</span>
          <span>{isRunning ? '运行中...' : '运行代码'}</span>
        </button>
        <button
          onClick={resetCode}
          disabled={isRunning}
          className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-300 transition-all disabled:opacity-50"
          title="重置代码"
        >
          🔄 重置
        </button>
      </div>

      {/* Output Section */}
      <div className="h-48 bg-gray-900 text-gray-100 p-4 overflow-auto border-t border-gray-700">
        <pre className="text-sm font-mono whitespace-pre-wrap">
          {error && (
            <div className="text-red-400">
              <div className="font-bold mb-2">❌ 错误：</div>
              {error}
            </div>
          )}
          {!error && output && (
            <div className="text-green-400">
              <div className="font-bold mb-2">✅ 输出：</div>
              {output}
            </div>
          )}
          {!error && !output && !isRunning && (
            <span className="text-gray-500">💡 输出将在这里显示...</span>
          )}
          {isRunning && (
            <span className="text-yellow-400">⏳ 正在执行代码，请稍候...</span>
          )}
        </pre>
      </div>
    </div>
  );
}
