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
        <p>Игра по финансовой грамотности для школ Казахстана</p>
        
        <button onclick="game.showLevels()">🎮 Начать игру</button>
        <button onclick="game.showProgress()">📊 Мой прогресс</button>
        <button onclick="game.showAbout()">ℹ️ О приложении</button>
      </div>
    `;
    
    this.styleMenu();
  }

  showLevels() {
    this.app.innerHTML = `
      <div class="levels">
        <button onclick="game.showMenu()" class="back-btn">← Назад</button>
        <h2>Выберите уровень</h2>
        
        <div class="levels-grid">
          <div class="level-card" onclick="game.startLevel(1)">
            <h3>Уровень 1</h3>
            <p>🏦 Основы банковского дела</p>
            <span class="progress">0/10</span>
          </div>
          
          <div class="level-card" onclick="game.startLevel(2)">
            <h3>Уровень 2</h3>
            <p>💳 Кредиты и займы</p>
            <span class="progress">0/10</span>
          </div>
          
          <div class="level-card" onclick="game.startLevel(3)">
            <h3>Уровень 3</h3>
            <p>📈 Инвестиции и портфель</p>
            <span class="progress">0/10</span>
          </div>
          
          <div class="level-card" onclick="game.startLevel(4)">
            <h3>Уровень 4</h3>
            <p>🛒 Бюджет и расходы</p>
            <span class="progress">0/10</span>
          </div>
        </div>
      </div>
    `;
    
    this.styleLevels();
  }

  startLevel(levelNum) {
    alert(`Уровень ${levelNum} - скоро будет готов! 🚀`);
    console.log(`Запуск уровня ${levelNum}`);
  }

  showProgress() {
    const { name, score, level, coins } = this.playerData;
    this.app.innerHTML = `
      <div class="progress">
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
          <p><strong>Финансовый Геймер</strong> - интерактивная обучающая игра для развития финансовой грамотности учащихся школ Казахстана.</p>
          
          <h3>Возможности:</h3>
          <ul>
            <li>✅ Работает без интернета (PWA)</li>
            <li>✅ Установка на рабочий стол и смартфон</li>
            <li>✅ Отслеживание прогресса</li>
            <li>✅ Достижения и награды</li>
          </ul>
          
          <h3>Версия:</h3>
          <p>v1.0.0</p>
        </div>
      </div>
    `;
  }

  styleMenu() {
    const style = document.createElement('style');
    style.textContent = `
      .menu {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-height: 100vh;
        text-align: center;
        padding: 20px;
      }
      .menu h1 {
        font-size: 48px;
        margin-bottom: 10px;
      }
      .menu p {
        font-size: 18px;
        margin-bottom: 40px;
        color: #666;
      }
      .menu button {
        width: 200px;
        margin: 10px 0;
        padding: 15px;
        font-size: 18px;
      }
    `;
    document.head.appendChild(style);
  }

  styleLevels() {
    const style = document.createElement('style');
    style.textContent = `
      .levels {
        padding: 20px;
      }
      .back-btn {
        margin-bottom: 20px;
        background: #666;
      }
      .levels-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 20px;
        margin-top: 20px;
      }
      .level-card {
        background: white;
        padding: 20px;
        border-radius: 12px;
        cursor: pointer;
        border: 2px solid var(--border);
        transition: all 0.3s;
      }
      .level-card:hover {
        border-color: var(--primary);
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        transform: translateY(-4px);
      }
      .level-card h3 {
        margin-bottom: 10px;
      }
    `;
    document.head.appendChild(style);
  }
}

// Инициализация приложения
const game = new FinanceGame();
