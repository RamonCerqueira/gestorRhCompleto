'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';

interface Employee {
  id: number;
  name: string;
  email: string;
  position: string;
  department: string;
}

export default function VacationRequestPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [formData, setFormData] = useState({
    employeeId: '',
    startDate: '',
    endDate: '',
    type: 'Total',
    isAbonoPecuniario: false,
    abonoDays: '',
  });

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await api.getEmployees();
      setEmployees(response);
    } catch (error) {
      console.error('Erro ao buscar funcionários:', error);
    }
  };

  const calculateDays = () => {
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      const timeDiff = end.getTime() - start.getTime();
      const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;
      return daysDiff > 0 ? daysDiff : 0;
    }
    return 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const days = calculateDays();
      
      if (days <= 0) {
        alert('Por favor, selecione datas válidas');
        return;
      }

      if (days < 5) {
        alert('O período mínimo de férias é de 5 dias corridos');
        return;
      }

      if (formData.type === 'Parcial' && days > 15) {
        alert('Período parcial não pode exceder 15 dias');
        return;
      }

      const requestData = {
        employeeId: parseInt(formData.employeeId),
        startDate: formData.startDate,
        endDate: formData.endDate,
        type: formData.type,
        isAbonoPecuniario: formData.isAbonoPecuniario,
        abonoDays: formData.isAbonoPecuniario ? parseInt(formData.abonoDays) : undefined,
      };

      await api.requestVacation(requestData);
      
      alert('Solicitação de férias enviada com sucesso!');
      router.push('/vacations');
    } catch (error: any) {
      console.error('Erro ao solicitar férias:', error);
      alert(error.response?.data?.error || 'Erro ao solicitar férias. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const days = calculateDays();
  const maxAbonoDays = Math.floor(days / 3); // Máximo 1/3 das férias

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/vacations" className="flex items-center text-gray-600 hover:text-gray-900 mr-4 transition-colors">
                <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Voltar
              </Link>
              <h1 className="text-xl font-semibold text-gray-900">Solicitar Férias</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Bem-vindo, {user?.name || 'Usuário'}!</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Nova Solicitação de Férias</h2>
            <p className="text-gray-600">Preencha as informações para solicitar suas férias</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Funcionário */}
            <div>
              <label htmlFor="employeeId" className="block text-sm font-medium text-gray-700 mb-2">
                Funcionário *
              </label>
              <select
                id="employeeId"
                name="employeeId"
                required
                value={formData.employeeId}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="">Selecione o funcionário</option>
                {employees.map((employee) => (
                  <option key={employee.id} value={employee.id}>
                    {employee.name} - {employee.position}
                  </option>
                ))}
              </select>
            </div>

            {/* Tipo de Férias */}
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Férias *
              </label>
              <select
                id="type"
                name="type"
                required
                value={formData.type}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="Total">Férias Totais (30 dias)</option>
                <option value="Parcial">Férias Parciais (fracionadas)</option>
              </select>
              <p className="mt-1 text-xs text-gray-500">
                {formData.type === 'Parcial' 
                  ? 'Férias parciais: mínimo 5 dias, máximo 15 dias por período'
                  : 'Férias totais: 30 dias corridos'
                }
              </p>
            </div>

            {/* Datas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">
                  Data de Início *
                </label>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  required
                  value={formData.startDate}
                  onChange={handleChange}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-2">
                  Data de Fim *
                </label>
                <input
                  type="date"
                  id="endDate"
                  name="endDate"
                  required
                  value={formData.endDate}
                  onChange={handleChange}
                  min={formData.startDate || new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Resumo do Período */}
            {days > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="text-sm font-medium text-blue-800 mb-2">Resumo do Período</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-blue-700">Duração:</span>
                    <span className="ml-2 font-medium text-blue-900">{days} dias corridos</span>
                  </div>
                  <div>
                    <span className="text-blue-700">Tipo:</span>
                    <span className="ml-2 font-medium text-blue-900">{formData.type}</span>
                  </div>
                </div>
                
                {formData.type === 'Parcial' && days > 15 && (
                  <div className="mt-2 text-xs text-red-600">
                    ⚠️ Período parcial não pode exceder 15 dias
                  </div>
                )}
                
                {days < 5 && (
                  <div className="mt-2 text-xs text-red-600">
                    ⚠️ Período mínimo de férias é 5 dias corridos
                  </div>
                )}
              </div>
            )}

            {/* Abono Pecuniário */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <input
                  type="checkbox"
                  id="isAbonoPecuniario"
                  name="isAbonoPecuniario"
                  checked={formData.isAbonoPecuniario}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="isAbonoPecuniario" className="ml-2 text-sm font-medium text-gray-700">
                  Solicitar Abono Pecuniário (Venda de Férias)
                </label>
              </div>
              
              <p className="text-xs text-gray-500 mb-3">
                Você pode vender até 1/3 (um terço) das suas férias, recebendo o valor correspondente em dinheiro.
              </p>

              {formData.isAbonoPecuniario && (
                <div>
                  <label htmlFor="abonoDays" className="block text-sm font-medium text-gray-700 mb-2">
                    Quantos dias deseja vender? (máximo {maxAbonoDays} dias)
                  </label>
                  <input
                    type="number"
                    id="abonoDays"
                    name="abonoDays"
                    min="1"
                    max={maxAbonoDays}
                    value={formData.abonoDays}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder={`Máximo ${maxAbonoDays} dias`}
                  />
                </div>
              )}
            </div>

            {/* Informações Importantes */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">Informações Importantes</h3>
                  <div className="mt-2 text-sm text-yellow-700">
                    <ul className="list-disc list-inside space-y-1">
                      <li>Férias não podem iniciar em fins de semana ou feriados</li>
                      <li>O primeiro período de férias fracionadas deve ter no mínimo 14 dias</li>
                      <li>Demais períodos devem ter no mínimo 5 dias corridos</li>
                      <li>É necessário ter completado 12 meses de trabalho (período aquisitivo)</li>
                      <li>Não é possível acumular duas férias vencidas</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Botões */}
            <div className="flex justify-end space-x-4 pt-6 border-t">
              <Link
                href="/vacations"
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              >
                Cancelar
              </Link>
              <button
                type="submit"
                disabled={loading || days <= 0}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Enviando...
                  </>
                ) : (
                  <>
                    <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                    Solicitar Férias
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

