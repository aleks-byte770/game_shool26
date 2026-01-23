// API клиент для взаимодействия с Backend

class APIClient {
  constructor() {
    // Используйте переменную окружения или локальный сервер для разработки
    this.baseUrl = window.API_URL || 'http://localhost:5000/api';
    this.token = localStorage.getItem('authToken');
  }

  // Методы аутентификации
  async registerStudent(data) {
    return this.post('/students/register', data);
  }

  async loginTeacher(email, password) {
    return this.post('/teachers/login', { email, password });
  }

  async registerTeacher(data) {
    return this.post('/teachers/register', data);
  }

  // Методы для студентов
  async getStudentProfile() {
    return this.get('/students/profile');
  }

  async getStudentResults() {
    return this.get('/students/results');
  }

  async saveTestResult(data) {
    return this.post('/results', data);
  }

  // Методы для учителей
  async getTeacherStudents() {
    return this.get('/teachers/students');
  }

  // Админ методы
  async getAdminLogs() {
    return this.get('/admin/logs');
  }

  async getAdminStatistics() {
    return this.get('/admin/statistics');
  }

  // Утилиты
  async get(endpoint) {
    return this.request(endpoint, {
      method: 'GET'
    });
  }

  async post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = options.headers || {};

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers
      });

      if (response.status === 401) {
        this.logout();
        throw new Error('Сеанс истёк. Пожалуйста, войдите снова.');
      }

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.error || `HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  setToken(token) {
    this.token = token;
    localStorage.setItem('authToken', token);
  }

  logout() {
    this.token = null;
    localStorage.removeItem('authToken');
  }

  isAuthenticated() {
    return !!this.token;
  }
}

// Создаём глобальный экземпляр
window.api = new APIClient();
