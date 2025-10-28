'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';

// Componente para o usuário comum
export default function MyDocumentsPage() {
  const { user } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [docType, setDocType] = useState('Atestado Médico');
  const [uploading, setUploading] = useState(false);

  // Simulação de documentos do usuário
  const userDocuments = [
    { id: 1, name: 'Contrato de Trabalho', status: 'OK', date: '2023-01-15', file: 'contrato.pdf' },
    { id: 2, name: 'Exame Admissional (ASO)', status: 'Vence em 3 meses', date: '2024-10-20', file: 'aso.pdf' },
    { id: 3, name: 'Comprovante de Residência', status: 'Pendente', date: 'N/A', file: null },
  ];

  const handleFileUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      alert('Selecione um arquivo para upload.');
      return;
    }
    setUploading(true);
    // Simulação de upload
    setTimeout(() => {
      alert(`Upload de "${file.name}" como "${docType}" realizado com sucesso! (Simulado)`);
      setUploading(false);
      setFile(null);
      setDocType('Atestado Médico');
    }, 2000);
  };

  const handleDownload = (docName: string) => {
    alert(`Download do documento "${docName}" iniciado. (Simulado)`);
  };

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'OK':
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">✅ {status}</span>;
      case 'Pendente':
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">❌ {status}</span>;
      default:
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">⚠️ {status}</span>;
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Meus Documentos</h1>
      <p className="text-gray-600 mb-8">
        Aqui você pode visualizar seus documentos e fazer upload de novos arquivos para o RH.
      </p>

      <div className="bg-white shadow-lg rounded-xl p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Documentos Vinculados</h2>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Documento</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {userDocuments.map((doc) => (
              <tr key={doc.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{doc.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {renderStatusBadge(doc.status)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{doc.date}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {doc.file ? (
                    <button 
                      onClick={() => handleDownload(doc.name)}
                      className="text-blue-600 hover:text-blue-900 mr-4 flex items-center"
                    >
                      <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      Download
                    </button>
                  ) : (
                    <button 
                      onClick={() => alert(`Funcionalidade de Upload para ${doc.name} (Em Breve)`)}
                      className="text-indigo-600 hover:text-indigo-900 flex items-center"
                    >
                      <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                      Upload
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-white shadow-lg rounded-xl p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Upload de Outros Documentos</h2>
        <p className="text-sm text-gray-600 mb-4">Use esta seção para enviar documentos avulsos, como atestados médicos ou comprovantes de cursos.</p>
        <form onSubmit={handleFileUpload} className="space-y-4">
          <div>
            <label htmlFor="docType" className="block text-sm font-medium text-gray-700">Tipo de Documento</label>
            <select
              id="docType"
              name="docType"
              value={docType}
              onChange={(e) => setDocType(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md shadow-sm"
            >
              <option>Atestado Médico</option>
              <option>Comprovante de Curso/Certificado</option>
              <option>Comprovante de Residência</option>
              <option>Outro</option>
            </select>
          </div>
          <div>
            <label htmlFor="file" className="block text-sm font-medium text-gray-700">Arquivo (PDF, JPG, PNG)</label>
            <input
              type="file"
              id="file"
              name="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
              className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>
          <button
            type="submit"
            disabled={uploading || !file}
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {uploading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Enviando...
              </>
            ) : (
              <>
                <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0l-4 4m4-4v12" />
                </svg>
                Enviar Documento
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

