'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';

interface Period {
  startDate: string;
  endDate: string;
  days: number;
}

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
  const [periods, setPeriods] = useState<Period[]>([{ startDate: '', endDate: '', days: 0 }]);
  const [abonoPecuniario, setAbonoPecuniario] = useState(false);
  const [loading, setLoading] = useState(false);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>(user?.role === 'user' ? (user.id || '').toString() : '');
  
  const maxPeriods = 3; // CLT permite no máximo 3 períodos

  // Simulação de dados do funcionário (deveria vir da API)
  const employeeInfo = {
    availableDays: 30,
    aquisitivePeriod: '12/2023 - 11/2024',
    nextConcessiveEnd: '11/2025',
  };

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchEmployees();
    }
  }, [user]);

  const fetchEmployees = async () => {
    try {
      const response = await api.getEmployees();
      setEmployees(response);
    } catch (error) {
      console.error('Erro ao buscar funcionários:', error);
    }
  };

  const totalDaysRequested = periods.reduce((sum, p) => p.days ? sum + p.days : sum, 0);

  const handlePeriodChange = (index: number, field: keyof Period, value: string | number) => {
    const newPeriods = [...periods];
    newPeriods[index] = { ...newPeriods[index], [field]: value };
    setPeriods(newPeriods);
  };

  const addPeriod = () => {
    if (periods.length < maxPeriods) {
      setPeriods([...periods, { startDate: '', endDate: '', days: 0 }]);
    } else {
      alert(`A CLT permite o fracionamento em no máximo ${maxPeriods} períodos.`);
    }
  };

  const removePeriod = (index: number) => {
    const newPeriods = periods.filter((_, i) => i !== index);
    setPeriods(newPeriods);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (user?.role === 'admin' && !selectedEmployeeId) {
        alert('Selecione um funcionário.');
        return;
    }

    if (totalDaysRequested === 0) {
        alert('Informe pelo menos um período de férias.');
        return;
    }

    if (totalDaysRequested > employeeInfo.availableDays) {
      alert(`Erro: Você está solicitando ${totalDaysRequested} dias, mas tem apenas ${employeeInfo.availableDays} dias disponíveis.`);
      return;
    }
    
    // Validação CLT para fracionamento
    if (periods.length > 1) {
        let hasLongPeriod = false;
        let allOthersValid = true;

        periods.forEach(p => {
            if (p.days >= 14) {
                hasLongPeriod = true;
            } else if (p.days < 5) {
                allOthersValid = false;
            }
        });

        if (!hasLongPeriod) {
            alert('Erro CLT: No fracionamento, um dos períodos deve ter no mínimo 14 dias.');
            return;
        }
        if (!allOthersValid) {
            alert('Erro CLT: Os demais períodos devem ter no mínimo 5 dias.');
            return;
        }
    }
    
    setLoading(true);
    
    // Simulação de envio para o backend
    const requestData = {
        employeeId: parseInt(selectedEmployeeId),
        periods,
        abonoPecuniario,
        abonoDays: abonoPecuniario ? Math.floor(employeeInfo.availableDays / 3) : 0,
    };

    console.log('Dados da Solicitação (Simulado):', requestData);

    setTimeout(() => {
      alert(`Solicitação de férias enviada com sucesso! (Simulado)
      Dias Totais: ${totalDaysRequested}
      Períodos: ${periods.length}
      Abono Pecuniário: ${abonoPecuniario ? 'Sim' : 'Não'}`);
      setLoading(false);
      router.push('/vacations');
    }, 2000);
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Solicitação de Férias</h1>
      <p className="text-gray-600 mb-8">Preencha o formulário para solicitar suas férias. A aprovação está sujeita à análise do RH e gestor.</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Informações do Funcionário */}
        <div className="lg:col-span-1 bg-white shadow-lg rounded-xl p-6 h-max">
          <h2 className="text-xl font-semibold text-blue-600 mb-4 flex items-center">
            <span className="mr-2">ℹ️</span> Seus Direitos
          </h2>
          <div className="space-y-3 text-sm">
            <p className="font-medium">Dias Disponíveis: <span className="text-blue-600 font-bold">{employeeInfo.availableDays} dias</span></p>
            <p>Período Aquisitivo: <span className="font-medium">{employeeInfo.aquisitivePeriod}</span></p>
            <p>Fim do Período Concessivo: <span className="font-medium text-red-500">{employeeInfo.nextConcessiveEnd}</span></p>
          </div>
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs text-blue-800">
                **Regra CLT:** O fracionamento é permitido em até 3 períodos, sendo um de no mínimo 14 dias e os demais no mínimo 5 dias.
            </p>
          </div>
        </div>

        {/* Formulário de Solicitação */}
        <div className="lg:col-span-2 bg-white shadow-lg rounded-xl p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Seleção de Funcionário (Apenas Admin) */}
            {user?.role === 'admin' && (
                <div>
                    <label htmlFor="employeeId" className="block text-sm font-medium text-gray-700 mb-2">
                        Funcionário *
                    </label>
                    <select
                        id="employeeId"
                        name="employeeId"
                        required
                        value={selectedEmployeeId}
                        onChange={(e) => setSelectedEmployeeId(e.target.value)}
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
            )}

            <h2 className="text-xl font-semibold text-gray-900 mb-4">Períodos Desejados</h2>
            
            {periods.map((period, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg bg-gray-50 relative">
                <h3 className="font-medium text-gray-700 mb-3">Período {index + 1}</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Data de Início</label>
                    <input
                      type="date"
                      value={period.startDate}
                      onChange={(e) => handlePeriodChange(index, 'startDate', e.target.value)}
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Data de Fim</label>
                    <input
                      type="date"
                      value={period.endDate}
                      onChange={(e) => handlePeriodChange(index, 'endDate', e.target.value)}
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Dias Corridos</label>
                    <input
                      type="number"
                      min="1"
                      value={period.days}
                      onChange={(e) => handlePeriodChange(index, 'days', parseInt(e.target.value) || 0)}
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    />
                  </div>
                </div>
                {periods.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removePeriod(index)}
                    className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                    title="Remover Período"
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                )}
              </div>
            ))}

            {periods.length < maxPeriods && (
              <button
                type="button"
                onClick={addPeriod}
                className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
              >
                <svg className="h-5 w-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                Adicionar Outro Período (Max. {maxPeriods})
              </button>
            )}

            {/* Abono Pecuniário */}
            <div className="flex items-center pt-4 border-t border-gray-200">
              <input
                id="abono"
                type="checkbox"
                checked={abonoPecuniario}
                onChange={(e) => setAbonoPecuniario(e.target.checked)}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="abono" className="ml-3 text-sm font-medium text-gray-700">
                Solicitar Abono Pecuniário (Venda de 1/3 das Férias - {Math.floor(employeeInfo.availableDays / 3)} dias)
              </label>
            </div>

            {/* Resumo e Botão de Envio */}
            <div className="pt-6 border-t border-gray-200">
              <p className="text-lg font-bold text-gray-900 mb-4">
                Total de Dias Solicitados: <span className={totalDaysRequested > employeeInfo.availableDays ? 'text-red-600' : 'text-green-600'}>{totalDaysRequested}</span> / {employeeInfo.availableDays} dias
              </p>
              <button
                type="submit"
                disabled={loading || totalDaysRequested <= 0 || totalDaysRequested > employeeInfo.availableDays}
                className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Enviando Solicitação...
                  </>
                ) : (
                  <>
                    <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Enviar Solicitação de Férias
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

