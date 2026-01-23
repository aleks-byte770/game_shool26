// Приложение для учителей

class TeacherApp {
  constructor() {
    this.app = document.getElementById('app');
    this.currentView = 'dashboard';
    this.teacherData = null;
    this.students = [];
    this.init();
  }

  async init() {
    // Проверка аутентификации
    if (!window.api.isAuthenticated()) {
      this.showLoginPage();
      return;
    }

    try {
      // TODO: Получить данные учителя с сервера
      this.teacherData = {
        name: 'Учитель',
        email: 'teacher@example.com',
        school: 'Школа №1'
      };
      this.showDashboard();
    } catch (err) {
      console.error(err);
      this.showLoginPage();
    }
  }

  showLoginPage() {
    this.app.innerHTML = `
      <div class="login-page">
        <div class="login-container">
          <h1>👨‍🏫 Панель Учителя</h1>
          <p>Вход в систему для учителей</p>
          
          <form onsubmit="window.teacherApp.handleLogin(event)">
            <div class="form-group">
              <label>Email</label>
              <input type="email" id="loginEmail" required>
            </div>
            <div class="form-group">
              <label>Пароль</label>
              <input type="password" id="loginPassword" required>
            </div>
            <button type="submit" class="btn-submit">Войти</button>
          </form>
          
          <p class="register-link">
            Нет аккаунта? <a href="#" onclick="window.teacherApp.showRegisterPage(); return false;">Зарегистрироваться</a>
          </p>
          
          <a href="/" class="back-link">← Вернуться на главную</a>
        </div>
      </div>
    `;
  }

  showRegisterPage() {
    this.app.innerHTML = `
      <div class="login-page">
        <div class="login-container">
          <h1>👨‍🏫 Регистрация Учителя</h1>
          
          <form onsubmit="window.teacherApp.handleRegister(event)">
            <div class="form-group">
              <label>Имя и фамилия</label>
              <input type="text" id="registerName" required>
            </div>
            <div class="form-group">
              <label>Email</label>
              <input type="email" id="registerEmail" required>
            </div>
            <div class="form-group">
              <label>Пароль</label>
              <input type="password" id="registerPassword" required>
            </div>
            <div class="form-group">
              <label>Подтвердите пароль</label>
              <input type="password" id="registerPasswordConfirm" required>
            </div>
            <div class="form-group">
              <label>Школа</label>
              <input type="text" id="registerSchool" required>
            </div>
            <button type="submit" class="btn-submit">Зарегистрироваться</button>
          </form>
          
          <p class="register-link">
            Уже есть аккаунт? <a href="#" onclick="window.teacherApp.showLoginPage(); return false;">Войти</a>
          </p>
        </div>
      </div>
    `;
  }

  async handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
      const response = await window.api.loginTeacher(email, password);
      window.api.setToken(response.token);
      this.teacherData = response.teacher;
      this.showDashboard();
    } catch (err) {
      alert('Ошибка входа: ' + err.message);
    }
  }

  async handleRegister(event) {
    event.preventDefault();
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const passwordConfirm = document.getElementById('registerPasswordConfirm').value;
    const school = document.getElementById('registerSchool').value;

    if (password !== passwordConfirm) {
      alert('Пароли не совпадают!');
      return;
    }

    try {
      const response = await window.api.registerTeacher({
        name, email, password, school
      });
      window.api.setToken(response.token);
      this.teacherData = response.teacher;
      this.showDashboard();
    } catch (err) {
      alert('Ошибка регистрации: ' + err.message);
    }
  }

  showDashboard() {
    this.currentView = 'dashboard';
    this.render();
  }

  showStudents() {
    this.currentView = 'students';
    this.render();
  }

  showResults() {
    this.currentView = 'results';
    this.render();
  }

  showGroups() {
    this.currentView = 'groups';
    this.render();
  }

  showAnalytics() {
    this.currentView = 'analytics';
    this.render();
  }

  async render() {
    const sidebar = this.renderSidebar();
    const content = this.renderContent();

    this.app.innerHTML = `
      <div id="app-container" style="display: grid; grid-template-columns: 250px 1fr; min-height: 100vh;">
        ${sidebar}
        ${content}
      </div>
    `;

    // Добавляем обработчики событий
    this.attachEventListeners();
  }

  renderSidebar() {
    return `
      <div class="sidebar">
        <div class="sidebar-header">
          <h1>👨‍🏫 Учитель</h1>
        </div>
        
        <div class="sidebar-nav">
          <button class="nav-item ${this.currentView === 'dashboard' ? 'active' : ''}" 
            onclick="window.teacherApp.showDashboard()">
            📊 Панель
          </button>
          <button class="nav-item ${this.currentView === 'students' ? 'active' : ''}" 
            onclick="window.teacherApp.showStudents()">
            👥 Ученики
          </button>
          <button class="nav-item ${this.currentView === 'results' ? 'active' : ''}" 
            onclick="window.teacherApp.showResults()">
            📈 Результаты
          </button>
          <button class="nav-item ${this.currentView === 'groups' ? 'active' : ''}" 
            onclick="window.teacherApp.showGroups()">
            📚 Группы/Классы
          </button>
          <button class="nav-item ${this.currentView === 'analytics' ? 'active' : ''}" 
            onclick="window.teacherApp.showAnalytics()">
            📉 Аналитика
          </button>
        </div>
        
        <div class="sidebar-user">
          <div class="user-name">${this.teacherData.name}</div>
          <div class="user-email">${this.teacherData.email}</div>
          <button class="logout-btn" onclick="window.teacherApp.logout()">Выход</button>
        </div>
      </div>
    `;
  }

  renderContent() {
    switch (this.currentView) {
      case 'dashboard':
        return this.renderDashboard();
      case 'students':
        return this.renderStudents();
      case 'results':
        return this.renderResults();
      case 'groups':
        return this.renderGroups();
      case 'analytics':
        return this.renderAnalytics();
      default:
        return this.renderDashboard();
    }
  }

  renderDashboard() {
    return `
      <div class="main-content">
        <div class="page-header">
          <h2>📊 Панель управления</h2>
          <p>Добро пожаловать, ${this.teacherData.name}!</p>
        </div>
        
        <div class="stats-grid">
          <div class="stat-box">
            <h3>Всего учеников</h3>
            <div class="value">24</div>
          </div>
          <div class="stat-box">
            <h3>Пройденных тестов</h3>
            <div class="value">156</div>
          </div>
          <div class="stat-box">
            <h3>Средний балл</h3>
            <div class="value">76%</div>
          </div>
          <div class="stat-box">
            <h3>Активные группы</h3>
            <div class="value">3</div>
          </div>
        </div>
        
        <div class="table-container">
          <div class="table-header">
            <h3>Недавние результаты</h3>
          </div>
          <table>
            <thead>
              <tr>
                <th>Ученик</th>
                <th>Тема</th>
                <th>Класс</th>
                <th>Результат</th>
                <th>Дата</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Иван Иванов</td>
                <td>Основы банковского дела</td>
                <td>7</td>
                <td>85%</td>
                <td>21.01.2024</td>
                <td>
                  <button class="action-btn btn-primary">Просмотр</button>
                </td>
              </tr>
              <tr>
                <td>Анна Петрова</td>
                <td>Кредиты и займы</td>
                <td>7</td>
                <td>92%</td>
                <td>21.01.2024</td>
                <td>
                  <button class="action-btn btn-primary">Просмотр</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  renderStudents() {
    return `
      <div class="main-content">
        <div class="page-header">
          <h2>👥 Мои ученики</h2>
          <p>Управление списком учеников и их данными</p>
        </div>
        
        <div class="table-container">
          <div class="table-header">
            <h3>Список учеников</h3>
            <input class="search-input" type="text" placeholder="Поиск по имени...">
          </div>
          <table>
            <thead>
              <tr>
                <th>Имя</th>
                <th>Email</th>
                <th>Класс</th>
                <th>Баллы</th>
                <th>Монеты</th>
                <th>Тесты</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Иван Иванов</td>
                <td>ivan@example.com</td>
                <td>7</td>
                <td>380</td>
                <td>250</td>
                <td>12</td>
                <td>
                  <button class="action-btn btn-primary">Просмотр</button>
                  <button class="action-btn btn-secondary">Удалить</button>
                </td>
              </tr>
              <tr>
                <td>Анна Петрова</td>
                <td>anna@example.com</td>
                <td>7</td>
                <td>425</td>
                <td>320</td>
                <td>15</td>
                <td>
                  <button class="action-btn btn-primary">Просмотр</button>
                  <button class="action-btn btn-secondary">Удалить</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  renderResults() {
    return `
      <div class="main-content">
        <div class="page-header">
          <h2>📈 Результаты тестов</h2>
          <p>Анализ успеваемости учеников</p>
        </div>
        
        <div class="stats-grid">
          <div class="stat-box">
            <h3>Средняя успеваемость</h3>
            <div class="value">78.5%</div>
          </div>
          <div class="stat-box">
            <h3>Лучший результат</h3>
            <div class="value">100%</div>
          </div>
          <div class="stat-box">
            <h3>Худший результат</h3>
            <div class="value">45%</div>
          </div>
        </div>
        
        <div class="table-container">
          <div class="table-header">
            <h3>Все результаты</h3>
            <input class="search-input" type="text" placeholder="Поиск...">
          </div>
          <table>
            <thead>
              <tr>
                <th>Ученик</th>
                <th>Тема</th>
                <th>Правильно</th>
                <th>Процент</th>
                <th>Монеты</th>
                <th>Дата</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Иван Иванов</td>
                <td>Основы банковского дела</td>
                <td>4/5</td>
                <td>80%</td>
                <td>+40</td>
                <td>21.01.2024</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  renderGroups() {
    return `
      <div class="main-content">
        <div class="page-header">
          <h2>📚 Группы и классы</h2>
          <p>Организация учеников в группы</p>
        </div>
        
        <button style="margin-bottom: 20px; padding: 10px 20px; background: var(--primary); color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 600;">
          + Создать группу
        </button>
        
        <div class="resources-grid">
          <div class="resource-card">
            <h4>7 класс А</h4>
            <p>12 учеников</p>
            <p style="font-size: 12px; color: var(--text-secondary);">Создана: 01.09.2023</p>
            <button class="action-btn btn-primary" style="margin-top: 10px;">Управление</button>
          </div>
          <div class="resource-card">
            <h4>7 класс Б</h4>
            <p>13 учеников</p>
            <p style="font-size: 12px; color: var(--text-secondary);">Создана: 01.09.2023</p>
            <button class="action-btn btn-primary" style="margin-top: 10px;">Управление</button>
          </div>
        </div>
      </div>
    `;
  }

  renderAnalytics() {
    return `
      <div class="main-content">
        <div class="page-header">
          <h2>📉 Аналитика</h2>
          <p>Детальный анализ прогресса</p>
        </div>
        
        <div class="stats-grid">
          <div class="stat-box">
            <h3>Прохождение курса</h3>
            <div class="value">67%</div>
          </div>
          <div class="stat-box">
            <h3>Активные ученики</h3>
            <div class="value">21/24</div>
          </div>
          <div class="stat-box">
            <h3>Полные тесты</h3>
            <div class="value">156</div>
          </div>
        </div>
        
        <div class="resources-grid">
          <div class="resource-card">
            <h4>Популярные темы</h4>
            <p>Основы банковского дела (32 пройдено)</p>
            <p>Кредиты и займы (28 пройдено)</p>
            <p>Инвестиции (15 пройдено)</p>
          </div>
          <div class="resource-card">
            <h4>Сложные темы</h4>
            <p>Инвестиции (средний балл: 65%)</p>
            <p>Портфель (средний балл: 72%)</p>
            <p>Налоги (средний балл: 74%)</p>
          </div>
        </div>
      </div>
    `;
  }

  attachEventListeners() {
    // Поиск в таблицах
    const searchInputs = document.querySelectorAll('.search-input');
    searchInputs.forEach(input => {
      input.addEventListener('input', (e) => {
        this.filterTable(e.target.value);
      });
    });
  }

  filterTable(query) {
    // TODO: Реализовать фильтрацию таблицы
    console.log('Поиск:', query);
  }

  logout() {
    window.api.logout();
    this.showLoginPage();
  }
}

// Инициализация приложения
const teacherApp = new TeacherApp();
window.teacherApp = teacherApp;
