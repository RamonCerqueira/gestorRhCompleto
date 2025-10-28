'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, User, Clock } from 'lucide-react';

interface VacationEvent {
  id: number;
  employee: string;
  startDate: string;
  endDate: string;
  color: string;
}

const mockEvents: VacationEvent[] = [
  { id: 1, employee: 'Maria Silva', startDate: '2025-10-10', endDate: '2025-10-30', color: 'bg-blue-500' },
  { id: 2, employee: 'João Souza', startDate: '2025-10-15', endDate: '2025-10-25', color: 'bg-green-500' },
  { id: 3, employee: 'Ana Costa', startDate: '2025-11-05', endDate: '2025-11-15', color: 'bg-yellow-500' },
  { id: 4, employee: 'Pedro Santos', startDate: '2025-11-20', endDate: '2025-12-05', color: 'bg-red-500' },
];

const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

const getMonthName = (month: number) => ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'][month];

export default function VacationCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month); // 0 = Sunday, 1 = Monday, etc.

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyCells = Array.from({ length: firstDay === 0 ? 6 : firstDay - 1 }, (_, i) => i); // Ajuste para começar na Segunda

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const getEventsForDay = (day: number) => {
    const dayString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return mockEvents.filter(event => dayString >= event.startDate && dayString <= event.endDate);
  };

  return (
    <div className="bg-white shadow-lg rounded-xl p-6">
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <h2 className="text-2xl font-bold text-gray-900">{getMonthName(month)} de {year}</h2>
        <div className="flex space-x-2">
          <button onClick={goToPreviousMonth} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <button onClick={goToNextMonth} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 text-center text-sm font-medium text-gray-600 mb-2">
        {['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'].map(day => (
          <div key={day} className="py-2">{day}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {emptyCells.map((_, index) => (
          <div key={`empty-${index}`} className="h-24"></div>
        ))}
        {days.map(day => {
          const events = getEventsForDay(day);
          const isToday = day === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear();

          return (
            <div key={day} className={`h-24 border border-gray-200 rounded-lg p-1 text-sm overflow-y-auto ${isToday ? 'bg-blue-50 border-blue-400' : 'bg-white'}`}>
              <div className={`font-bold ${isToday ? 'text-blue-700' : 'text-gray-900'}`}>{day}</div>
              <div className="mt-1 space-y-1">
                {events.slice(0, 2).map(event => (
                  <div key={event.id} className={`text-xs text-white p-1 rounded truncate ${event.color}`} title={event.employee}>
                    {event.employee.split(' ')[0]}
                  </div>
                ))}
                {events.length > 2 && (
                  <div className="text-xs text-gray-600 p-1">
                    +{events.length - 2} mais
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Legenda */}
      <div className="mt-6 border-t pt-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Resumo de Férias no Mês</h3>
        <ul className="space-y-2">
          {mockEvents
            .filter(event => {
                const start = new Date(event.startDate);
                const end = new Date(event.endDate);
                return (start.getFullYear() === year && start.getMonth() === month) || 
                       (end.getFullYear() === year && end.getMonth() === month);
            })
            .map(event => (
            <li key={event.id} className="flex items-center text-sm text-gray-700">
              <div className={`w-3 h-3 rounded-full mr-3 ${event.color}`}></div>
              <User className="w-4 h-4 mr-1" />
              <span className="font-medium mr-2">{event.employee}</span>
              <Clock className="w-4 h-4 mr-1 ml-2" />
              <span>{event.startDate} a {event.endDate}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

