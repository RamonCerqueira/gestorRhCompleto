'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Layout from './Layout'; // Importa o Layout com Sidebar

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Se ainda estiver carregando, não faz nada
    if (isLoading) return;

    // Redireciona para o login se não estiver autenticado e não estiver na página de login
    if (!user && pathname !== '/login') {
      router.push('/login');
    }
    
    // Redireciona para o dashboard se estiver logado e tentar acessar a página de login
    if (user && pathname === '/login') {
      router.push('/dashboard');
    }

  }, [user, isLoading, router, pathname]);

  // Se estiver carregando ou na página de login, renderiza apenas o conteúdo
  if (isLoading || pathname === '/login') {
    return <>{children}</>;
  }

  // Para as rotas protegidas, usa o Layout com Sidebar
  return (
    <Layout>
      {children}
    </Layout>
  );
}

