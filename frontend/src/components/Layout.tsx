'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface LayoutProps {
  children: React.ReactNode;
}

const allMenuItems = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: '📊',
    roles: ['admin', 'user'],
  },
  {
    name: 'Funcionários',
    href: '/employees',
    icon: '👥',
    roles: ['admin'],
    submenu: [
      { name: 'Ver Todos', href: '/employees' },
      { name: 'Adicionar Novo', href: '/employees/new' },
    ],
  },
  {
    name: 'Documentos',
    href: '/documents',
    icon: '📄',
    roles: ['admin', 'user'],
    submenu: [
      { name: 'Biblioteca de Modelos', href: '/documents/templates', roles: ['admin'] },
      { name: 'Gerenciador de Validades', href: '/documents/expiring', roles: ['admin'] },
      { name: 'Meus Documentos', href: '/documents/my-documents', roles: ['user'] },
      { name: 'Solicitar Férias', href: '/vacations/request', roles: ['user'] },
    ],
  },
  {
    name: 'Gestão de Férias',
    href: '/vacations',
    icon: '🏖️',
    roles: ['admin', 'user'],
    submenu: [
      { name: 'Visão Geral', href: '/vacations', roles: ['admin'] },
      { name: 'Solicitar Férias', href: '/vacations/request', roles: ['user'] },
    ],
  },
  {
    name: 'Contratos',
    href: '/contracts',
    icon: '📝',
    roles: ['admin'],
  },
  {
    name: 'Relatórios',
    href: '/reports',
    icon: '📈',
    roles: ['admin'],
  },
  {
    name: 'Configurações',
    href: '/settings',
    icon: '⚙️',
    roles: ['admin'],
  },
];

export default function Layout({ children }: LayoutProps) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);
  const pathname = usePathname();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const toggleSubmenu = (menuName: string) => {
    setExpandedMenu(expandedMenu === menuName ? null : menuName);
  };

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(href + '/');
  };

  const filteredMenuItems = allMenuItems.filter(item => item.roles.includes(user?.role || 'user'));

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 lg:static lg:inset-0`}>
        
        {/* Logo */}
        <div className="flex items-center justify-center h-16 px-4 border-b border-gray-200">
          <div className="flex items-center">
            <div className="h-8 w-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center mr-3">
              <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <span className="text-xl font-semibold text-gray-900">Doc-Gestor RH</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-8 px-4">
          <ul className="space-y-2">
            {filteredMenuItems.map((item) => (
              <li key={item.name}>
                <div>
                  <Link
                    href={item.href}
                    onClick={() => item.submenu && toggleSubmenu(item.name)}
                    className={`flex items-center justify-between px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${
                      isActive(item.href)
                        ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center">
                      <span className="mr-3 text-lg">{item.icon}</span>
                      {item.name}
                    </div>
                    {item.submenu && (
                      <svg
                        className={`w-4 h-4 transition-transform duration-200 ${
                          expandedMenu === item.name ? 'rotate-180' : ''
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    )}
                  </Link>
                </div>

                {/* Submenu */}
                {item.submenu && expandedMenu === item.name && (
                  <ul className="mt-2 ml-8 space-y-1">
                    {item.submenu.filter(subItem => subItem.roles === undefined || subItem.roles.includes(user?.role || 'user')).map((subItem) => (
                      <li key={subItem.name}>
                        <Link
                          href={subItem.href}
                          className={`block px-4 py-2 text-sm rounded-lg transition-colors duration-200 ${
                            isActive(subItem.href)
                              ? 'bg-blue-50 text-blue-700'
                              : 'text-gray-600 hover:bg-gray-100'
                          }`}
                        >
                          {subItem.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* User Info */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <div className="flex items-center">
            <div className="h-8 w-8 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-gray-700">{user?.name[0] || 'U'}</span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">{user?.name || 'Usuário'}</p>
              <p className="text-xs text-gray-500">{user?.email || 'email@exemplo.com'}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="mt-3 w-full bg-red-500 text-white py-2 px-4 rounded-lg text-sm hover:bg-red-600 transition-colors"
          >
            Sair
          </button>
        </div>
      </div>

      {/* Overlay para mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 lg:ml-0">
        {/* Mobile Header */}
        <div className="lg:hidden bg-white shadow-sm border-b">
          <div className="flex items-center justify-between h-16 px-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-gray-600 hover:text-gray-900"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="text-lg font-semibold text-gray-900">Doc-Gestor RH</h1>
            <div></div>
          </div>
        </div>

        {/* Page Content */}
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}

