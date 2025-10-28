const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const token = localStorage.getItem('token');

    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Auth methods
  async login(email: string, password: string) {
    return this.request<{
      token: string;
      user: {
        id: number;
        name: string;
        email: string;
        role: string;
      };
    }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(userData: {
    name: string;
    email: string;
    password: string;
    role?: string;
  }) {
    return this.request<{
      token: string;
      user: {
        id: number;
        name: string;
        email: string;
        role: string;
      };
    }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  // Employee methods
  async getEmployees() {
    return this.request<any[]>('/employees');
  }

  async getEmployee(id: number) {
    return this.request<any>(`/employees/${id}`);
  }

  async createEmployee(employeeData: {
    name: string;
    email: string;
    cpf: string;
    position: string;
    department: string;
    hireDate: string;
  }) {
    return this.request<any>('/employees', {
      method: 'POST',
      body: JSON.stringify(employeeData),
    });
  }

  async updateEmployee(id: number, employeeData: Partial<{
    name: string;
    email: string;
    cpf: string;
    position: string;
    department: string;
    hireDate: string;
  }>) {
    return this.request<any>(`/employees/${id}`, {
      method: 'PUT',
      body: JSON.stringify(employeeData),
    });
  }

  async deleteEmployee(id: number) {
    return this.request<void>(`/employees/${id}`, {
      method: 'DELETE',
    });
  }

  async getDashboardStats() {
    return this.request<{
      totalEmployees: number;
      employeesOK: number;
      employeesPending: number;
      employeesAlert: number;
      documentsExpiringSoon: number;
    }>('/employees/stats/dashboard');
  }

  // Document methods
  async getEmployeeDocuments(employeeId: number) {
    return this.request<any[]>(`/documents/employee/${employeeId}`);
  }

  async uploadDocument(formData: FormData) {
    const token = localStorage.getItem('token');
    
    const response = await fetch(`${this.baseURL}/documents/upload`, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  }

  async deleteDocument(id: number) {
    return this.request<void>(`/documents/${id}`, {
      method: 'DELETE',
    });
  }

  async downloadDocument(id: number) {
    const token = localStorage.getItem('token');
    
    const response = await fetch(`${this.baseURL}/documents/${id}/download`, {
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.blob();
  }

  async updateDocumentStatus(id: number, status: string) {
    return this.request<any>(`/documents/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  async getDocumentStatsByStatus() {
    return this.request<Array<{
      status: string;
      count: number;
    }>>('/documents/stats/by-status');
  }

  async getDashboardStats() {
    return this.request<{
      totalEmployees: number;
      employeesOK: number;
      employeesPending: number;
      employeesAlert: number;
      documentsExpiringSoon: number;
    }>('/employees/stats/dashboard');
  }

  async createEmployee(data: {
    name: string;
    email: string;
    cpf: string;
    position: string;
    department: string;
    hireDate: string;
  }) {
    return this.request<any>('/employees', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Métodos de Férias
  async getVacations() {
    return this.request<any[]>('/vacations');
  }

  async getEmployeeVacations(employeeId: number) {
    return this.request<any[]>(`/vacations/employee/${employeeId}`);
  }

  async requestVacation(data: {
    employeeId: number;
    startDate: string;
    endDate: string;
    type: string;
    isAbonoPecuniario?: boolean;
    abonoDays?: number;
  }) {
    return this.request<any>('/vacations', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateVacationStatus(vacationId: number, data: {
    status: 'Aprovada' | 'Rejeitada';
    approvedBy: string;
    rejectedReason?: string;
  }) {
    return this.request<any>(`/vacations/${vacationId}/status`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async getVacationCalendar(year: number, month: number) {
    return this.request<any[]>(`/vacations/calendar/${year}/${month}`);
  }

  async getVacationStats() {
    return this.request<{
      totalVacations: number;
      pendingVacations: number;
      approvedVacations: number;
      rejectedVacations: number;
      upcomingVacations: number;
    }>('/vacations/stats/dashboard');
  }
}

export const api = new ApiClient(API_BASE_URL);
export default api;

