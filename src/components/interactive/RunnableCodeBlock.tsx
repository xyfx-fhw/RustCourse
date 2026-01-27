import { useState } from 'react';

interface RunnableCodeBlockProps {
  code: string;
  language?: string;
}

export default function RunnableCodeBlock({ code, language = 'rust' }: RunnableCodeBlockProps) {
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState('');
  const [showOutput, setShowOutput] = useState(false);

  const runCode = async () => {
    setIsRunning(true);
    setError('');
    setShowOutput(true);

    try {
      const response = await fetch('https://play.rust-lang.org/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          channel: 'stable',
          mode: 'debug',
          edition: '2021',
          crateType: 'bin',
          tests: false,
          code: code,
        }),
      });

      const result = await response.json();
      if (result.success) {
        setOutput(result.stdout || '(无输出)');
        setError('');
      } else {
        setError(result.stderr || '编译失败');
        setOutput('');
      }
    } catch (err) {
      setError(`网络错误: ${err instanceof Error ? err.message : String(err)}`);
      setOutput('');
    } finally {
      setIsRunning(false);
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(code);
  };

  return (
    <div className="my-6 rounded-lg overflow-hidden border border-gray-300 shadow-sm">
      {/* Code Display */}
      <div className="relative">
        <pre className="p-4 bg-gray-900 text-gray-100 overflow-x-auto m-0">
          <code className="text-sm font-mono">{code}</code>
        </pre>

        {/* Action Buttons */}
        <div className="absolute top-2 right-2 flex gap-2">
          <button
            onClick={copyCode}
            className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-white text-xs rounded transition-colors"
            title="复制代码"
          >
            📋 复制
          </button>
          {language === 'rust' && (
            <button
              onClick={runCode}
              disabled={isRunning}
              className="px-3 py-1.5 bg-green-600 hover:bg-green-500 text-white text-xs rounded transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed"
              title="运行代码"
            >
              {isRunning ? '⏳ 运行中...' : '▶ 运行'}
            </button>
          )}
        </div>
      </div>

      {/* Output Section (collapsible) */}
      {showOutput && (
        <div className="border-t border-gray-700 bg-gray-900">
          <div className="px-4 py-2 bg-gray-800 flex items-center justify-between">
            <span className="text-xs text-gray-400 font-medium">输出结果</span>
            <button
              onClick={() => setShowOutput(false)}
              className="text-gray-400 hover:text-white text-xs"
            >
              ✕ 关闭
            </button>
          </div>
          <pre className="p-4 text-sm font-mono overflow-x-auto m-0 max-h-64 overflow-y-auto">
            {error && <span className="text-red-400">{error}</span>}
            {!error && output && <span className="text-green-400">{output}</span>}
            {!error && !output && isRunning && (
              <span className="text-yellow-400">执行中...</span>
            )}
          </pre>
        </div>
      )}
    </div>
  );
}
