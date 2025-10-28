'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';

export default function ProfilePage() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: user?.name || 'Usuário Comum',
    email: user?.email || 'user@docgestor.com',
    position: 'Analista de RH',
    department: 'Recursos Humanos',
    cpf: '123.456.789-00',
    phone: '(11) 99999-9999',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulação de salvamento
    alert('Perfil atualizado com sucesso! (Simulado)');
    setIsEditing(false);
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Meu Perfil</h1>
      
      <div className="bg-white shadow-xl rounded-xl p-8">
        <div className="flex items-center space-x-6 mb-8 border-b pb-6">
          {/* Foto/Avatar do Usuário */}
          <div className="relative w-24 h-24 flex-shrink-0">
            <div className="w-full h-full bg-blue-100 rounded-full flex items-center justify-center text-4xl font-bold text-blue-600 border-4 border-blue-300">
              {profile.name.charAt(0).toUpperCase()}
            </div>
            {/* Botão para upload de foto (simulado) */}
            <button 
              title="Mudar Foto"
              className="absolute bottom-0 right-0 bg-green-500 hover:bg-green-600 text-white p-1 rounded-full border-2 border-white transition-colors"
              onClick={() => alert('Funcionalidade de Upload de Foto (Em Breve)')}
            >
               <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
            </button>
          </div>
          
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{profile.name}</h2>
            <p className="text-lg text-gray-600">{profile.position} - {profile.department}</p>
            <p className="text-sm text-gray-500 mt-1">Status: Ativo</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nome Completo</label>
              <input 
                type="text" 
                id="name" 
                name="name"
                value={profile.name}
                onChange={handleChange}
                disabled={!isEditing}
                className={`mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 ${isEditing ? 'bg-white' : 'bg-gray-50'}`} 
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input 
                type="email" 
                id="email" 
                name="email"
                value={profile.email}
                onChange={handleChange}
                disabled={true} // Email não editável
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-gray-100 cursor-not-allowed" 
              />
            </div>
            <div>
              <label htmlFor="cpf" className="block text-sm font-medium text-gray-700">CPF</label>
              <input 
                type="text" 
                id="cpf" 
                name="cpf"
                value={profile.cpf}
                onChange={handleChange}
                disabled={true} // CPF não editável
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-gray-100 cursor-not-allowed" 
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Telefone</label>
              <input 
                type="tel" 
                id="phone" 
                name="phone"
                value={profile.phone}
                onChange={handleChange}
                disabled={!isEditing}
                className={`mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 ${isEditing ? 'bg-white' : 'bg-gray-50'}`} 
              />
            </div>
            <div>
              <label htmlFor="position" className="block text-sm font-medium text-gray-700">Cargo</label>
              <input 
                type="text" 
                id="position" 
                name="position"
                value={profile.position}
                onChange={handleChange}
                disabled={true} // Cargo não editável
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-gray-100 cursor-not-allowed" 
              />
            </div>
            <div>
              <label htmlFor="department" className="block text-sm font-medium text-gray-700">Departamento</label>
              <input 
                type="text" 
                id="department" 
                name="department"
                value={profile.department}
                onChange={handleChange}
                disabled={true} // Departamento não editável
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-gray-100 cursor-not-allowed" 
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-4 pt-4">
            {isEditing ? (
              <>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Salvar Alterações
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center"
              >
                <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                Editar Perfil
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

