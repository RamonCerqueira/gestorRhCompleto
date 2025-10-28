'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

interface Employee {
  id: number;
  name: string;
  email: string;
  cpf: string;
  position: string;
  department: string;
  status: 'OK' | 'Pendente' | 'Alerta';
  hireDate: string;
}

interface Document {
  id: number;
  docType: string;
  category: string;
  fileName: string;
  uploadDate: string;
  dueDate?: string;
  status: 'OK' | 'Vencido' | 'Pendente';
}

const documentCategories = [
  {
    name: 'Admissão',
    documents: [
      'Contrato de Trabalho',
      'Ficha de Registro',
      'Documentos Pessoais (RG, CPF, CNH)',
      'Comprovante de Endereço',
      'Comprovante de Escolaridade',
      'Exame Admissional (ASO)',
      'Declaração de Dependentes',
      'Vale-Transporte'
    ]
  },
  {
    name: 'Dia a Dia',
    documents: [
      'Recibos de Pagamento (Holerites)',
      'Controles de Ponto',
      'Atestados Médicos',
      'Advertências e Suspensões',
      'Acordos de Compensação de Horas'
    ]
  },
  {
    name: 'Férias',
    documents: [
      'Aviso de Férias',
      'Recibo de Pagamento de Férias'
    ]
  },
  {
    name: 'Desligamento',
    documents: [
      'Pedido de Demissão ou Aviso Prévio',
      'Termo de Rescisão de Contrato (TRCT)',
      'Exame Demissional (ASO)',
      'Comprovante de Pagamento das Verbas Rescisórias',
      'Documentos do Seguro-Desemprego'
    ]
  }
];

export default function EmployeeDetailPage() {
  const params = useParams();
  const employeeId = params.id as string;
  
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('Admissão');
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    // Dados simulados - será substituído pela chamada da API
    setEmployee({
      id: parseInt(employeeId),
      name: 'João Silva',
      email: 'joao.silva@empresa.com',
      cpf: '123.456.789-01',
      position: 'Desenvolvedor',
      department: 'TI',
      status: 'OK',
      hireDate: '2023-01-15',
    });

    setDocuments([
      {
        id: 1,
        docType: 'Contrato de Trabalho',
        category: 'Admissão',
        fileName: 'contrato_joao_silva.pdf',
        uploadDate: '2023-01-15',
        status: 'OK'
      },
      {
        id: 2,
        docType: 'Exame Admissional (ASO)',
        category: 'Admissão',
        fileName: 'aso_joao_silva.pdf',
        uploadDate: '2023-01-14',
        dueDate: '2024-01-14',
        status: 'OK'
      }
    ]);
  }, [employeeId]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OK':
        return 'bg-green-100 text-green-800';
      case 'Pendente':
        return 'bg-yellow-100 text-yellow-800';
      case 'Alerta':
      case 'Vencido':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleFileUpload = (docType: string) => {
    // Implementar upload de arquivo
    console.log('Upload para:', docType);
  };

  const getCategoryDocuments = (category: string) => {
    return documents.filter(doc => doc.category === category);
  };

  const getDocumentStatus = (docType: string, category: string) => {
    const doc = documents.find(d => d.docType === docType && d.category === category);
    return doc ? doc.status : 'Pendente';
  };

  const hasDocument = (docType: string, category: string) => {
    return documents.some(d => d.docType === docType && d.category === category);
  };

  if (!employee) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/employees" className="mr-4 text-gray-600 hover:text-gray-900">
                ← Voltar
              </Link>
              <h1 className="text-xl font-semibold text-gray-900">Detalhes do Funcionário</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Informações do Funcionário */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex items-center space-x-6">
            <div className="h-20 w-20 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-2xl">
                {employee.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900">{employee.name}</h2>
              <p className="text-gray-600">{employee.position} • {employee.department}</p>
              <div className="flex items-center mt-2 space-x-4">
                <span className="text-sm text-gray-500">📧 {employee.email}</span>
                <span className="text-sm text-gray-500">🆔 {employee.cpf}</span>
                <span className="text-sm text-gray-500">
                  📅 Admitido em {new Date(employee.hireDate).toLocaleDateString('pt-BR')}
                </span>
              </div>
            </div>
            <div>
              <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(employee.status)}`}>
                {employee.status === 'OK' && '✅'}
                {employee.status === 'Pendente' && '⏳'}
                {employee.status === 'Alerta' && '⚠️'}
                <span className="ml-1">{employee.status}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Documentos */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Documentos</h3>
          </div>

          {/* Abas de Categorias */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {documentCategories.map((category) => (
                <button
                  key={category.name}
                  onClick={() => setSelectedCategory(category.name)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    selectedCategory === category.name
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </nav>
          </div>

          {/* Conteúdo da Categoria Selecionada */}
          <div className="p-6">
            {documentCategories
              .find(cat => cat.name === selectedCategory)
              ?.documents.map((docType, index) => {
                const status = getDocumentStatus(docType, selectedCategory);
                const hasDoc = hasDocument(docType, selectedCategory);
                
                return (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg mb-3 hover:border-gray-300 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${
                        status === 'OK' ? 'bg-green-500' : 
                        status === 'Vencido' ? 'bg-red-500' : 'bg-yellow-500'
                      }`}></div>
                      <span className="font-medium text-gray-900">{docType}</span>
                      {hasDoc && (
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
                          {status}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {hasDoc ? (
                        <>
                          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                            Visualizar
                          </button>
                          <button className="text-green-600 hover:text-green-800 text-sm font-medium">
                            Download
                          </button>
                          <button className="text-red-600 hover:text-red-800 text-sm font-medium">
                            Remover
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => handleFileUpload(docType)}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors"
                        >
                          + Adicionar
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}

            {/* Botão para Outros Documentos */}
            <div className="mt-6 p-4 border-2 border-dashed border-gray-300 rounded-lg text-center">
              <button className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors">
                + Adicionar Outro Documento
              </button>
              <p className="text-sm text-gray-500 mt-2">
                Para documentos não listados acima (ex: advertências, certificados, etc.)
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

