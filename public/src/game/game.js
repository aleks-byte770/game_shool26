(function(){
  window.GameEngine = {
    startLevel(level, hostGame) {
      if (!level) {
        alert('Уровень не найден.');
        return;
      }

      hostGame.currentScreen = `level-${level.id || 'unknown'}`;

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
          hostGame.showGradeSelection();
        });
      }

      function onAnswer(selectedIdx) {
        const q = level.questions[currentIndex];
        const correct = selectedIdx === q.correctIndex;
        if (correct) correctCount++;

        const resultEmoji = correct ? '✅' : '❌';
        const resultText = correct ? 'Правильно!' : 'Неправильно!';
        const explanationText = q.explanation;

        container.innerHTML = `
          <div class="level-screen container">
            <div class="result-card">
              <h2>${resultEmoji} ${resultText}</h2>
              <p class="explanation">${explanationText}</p>
              <button onclick="window.GameEngine.continueLevel()">Далее →</button>
            </div>
          </div>
        `;
      }

      window.GameEngine.continueLevel = function() {
        currentIndex++;
        if (currentIndex < level.questions.length) {
          renderQuestion();
        } else {
          showResults();
        }
      };

      function showResults() {
        const percentage = Math.round((correctCount / level.questions.length) * 100);
        const coinsEarned = correctCount * (level.reward?.coinsPerCorrect || 10);
        const pointsEarned = correctCount * (level.reward?.pointsPerCorrect || 10);
        
        hostGame.playerData.coins += coinsEarned;
        hostGame.playerData.score += pointsEarned;
        hostGame.savePlayerData();

        // Попытка сохранить результат на сервер (если доступно)
        if (window.api && window.api.isAuthenticated()) {
          window.api.saveTestResult({
            levelId: level.id || 1,
            grade: hostGame.currentGrade,
            correctAnswers: correctCount,
            totalQuestions: level.questions.length,
            coinsEarned: coinsEarned
          }).catch(err => console.log('Не удалось сохранить на сервер:', err));
        }

        container.innerHTML = `
          <div class="level-screen container">
            <div class="results-card">
              <h2>🎉 Тест завершен!</h2>
              <div class="result-stats">
                <div class="stat">
                  <h3>${correctCount}/${level.questions.length}</h3>
                  <p>Правильных ответов</p>
                </div>
                <div class="stat">
                  <h3>${percentage}%</h3>
                  <p>Успешность</p>
                </div>
                <div class="stat">
                  <h3>+${coinsEarned} 💰</h3>
                  <p>Монеты</p>
                </div>
              </div>
              <button onclick="window.game.showLevels(${hostGame.currentGrade})">Вернуться к уровням</button>
            </div>
          </div>
        `;
      }

      renderQuestion();
    }
  };
})();
