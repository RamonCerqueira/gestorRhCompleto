'use client';

import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState('employees'); // 'employees', 'documents', 'vacations'

  // Dados Simulados
  const employeeGrowthData = [
    { name: 'Jan', Contratados: 5, Demitidos: 1, Saldo: 4 },
    { name: 'Fev', Contratados: 3, Demitidos: 0, Saldo: 7 },
    { name: 'Mar', Contratados: 7, Demitidos: 3, Saldo: 11 },
    { name: 'Abr', Contratados: 2, Demitidos: 1, Saldo: 12 },
    { name: 'Mai', Contratados: 4, Demitidos: 2, Saldo: 14 },
    { name: 'Jun', Contratados: 1, Demitidos: 0, Saldo: 15 },
  ];

  const documentStatusData = [
    { name: 'OK', value: 75, color: '#10B981' },
    { name: 'Pendente', value: 15, color: '#F59E0B' },
    { name: 'Vencido', value: 10, color: '#EF4444' },
  ];

  const vacationStatusData = [
    { name: 'Aprovadas', value: 60, color: '#3B82F6' },
    { name: 'Pendentes', value: 25, color: '#F59E0B' },
    { name: 'Rejeitadas', value: 15, color: '#EF4444' },
  ];

  const COLORS = ['#10B981', '#F59E0B', '#EF4444'];

  const renderEmployeeReports = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white shadow-lg rounded-xl p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Evolução do Quadro de Funcionários (Últimos 6 Meses)</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={employeeGrowthData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis dataKey="name" stroke="#6B7280" />
            <YAxis stroke="#6B7280" />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="Contratados" stroke="#3B82F6" strokeWidth={2} />
            <Line type="monotone" dataKey="Demitidos" stroke="#EF4444" strokeWidth={2} />
            <Line type="monotone" dataKey="Saldo" stroke="#10B981" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      <div className="bg-white shadow-lg rounded-xl p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Turnover por Departamento (Últimos 12 Meses)</h2>
        <div className="h-72 flex items-center justify-center text-gray-500">
          Gráfico de Barras (Implementação Pendente)
        </div>
      </div>
    </div>
  );

  const renderDocumentReports = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white shadow-lg rounded-xl p-6 flex flex-col items-center">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Status da Documentação (%)</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={documentStatusData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              fill="#8884d8"
              paddingAngle={5}
              dataKey="value"
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            >
              {documentStatusData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip formatter={(value, name, props) => [`${value}%`, props.payload.name]} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
      
      <div className="bg-white shadow-lg rounded-xl p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Documentos Vencendo (Próximos 60 dias)</h2>
        <ul className="space-y-3">
          <li className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800">
            5 ASOs (Atestados de Saúde Ocupacional)
          </li>
          <li className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
            3 Contratos de Experiência
          </li>
          <li className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-800">
            1 CNH de Motorista
          </li>
        </ul>
      </div>
    </div>
  );

  const renderVacationReports = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white shadow-lg rounded-xl p-6 flex flex-col items-center">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Status das Solicitações de Férias (%)</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={vacationStatusData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              fill="#8884d8"
              paddingAngle={5}
              dataKey="value"
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            >
              {vacationStatusData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip formatter={(value, name, props) => [`${value}%`, props.payload.name]} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
      
      <div className="bg-white shadow-lg rounded-xl p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Férias Fracionadas vs. Integrais</h2>
        <div className="h-72 flex items-center justify-center text-gray-500">
          Gráfico de Pizza (Implementação Pendente)
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Relatórios Gerenciais de RH</h1>
      
      <div className="mb-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('employees')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
              activeTab === 'employees'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Funcionários
          </button>
          <button
            onClick={() => setActiveTab('documents')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
              activeTab === 'documents'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Documentos
          </button>
          <button
            onClick={() => setActiveTab('vacations')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
              activeTab === 'vacations'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Férias
          </button>
        </nav>
      </div>

      <div className="space-y-8">
        {activeTab === 'employees' && renderEmployeeReports()}
        {activeTab === 'documents' && renderDocumentReports()}
        {activeTab === 'vacations' && renderVacationReports()}
      </div>
    </div>
  );
}

