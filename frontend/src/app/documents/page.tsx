'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';


export default function DocumentsPage() {
  const { user } = useAuth();
  if (user?.role !== 'admin') {
    return (
      <div className="p-8 text-center">
        <h1 className="text-3xl font-bold text-red-600 mb-4">Acesso Negado</h1>
        <p className="text-gray-600">Você não tem permissão para acessar esta página. Por favor, use o menu lateral.</p>
      </div>
    );
  }

  // Layout para Administrador
  const quickActions = [
    {
      title: 'Biblioteca de Modelos',
      description: 'Gerencie modelos de documentos (contratos, atestados, etc.)',
      icon: '📝',
      href: '/documents/templates',
      color: 'bg-blue-500',
    },
    {
      title: 'Gerenciador de Validades',
      description: 'Acompanhe documentos com datas de vencimento (ASO, CNH, etc.)',
      icon: '📅',
      href: '/documents/expiring',
      color: 'bg-yellow-500',
    },
    {
      title: 'Documentos por Funcionário',
      description: 'Visualize e gerencie todos os documentos de um funcionário',
      icon: '👥',
      href: '/employees', // Redireciona para a lista de funcionários para seleção
      color: 'bg-green-500',
    },
    {
      title: 'Estatísticas de Documentos',
      description: 'Veja um resumo do status da documentação da empresa',
      icon: '📊',
      href: '/reports', // Pode ser uma seção de relatórios
      color: 'bg-purple-500',
    },
  ];

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Gerenciamento de Documentos</h1>
      <p className="text-gray-600 mb-8">Central de controle para todos os documentos de RH da empresa.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickActions.map((action, index) => (
          <Link
            key={index}
            href={action.href}
            className="group p-6 rounded-xl border border-gray-200 bg-white hover:border-blue-500 transition-all duration-200 hover:shadow-lg"
          >
            <div className="flex items-center mb-3">
              <div className={`${action.color} text-white p-3 rounded-lg mr-4 group-hover:scale-110 transition-transform duration-200`}>
                <span className="text-xl">{action.icon}</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
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

