'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import DocumentsChart from '@/components/DocumentsChart';
import { api } from '@/lib/api';

interface DashboardStats {
  totalEmployees: number;
  employeesOK: number;
  employeesPending: number;
  employeesAlert: number;
  documentsExpiringSoon: number;
}

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats>({
    totalEmployees: 0,
    employeesOK: 0,
    employeesPending: 0,
    employeesAlert: 0,
    documentsExpiringSoon: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const dashboardStats = await api.getDashboardStats();
        setStats(dashboardStats);
      } catch (error) {
        console.error('Erro ao carregar estatísticas:', error);
        // Fallback para dados simulados
        setStats({
          totalEmployees: 3,
          employeesOK: 1,
          employeesPending: 1,
          employeesAlert: 1,
          documentsExpiringSoon: 1,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const cards = [
    {
      title: 'Total de Funcionários',
      value: stats.totalEmployees,
      icon: '👥',
      color: 'bg-blue-500',
      textColor: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Documentação OK',
      value: stats.employeesOK,
      icon: '✅',
      color: 'bg-green-500',
      textColor: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Documentação Pendente',
      value: stats.employeesPending,
      icon: '⏳',
      color: 'bg-yellow-500',
      textColor: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
    },
    {
      title: 'Documentação em Alerta',
      value: stats.employeesAlert,
      icon: '⚠️',
      color: 'bg-red-500',
      textColor: 'text-red-600',
      bgColor: 'bg-red-50',
    },
  ];

  const quickActions = [
    {
      title: 'Adicionar Funcionário',
      description: 'Cadastrar novo funcionário',
      icon: '➕',
      href: '/employees/new',
      color: 'bg-blue-500',
    },
    {
      title: 'Buscar Funcionário',
      description: 'Encontrar funcionário específico',
      icon: '🔍',
      href: '/employees',
      color: 'bg-green-500',
    },
    {
      title: 'Relatórios',
      description: 'Gerar relatórios gerenciais',
      icon: '📊',
      href: '/reports',
      color: 'bg-purple-500',
    },
    {
      title: 'Configurações',
      description: 'Configurar sistema',
      icon: '⚙️',
      href: '/settings',
      color: 'bg-gray-500',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center mr-3">
                <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h1 className="text-xl font-semibold text-gray-900">Doc-Gestor RH</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Bem-vindo, {user?.name || 'Usuário'}!</span>
              <button 
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-600 transition-colors"
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Cards de Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {cards.map((card, index) => (
            <div
              key={index}
              className={`${card.bgColor} rounded-xl p-6 transform transition-all duration-300 hover:scale-105 hover:shadow-lg`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">{card.title}</p>
                  <p className={`text-3xl font-bold ${card.textColor}`}>{card.value}</p>
                </div>
                <div className="text-3xl">{card.icon}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Lembretes e Alertas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Lembretes */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Lembretes e Ações Críticas</h2>
            <div className="space-y-3">
              <div className="flex items-center p-3 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
                <div className="text-yellow-600 mr-3">⚠️</div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {stats.documentsExpiringSoon} documentos vencendo nos próximos 30 dias
                  </p>
                  <p className="text-xs text-gray-600">Verifique os exames periódicos e contratos</p>
                </div>
              </div>
              <div className="flex items-center p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                <div className="text-blue-600 mr-3">📋</div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {stats.employeesPending} funcionários com documentação pendente
                  </p>
                  <p className="text-xs text-gray-600">Documentos de admissão em falta</p>
                </div>
              </div>
            </div>
          </div>

          {/* Gráfico de Documentos */}
          <DocumentsChart />
        </div>

        {/* Ações Rápidas */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Ações Rápidas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <Link
                key={index}
                href={action.href}
                className="group p-4 rounded-lg border border-gray-200 hover:border-gray-300 transition-all duration-200 hover:shadow-md"
              >
                <div className="flex items-center mb-3">
                  <div className={`${action.color} text-white p-2 rounded-lg mr-3 group-hover:scale-110 transition-transform duration-200`}>
                    <span className="text-lg">{action.icon}</span>
                  </div>
                  <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                    {action.title}
                  </h3>
                </div>
                <p className="text-sm text-gray-600">{action.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

