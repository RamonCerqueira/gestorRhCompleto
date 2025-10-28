'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
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
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalEmployees: 0,
    employeesOK: 0,
    employeesPending: 0,
    employeesAlert: 0,
    documentsExpiringSoon: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Apenas carrega estatísticas se for Admin
    if (user?.role === 'admin') {
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
    } else {
      setLoading(false);
    }
  }, [user]);

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
      adminOnly: true,
    },
    {
      title: 'Buscar Funcionário',
      description: 'Encontrar funcionário específico',
      icon: '🔍',
      href: '/employees',
      color: 'bg-green-500',
      adminOnly: true,
    },
    {
      title: 'Relatórios',
      description: 'Gerar relatórios gerenciais',
      icon: '📊',
      href: '/reports',
      color: 'bg-purple-500',
      adminOnly: true,
    },
    {
      title: 'Configurações',
      description: 'Configurar sistema',
      icon: '⚙️',
      href: '/settings',
      color: 'bg-gray-500',
      adminOnly: true,
    },
    {
      title: 'Meus Documentos',
      description: 'Visualizar e fazer upload de documentos',
      icon: '📄',
      href: '/documents/my-documents',
      color: 'bg-indigo-500',
      userOnly: true,
    },
    {
      title: 'Meu Perfil',
      description: 'Atualizar informações pessoais e foto',
      icon: '👤',
      href: '/profile', // Rota a ser criada
      color: 'bg-teal-500',
      userOnly: true,
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // --- Dashboard do Usuário Comum ---
  if (user?.role === 'user') {
    const userActions = quickActions.filter(action => action.userOnly);
    
    return (
      <div className="p-8">
        <div className="bg-white rounded-xl shadow-xl p-8 mb-8 flex items-center space-x-6">
          {/* Foto/Avatar do Usuário */}
          <div className="relative w-24 h-24">
            <div className="w-full h-full bg-blue-100 rounded-full flex items-center justify-center text-4xl font-bold text-blue-600 border-4 border-blue-300">
              {user.name.charAt(0).toUpperCase()}
            </div>
            {/* Botão para upload de foto (simulado) */}
            <button 
              title="Upload de Foto"
              className="absolute bottom-0 right-0 bg-green-500 hover:bg-green-600 text-white p-1 rounded-full border-2 border-white transition-colors"
              onClick={() => alert('Funcionalidade de Upload de Foto (Em Breve)')}
            >
               <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
            </button>
          </div>

          <div>
            <h1 className="text-4xl font-bold text-gray-900">Bem-vindo(a), {user.name}!</h1>
            <p className="text-xl text-gray-600 mt-2">Seu portal de RH está pronto para uso.</p>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-6">Acesso Rápido</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userActions.map((action, index) => (
            <Link
              key={index}
              href={action.href}
              className="group p-6 rounded-xl border border-gray-200 bg-white hover:border-indigo-500 transition-all duration-200 hover:shadow-lg"
            >
              <div className="flex items-center mb-3">
                <div className={`${action.color} text-white p-3 rounded-lg mr-4 group-hover:scale-110 transition-transform duration-200`}>
                  <span className="text-xl">{action.icon}</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                  {action.title}
                </h3>
              </div>
              <p className="text-sm text-gray-600">{action.description}</p>
            </Link>
          ))}
        </div>
      </div>
    );
  }

  // --- Dashboard do Administrador ---
  const adminActions = quickActions.filter(action => action.adminOnly);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Dashboard Administrativo</h1>
      
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
          {adminActions.map((action, index) => (
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
  );
}

