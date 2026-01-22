(function(){
  window.GameEngine = {
    startLevel(levelNum, hostGame) {
      const level = window.Levels && window.Levels[levelNum];
      if (!level) {
        alert('Уровень не найден.');
        return;
      }

      hostGame.currentScreen = `level-${levelNum}`;

      const container = hostGame.app;
      let currentIndex = 0;
      let correctCount = 0;

      function renderQuestion() {
        const q = level.questions[currentIndex];
        container.innerHTML = `
          <div class="level-screen container">
            <button class="back-btn">← Назад</button>
            <h2>${level.title}</h2>
            <p>${level.description}</p>
            <div class="question-card">
              <h3>Вопрос ${currentIndex + 1} из ${level.questions.length}</h3>
              <p class="q-text">${q.text}</p>
              <div class="choices"></div>
            </div>
          </div>
        `;

        const choicesEl = container.querySelector('.choices');
        q.choices.forEach((choice, idx) => {
          const btn = document.createElement('button');
          btn.textContent = choice;
          btn.className = 'choice-btn';
          btn.addEventListener('click', () => onAnswer(idx));
          choicesEl.appendChild(btn);
        });

        container.querySelector('.back-btn').addEventListener('click', () => {
          hostGame.showLevels();
        });
      }

      function onAnswer(selectedIdx) {
        const q = level.questions[currentIndex];
        const correct = selectedIdx === q.correctIndex;
        if (correct) correctCount++;

        const resultEmoji = correct ? '✅' : '❌';
        const resultColor = correct ? 'var(--success)' : 'var(--danger)';
        const resultText = correct ? 'Правильно!' : 'Неправильно!';

        // Показать краткое объяснение и кнопку Далее
        container.innerHTML = `
          <div class="level-screen container">
            <button class="back-btn">← Назад</button>
            <h2>${level.title}</h2>
            <div class="question-feedback">
              <p class="q-text">${q.text}</p>
              <div style="background: #f8f9fa; padding: 15px; border-radius: 6px; margin: 15px 0;">
                <p style="margin-bottom: 8px;"><strong>Ваш ответ:</strong></p>
                <p style="color: ${resultColor}; font-weight: 600;">${q.choices[selectedIdx]}</p>
              </div>
              <p style="font-size: 24px; color: ${resultColor}; font-weight: 700; text-align: center; margin: 20px 0;">${resultEmoji} ${resultText}</p>
              <p class="explain">${q.explanation}</p>
              <button class="next-btn">Далее →</button>
            </div>
          </div>
        `;

        container.querySelector('.back-btn').addEventListener('click', () => {
          hostGame.showLevels();
        });

        container.querySelector('.next-btn').addEventListener('click', () => {
          currentIndex++;
          if (currentIndex < level.questions.length) {
            renderQuestion();
          } else {
            finishLevel();
          }
        });
      }

      function finishLevel() {
        const reward = level.reward || { coinsPerCorrect: 1, pointsPerCorrect: 10 };
        const pointsEarned = correctCount * reward.pointsPerCorrect;
        const coinsEarned = correctCount * reward.coinsPerCorrect;
        const percentage = Math.round((correctCount / level.questions.length) * 100);

        // Обновляем данные игрока
        hostGame.playerData.score = (hostGame.playerData.score || 0) + pointsEarned;
        hostGame.playerData.coins = (hostGame.playerData.coins || 0) + coinsEarned;
        hostGame.playerData.lastPlayed = new Date().toISOString();
        // Если игрок прошёл этот уровень впервые — повысим уровень
        if ((hostGame.playerData.level || 1) <= levelNum) {
          hostGame.playerData.level = levelNum + 1;
        }

        hostGame.savePlayerData();

        let feedbackEmoji = '🎉';
        if (percentage < 50) feedbackEmoji = '💪';
        else if (percentage < 80) feedbackEmoji = '👍';

        container.innerHTML = `
          <div class="level-complete container">
            <div style="text-align: center;">
              <h2 style="font-size: 48px; margin: 30px 0;">${feedbackEmoji} Уровень пройден!</h2>
              <p style="font-size: 20px; margin: 20px 0;">Правильных ответов: <strong>${correctCount} из ${level.questions.length}</strong></p>
              <p style="font-size: 18px; margin: 15px 0;">Результат: <strong style="color: var(--primary);">${percentage}%</strong></p>
              <p style="font-size: 18px; margin: 20px 0;">
                Получено очков: <span style="color: var(--success); font-weight: 600;">+${pointsEarned}</span> | 
                Монет: <span style="color: var(--warning); font-weight: 600;">+${coinsEarned}</span>
              </p>
              
              <div style="margin-top: 40px; display: flex; gap: 10px; flex-wrap: wrap; justify-content: center;">
                <button class="menu-btn">📋 В меню</button>
                <button class="replay-btn">🔄 Пройти снова</button>
                <button class="levels-btn">📚 Выбрать уровень</button>
              </div>
            </div>
          </div>
        `;

        container.querySelector('.menu-btn').addEventListener('click', () => hostGame.showMenu());
        container.querySelector('.replay-btn').addEventListener('click', () => {
          currentIndex = 0; correctCount = 0; renderQuestion();
        });
        container.querySelector('.levels-btn').addEventListener('click', () => hostGame.showLevels());
      }

      // Начинаем
      renderQuestion();
    }
  };
})();
