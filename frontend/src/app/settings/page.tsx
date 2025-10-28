'use client';

import { useState } from 'react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general'); // 'general', 'users', 'integrations'

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div className="bg-white shadow-lg rounded-xl p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 border-b pb-2">Informações da Empresa</h2>
        <form className="space-y-4">
          <div>
            <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">Nome da Empresa</label>
            <input type="text" id="companyName" defaultValue="Doc-Gestor RH Company" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
          </div>
          <div>
            <label htmlFor="cnpj" className="block text-sm font-medium text-gray-700">CNPJ</label>
            <input type="text" id="cnpj" defaultValue="00.000.000/0001-00" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
          </div>
          <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors">Salvar Informações</button>
        </form>
      </div>

      <div className="bg-white shadow-lg rounded-xl p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 border-b pb-2">Configurações de Documentos</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label htmlFor="documentAlert" className="text-sm font-medium text-gray-700">Alerta de Vencimento (dias)</label>
            <input type="number" id="documentAlert" defaultValue={60} className="w-20 border border-gray-300 rounded-md shadow-sm p-2 text-right" />
          </div>
          <p className="text-sm text-gray-500">Defina quantos dias antes um documento deve gerar um alerta de vencimento.</p>
        </div>
      </div>
    </div>
  );

  const renderUserManagement = () => (
    <div className="space-y-6">
      <div className="bg-white shadow-lg rounded-xl p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 border-b pb-2">Gerenciamento de Usuários (Admin)</h2>
        <div className="mb-4">
          <button className="bg-green-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors">Adicionar Novo Admin</button>
        </div>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Papel</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Admin User</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">admin@docgestor.com</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Administrador</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button className="text-red-600 hover:text-red-900">Remover</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderIntegrations = () => (
    <div className="space-y-6">
      <div className="bg-white shadow-lg rounded-xl p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 border-b pb-2">Integrações de Assinatura Eletrônica</h2>
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <p className="text-lg font-medium text-gray-900">DocuSign / Clicksign</p>
          <button className="bg-indigo-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-indigo-700 transition-colors">Conectar</button>
        </div>
        <p className="mt-2 text-sm text-gray-500">Conecte-se a serviços de assinatura para validar contratos digitais.</p>
      </div>
    </div>
  );

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Configurações do Sistema</h1>
      
      <div className="mb-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('general')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
              activeTab === 'general'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Geral
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
              activeTab === 'users'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Usuários Admin
          </button>
          <button
            onClick={() => setActiveTab('integrations')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
              activeTab === 'integrations'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Integrações
          </button>
        </nav>
      </div>

      <div>
        {activeTab === 'general' && renderGeneralSettings()}
        {activeTab === 'users' && renderUserManagement()}
        {activeTab === 'integrations' && renderIntegrations()}
      </div>
    </div>
  );
}

