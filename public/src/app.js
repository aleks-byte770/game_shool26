// Главное приложение
class FinanceGame {
  constructor() {
    this.app = document.getElementById('app');
    this.currentScreen = 'menu';
    this.playerData = this.loadPlayerData();
    this.init();
  }

  init() {
    this.showMenu();
  }

  loadPlayerData() {
    const saved = localStorage.getItem('playerData');
    return saved ? JSON.parse(saved) : {
      name: '',
      score: 0,
      level: 1,
      coins: 0,
      achievements: [],
      lastPlayed: null
    };
  }

  savePlayerData() {
    localStorage.setItem('playerData', JSON.stringify(this.playerData));
  }

  showMenu() {
    this.app.innerHTML = `
      <div class="menu">
        <h1>💰 Финансовый Геймер</h1>
        <p>Игра по финансовой грамотности для школ</p>
        
        <div class="menu-buttons">
          <button onclick="game.showGradeSelection()">🎮 Начать игру</button>
          <button onclick="game.showProgress()">📊 Мой прогресс</button>
          <button onclick="game.showAbout()">ℹ️ О приложении</button>
          <button onclick="game.showTeacherLogin()">👨‍🏫 Вход для учителей</button>
        </div>
      </div>
    `;
  }

  showGradeSelection() {
    this.app.innerHTML = `
      <div class="grade-selection container">
        <button onclick="game.showMenu()" class="back-btn">← Назад</button>
        <h2>Выберите класс</h2>
        <p>Уровень сложности подбирается в зависимости от вашего класса</p>
        
        <div class="grades-grid">
          <h3>Начальная школа (1-4 классы)</h3>
          <div class="grades-row">
            <button onclick="game.showLevels(1)" class="grade-btn">1 класс</button>
            <button onclick="game.showLevels(2)" class="grade-btn">2 класс</button>
            <button onclick="game.showLevels(3)" class="grade-btn">3 класс</button>
            <button onclick="game.showLevels(4)" class="grade-btn">4 класс</button>
          </div>
          
          <h3>Средняя школа (5-8 классы)</h3>
          <div class="grades-row">
            <button onclick="game.showLevels(5)" class="grade-btn">5 класс</button>
            <button onclick="game.showLevels(6)" class="grade-btn">6 класс</button>
            <button onclick="game.showLevels(7)" class="grade-btn">7 класс</button>
            <button onclick="game.showLevels(8)" class="grade-btn">8 класс</button>
          </div>
          
          <h3>Старшая школа (9-11 классы)</h3>
          <div class="grades-row">
            <button onclick="game.showLevels(9)" class="grade-btn">9 класс</button>
            <button onclick="game.showLevels(10)" class="grade-btn">10 класс</button>
            <button onclick="game.showLevels(11)" class="grade-btn">11 класс</button>
          </div>
        </div>
      </div>
    `;
  }

  showLevels(grade) {
    this.currentGrade = grade;
    const classLevels = window.LevelsByClass && window.LevelsByClass[grade];
    
    if (!classLevels) {
      alert('Уровни для этого класса еще не готовы.');
      return;
    }

    let levelCards = '';
    for (let levelId in classLevels) {
      const level = classLevels[levelId];
      levelCards += `
        <div class="level-card" onclick="game.startLevel(${levelId})">
          <h3>Тема ${levelId}</h3>
          <p>${level.title}</p>
          <small>${level.description}</small>
          <span class="progress">0/${level.questions.length}</span>
        </div>
      `;
    }

    this.app.innerHTML = `
      <div class="levels container">
        <button onclick="game.showGradeSelection()" class="back-btn">← Назад</button>
        <h2>Класс ${grade} - Выберите тему</h2>
        
        <div class="levels-grid">
          ${levelCards}
        </div>
      </div>
    `;
  }

  startLevel(levelNum) {
    // Получаем уровень из структуры по классам
    const classLevels = window.LevelsByClass && window.LevelsByClass[this.currentGrade];
    const level = classLevels && classLevels[levelNum];
    
    if (!level) {
      alert('Уровень не найден.');
      return;
    }

    if (window.GameEngine && typeof window.GameEngine.startLevel === 'function') {
      window.GameEngine.startLevel(level, this);
    } else {
      alert(`Уровень "${level.title}" - скоро будет готов! 🚀`);
      console.log(`Запуск уровня`, level);
    }
  }

  showTeacherLogin() {
    this.app.innerHTML = `
      <div class="teacher-login container">
        <button onclick="game.showMenu()" class="back-btn">← Назад</button>
        <h2>👨‍🏫 Вход для учителей</h2>
        
        <form class="login-form" onsubmit="event.preventDefault(); game.handleTeacherLogin();">
          <input type="email" id="teacherEmail" placeholder="Email" required>
          <input type="password" id="teacherPassword" placeholder="Пароль" required>
          <button type="submit">Войти</button>
          <p>У вас нет аккаунта? <a href="#" onclick="game.showTeacherRegister(); return false;">Зарегистрироваться</a></p>
        </form>
      </div>
    `;
  }

  handleTeacherLogin() {
    const email = document.getElementById('teacherEmail').value;
    const password = document.getElementById('teacherPassword').value;
    
    // TODO: Отправить на сервер для проверки
    console.log('Попытка входа учителя:', email);
    alert('Функция входа будет реализована после настройки Backend.');
  }

  showTeacherRegister() {
    this.app.innerHTML = `
      <div class="teacher-register container">
        <button onclick="game.showTeacherLogin()" class="back-btn">← Назад</button>
        <h2>👨‍🏫 Регистрация учителя</h2>
        
        <form class="login-form" onsubmit="event.preventDefault(); game.handleTeacherRegister();">
          <input type="text" id="teacherName" placeholder="Имя и фамилия" required>
          <input type="email" id="teacherEmail" placeholder="Email" required>
          <input type="password" id="teacherPassword" placeholder="Пароль" required>
          <input type="password" id="teacherPasswordConfirm" placeholder="Подтвердите пароль" required>
          <input type="text" id="teacherSchool" placeholder="Школа" required>
          <button type="submit">Зарегистрироваться</button>
        </form>
      </div>
    `;
  }

  handleTeacherRegister() {
    const name = document.getElementById('teacherName').value;
    const email = document.getElementById('teacherEmail').value;
    const password = document.getElementById('teacherPassword').value;
    const passwordConfirm = document.getElementById('teacherPasswordConfirm').value;
    
    if (password !== passwordConfirm) {
      alert('Пароли не совпадают!');
      return;
    }
    
    console.log('Регистрация учителя:', { name, email });
    alert('Регистрация будет реализована после настройки Backend.');
  }

  showProgress() {
    const { name, score, level, coins } = this.playerData;
    this.app.innerHTML = `
      <div class="progress-page container">
        <button onclick="game.showMenu()" class="back-btn">← Назад</button>
        <h2>📊 Мой прогресс</h2>
        
        <div class="stats">
          <div class="stat-card">
            <h4>Имя</h4>
            <p>${name || 'Не указано'}</p>
          </div>
          <div class="stat-card">
            <h4>Уровень</h4>
            <p>${level}</p>
          </div>
          <div class="stat-card">
            <h4>Очки</h4>
            <p>${score}</p>
          </div>
          <div class="stat-card">
            <h4>Монеты</h4>
            <p>💰 ${coins}</p>
          </div>
        </div>
      </div>
    `;
  }

  showAbout() {
    this.app.innerHTML = `
      <div class="about">
        <button onclick="game.showMenu()" class="back-btn">← Назад</button>
        <h2>ℹ️ О приложении</h2>
        
        <div class="about-content">
          <p><strong>Финансовый Геймер</strong> - интерактивная обучающая игра для развития финансовой грамотности учащихся школ.</p>
          
          <h3>Возможности:</h3>
          <ul>
            <li>✅ Работает без интернета (PWA)</li>
            <li>✅ Установка на рабочий стол и смартфон</li>
            <li>✅ Отслеживание прогресса</li>
            <li>✅ Достижения и награды</li>
            <li>✅ 4 уровня обучения</li>
          </ul>
          
          <h3>Версия:</h3>
          <p>v1.1.5</p>
        </div>
      </div>
    `;
  }
}

// Инициализация приложения
window.game = new FinanceGame();
