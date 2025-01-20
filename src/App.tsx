import React, { useState } from 'react';
import { Upload, X } from 'lucide-react';
import { convertCSVToSQL } from './utils/converter';

function App() {
  const [sqlOutput, setSqlOutput] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();

    reader.onload = async (e) => {
      const text = e.target?.result as string;
      const sql = convertCSVToSQL(text);
      setSqlOutput(sql);
    };

    reader.readAsText(file);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(sqlOutput);
  };

  const handleDownload = () => {
    const blob = new Blob([sqlOutput], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'update_script.sql';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const handleClear = () => {
    setSqlOutput('');
    setFileName('');
    // Reset the file input
    const fileInput = document.getElementById(
      'file-upload'
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            CSV to SQL Converter
          </h1>
          <p className="text-gray-600">
            Converta o arquivo CSV em um script de UPDATE SQL
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="cursor-pointer flex flex-col items-center"
            >
              <Upload className="h-12 w-12 text-gray-400 mb-3" />
              <span className="text-gray-600">
                {fileName || 'Click para fazer o upload do seu Arquivo CSV'}
              </span>
              <span className="text-sm text-gray-500 mt-1">
                Somente arquivos .csv são suportados
              </span>
            </label>
          </div>
          {fileName && (
            <div className="mt-4 flex justify-center">
              <button
                onClick={handleClear}
                className="flex items-center px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-md text-sm"
              >
                <X className="h-4 w-4 mr-2" />
                Remover arquivo CSV
              </button>
            </div>
          )}
        </div>

        {sqlOutput && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Arquivo SQL Gerado
              </h2>
              <div className="space-x-2">
                <button
                  onClick={handleCopy}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md text-sm"
                >
                  Copiar
                </button>
                <button
                  onClick={handleDownload}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm"
                >
                  Baixar Arquivo SQL
                </button>
              </div>
            </div>
            <pre className="bg-gray-50 p-4 rounded-md overflow-x-auto">
              <code className="text-sm text-gray-800">{sqlOutput}</code>
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
