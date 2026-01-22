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

        // Показать краткое объяснение и кнопку Далее
        container.innerHTML = `
          <div class="level-screen container">
            <button class="back-btn">← Назад</button>
            <h2>${level.title}</h2>
            <div class="question-feedback">
              <p class="q-text">${q.text}</p>
              <p><strong>Ваш ответ:</strong> ${q.choices[selectedIdx]}</p>
              <p><strong>${correct ? 'Правильно ✅' : 'Неправильно ❌'}</strong></p>
              <p class="explain">${q.explanation}</p>
              <button class="next-btn">Далее</button>
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

        // Обновляем данные игрока
        hostGame.playerData.score = (hostGame.playerData.score || 0) + pointsEarned;
        hostGame.playerData.coins = (hostGame.playerData.coins || 0) + coinsEarned;
        hostGame.playerData.lastPlayed = new Date().toISOString();
        // Если игрок прошёл этот уровень впервые — повысим уровень
        if ((hostGame.playerData.level || 1) <= levelNum) {
          hostGame.playerData.level = levelNum + 1;
        }

        hostGame.savePlayerData();

        container.innerHTML = `
          <div class="level-complete container">
            <h2>Уровень пройден</h2>
            <p>Правильных ответов: ${correctCount} из ${level.questions.length}</p>
            <p>Получено очков: ${pointsEarned} | Монет: ${coinsEarned}</p>
            <button class="menu-btn">В меню</button>
            <button class="replay-btn">Пройти снова</button>
            <button class="levels-btn">Выбрать уровень</button>
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
