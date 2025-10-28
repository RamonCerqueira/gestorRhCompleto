'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';
import VacationCalendar from '@/components/VacationCalendar';

interface Vacation {
  id: number;
  employeeId: number;
  startDate: string;
  endDate: string;
  days: number;
  type: string;
  status: string;
  requestDate: string;
  approvedBy?: string;
  approvedAt?: string;
  rejectedReason?: string;
  isAbonoPecuniario: boolean;
  abonoDays?: number;
  employee: {
    id: number;
    name: string;
    email: string;
    position: string;
    department: string;
  };
}

export default function VacationsPage() {
  const { user } = useAuth();
  const [vacations, setVacations] = useState<Vacation[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'requests' | 'calendar'>('requests');

  useEffect(() => {
    // Apenas Admin carrega a lista completa de solicitações
    if (user?.role === 'admin') {
      fetchVacations();
    } else {
        // Usuário comum é redirecionado para a solicitação de férias
        // O Layout já deveria cuidar disso, mas é uma redundância
        // Aqui, apenas desabilita o loading para não travar
        setLoading(false);
    }
  }, [user]);

  const fetchVacations = async () => {
    try {
      setLoading(true);
      // Simulação: A API deveria retornar a lista de férias
      // const response = await api.getVacations();
      // setVacations(response);
      
      // Dados simulados para o Admin
      const mockVacations: Vacation[] = [
        { id: 1, employeeId: 1, startDate: '2025-10-10', endDate: '2025-10-30', days: 21, type: 'Total', status: 'Pendente', requestDate: '2025-08-01', isAbonoPecuniario: false, employee: { id: 1, name: 'Maria Silva', email: 'maria@empresa.com', position: 'Analista', department: 'RH' } },
        { id: 2, employeeId: 2, startDate: '2025-11-05', endDate: '2025-11-15', days: 11, type: 'Parcial', status: 'Aprovada', requestDate: '2025-09-01', isAbonoPecuniario: true, abonoDays: 10, employee: { id: 2, name: 'João Souza', email: 'joao@empresa.com', position: 'Desenvolvedor', department: 'TI' } },
        { id: 3, employeeId: 3, startDate: '2025-12-01', endDate: '2025-12-05', days: 5, type: 'Parcial', status: 'Pendente', requestDate: '2025-09-15', isAbonoPecuniario: false, employee: { id: 3, name: 'Ana Costa', email: 'ana@empresa.com', position: 'Gerente', department: 'Vendas' } },
      ];
      setVacations(mockVacations);

    } catch (error) {
      console.error('Erro ao buscar férias:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproval = async (vacationId: number, status: 'Aprovada' | 'Rejeitada', reason?: string) => {
    try {
      // Simulação de chamada à API
      // await api.updateVacationStatus(vacationId, { status, approvedBy: user?.name || 'Sistema', rejectedReason: reason });
      
      // Atualizar a lista localmente
      setVacations(prev => prev.map(v => v.id === vacationId ? { ...v, status, approvedBy: user?.name || 'Sistema', rejectedReason: reason, approvedAt: new Date().toISOString() } : v));

    } catch (error) {
      console.error('Erro ao atualizar status das férias:', error);
      alert('Erro ao atualizar status das férias');
    }
  };

  const filteredVacations = vacations.filter(vacation => {
    const matchesSearch = vacation.employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vacation.employee.department.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || vacation.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Aprovada':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Pendente':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Rejeitada':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'Cancelada':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Aprovada':
        return '✅';
      case 'Pendente':
        return '⏳';
      case 'Rejeitada':
        return '❌';
      case 'Cancelada':
        return '🚫';
      default:
        return '❓';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  if (user?.role !== 'admin') {
    // Redireciona o usuário comum para a página de solicitação
    // O Layout já cuida disso, mas aqui é uma mensagem de fallback
    return (
        <div className="p-8 text-center">
            <h1 className="text-3xl font-bold text-red-600 mb-4">Acesso Negado</h1>
            <p className="text-gray-600">Você não tem permissão para acessar esta visão. Use o menu "Solicitar Férias".</p>
        </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/dashboard" className="flex items-center text-gray-600 hover:text-gray-900 mr-4 transition-colors">
                <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Voltar
              </Link>
              <h1 className="text-xl font-semibold text-gray-900">Gestão de Férias</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setActiveTab('requests')}
                className={`px-4 py-2 rounded-lg text-sm transition-colors flex items-center ${activeTab === 'requests' ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
                Solicitações
              </button>
              <button
                onClick={() => setActiveTab('calendar')}
                className={`px-4 py-2 rounded-lg text-sm transition-colors flex items-center ${activeTab === 'calendar' ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                Calendário
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'requests' && (
          <>
            {/* Filtros e Busca */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                <div className="flex-1 max-w-md">
                  <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                    Buscar por funcionário
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="search"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Nome ou departamento..."
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-4">
                  <div>
                    <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-2">
                      Filtrar por status
                    </label>
                    <select
                      id="status-filter"
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    >
                      <option value="all">Todos</option>
                      <option value="Pendente">Pendente</option>
                      <option value="Aprovada">Aprovada</option>
                      <option value="Rejeitada">Rejeitada</option>
                      <option value="Cancelada">Cancelada</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Lista de Férias */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  {filteredVacations.length} solicitação(ões) encontrada(s)
                </h2>
              </div>

              <div className="divide-y divide-gray-200">
                {filteredVacations.map((vacation) => (
                  <div key={vacation.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="flex-shrink-0">
                            <div className="h-10 w-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                              <span className="text-white font-medium text-sm">
                                {vacation.employee.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          </div>
                          <div>
                            <h3 className="text-lg font-medium text-gray-900">{vacation.employee.name}</h3>
                            <p className="text-sm text-gray-600">{vacation.employee.position} • {vacation.employee.department}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div>
                            <p className="text-sm font-medium text-gray-700">Período</p>
                            <p className="text-sm text-gray-900">
                              {formatDate(vacation.startDate)} a {formatDate(vacation.endDate)}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-700">Duração</p>
                            <p className="text-sm text-gray-900">
                              {vacation.days} dias ({vacation.type})
                              {vacation.isAbonoPecuniario && (
                                <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                  Abono: {vacation.abonoDays} dias
                                </span>
                              )}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-700">Solicitado em</p>
                            <p className="text-sm text-gray-900">{formatDate(vacation.requestDate)}</p>
                          </div>
                        </div>

                        {vacation.rejectedReason && (
                          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-sm font-medium text-red-800">Motivo da rejeição:</p>
                            <p className="text-sm text-red-700">{vacation.rejectedReason}</p>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col items-end space-y-3">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(vacation.status)}`}>
                          <span className="mr-1">{getStatusIcon(vacation.status)}</span>
                          {vacation.status}
                        </span>

                        {vacation.status === 'Pendente' && user?.role === 'admin' && (
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleApproval(vacation.id, 'Aprovada')}
                              className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
                            >
                              Aprovar
                            </button>
                            <button
                              onClick={() => {
                                const reason = prompt('Motivo da rejeição (opcional):');
                                handleApproval(vacation.id, 'Rejeitada', reason || undefined);
                              }}
                              className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
                            >
                              Rejeitar
                            </button>
                          </div>
                        )}

                        {vacation.approvedBy && vacation.approvedAt && (
                          <div className="text-xs text-gray-500 text-right">
                            <p>Aprovado por: {vacation.approvedBy}</p>
                            <p>Em: {formatDate(vacation.approvedAt)}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filteredVacations.length === 0 && (
                <div className="px-6 py-12 text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhuma solicitação encontrada</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Tente ajustar os filtros ou solicite suas férias.
                  </p>
                </div>
              )}
            </div>
          </>
        )}

        {activeTab === 'calendar' && (
          <VacationCalendar />
        )}
      </div>
    </div>
  );
}

