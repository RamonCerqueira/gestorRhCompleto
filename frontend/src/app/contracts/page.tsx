'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ContractsPage() {
  const [activeTab, setActiveTab] = useState('templates'); // 'templates', 'generator', 'management'

  // Simulação de dados
  const contractTemplates = [
    { id: 1, name: 'Contrato de Trabalho CLT - Padrão', type: 'CLT', status: 'Ativo', lastUpdated: '2024-09-01' },
    { id: 2, name: 'Contrato de Estágio', type: 'Estágio', status: 'Ativo', lastUpdated: '2024-05-10' },
    { id: 3, name: 'Termo de Confidencialidade (NDA)', type: 'Aditivo', status: 'Ativo', lastUpdated: '2023-11-20' },
    { id: 4, name: 'Contrato de Experiência (90 dias)', type: 'CLT', status: 'Ativo', lastUpdated: '2024-01-01' },
  ];

  const contractManagement = [
    { id: 101, employee: 'Maria Silva', template: 'CLT Padrão', status: 'Assinado', date: '2024-01-15' },
    { id: 102, employee: 'João Souza', template: 'CLT Padrão', status: 'Pendente Assinatura', date: '2024-10-01' },
    { id: 103, employee: 'Ana Costa', template: 'Estágio', status: 'Vencido', date: '2023-12-31' },
  ];

  const renderTemplates = () => (
    <div className="bg-white shadow-lg rounded-xl p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Biblioteca de Modelos de Contratos</h2>
      <div className="mb-4">
        <Link href="/contracts/generator" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors flex items-center w-max">
          <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Novo Modelo
        </Link>
      </div>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome do Modelo</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Última Atualização</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {contractTemplates.map((template) => (
            <tr key={template.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{template.name}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{template.type}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                  {template.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{template.lastUpdated}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button className="text-blue-600 hover:text-blue-900 mr-4">Editar</button>
                <button className="text-red-600 hover:text-red-900">Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderManagement = () => (
    <div className="bg-white shadow-lg rounded-xl p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Gerenciamento de Contratos Ativos</h2>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Funcionário</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Modelo</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data de Início</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {contractManagement.map((contract) => (
            <tr key={contract.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{contract.employee}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{contract.template}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  contract.status === 'Assinado' ? 'bg-green-100 text-green-800' :
                  contract.status === 'Pendente Assinatura' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {contract.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{contract.date}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button className="text-blue-600 hover:text-blue-900 mr-4">Visualizar</button>
                <button className="text-indigo-600 hover:text-indigo-900">Enviar para Assinatura</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Gerenciamento de Contratos</h1>
      
      <div className="mb-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('templates')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
              activeTab === 'templates'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Modelos
          </button>
          <button
            onClick={() => setActiveTab('management')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
              activeTab === 'management'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Contratos Ativos
          </button>
        </nav>
      </div>

      <div>
        {activeTab === 'templates' && renderTemplates()}
        {activeTab === 'management' && renderManagement()}
      </div>
    </div>
  );
}

