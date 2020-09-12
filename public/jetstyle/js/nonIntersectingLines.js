for (let gameContainer of document.querySelectorAll('.nonIntersectingLines')) {

  let nonIntersectingLines = (gameContainer) => {

    // Определяем количество точек
    let dotsNumber = 5;

    // Генерирование случайного числа в определенном диапазоне
    let randomNumber = (min, max) => {
      return Math.random() * (max - min) + min;
    }

    // Добавляем точки
    let dots = document.createElement('div');
    dots.className = 'dots';
    gameContainer.append(dots);
    for (let i = 0; i < dotsNumber; i++) {
      let dot = document.createElement('div');
      dot.className = 'dot';
      dot.innerHTML = i + 1;
      dots.append(dot);
    };

    // Готовим canvas
    let canvas = document.createElement('canvas');
    gameContainer.prepend(canvas);
    canvas.setAttribute('width', gameContainer.offsetWidth * window.devicePixelRatio + 'px');
    canvas.setAttribute('height', gameContainer.offsetHeight * window.devicePixelRatio + 'px');
    canvas.style.height = '100%';
    let context = canvas.getContext('2d');
    context.scale(window.devicePixelRatio, window.devicePixelRatio);

    // Определяем случайное количество линий
    let maxLinesNumber = 0;
    for (let i = dotsNumber; i > 0; i--) maxLinesNumber += i - 1;
    let linesNumber = Math.round(randomNumber(2, maxLinesNumber));

    // Функция проверки наличия в массиве определенного набора точек
    let isThisPairUsed = (pair, array) => {
      for (let item of array) {
        if ((item[0] == pair[0] && item[1] == pair[1]) || (item[0] == pair[1] && item[1] == pair[0])) { return true; } else { continue };
      };
      return false;
    };

    // Подбираем пары точек, которые будут соединены
    let pairs = [];
    for (let i = 1; i <= linesNumber; i++) {
      let dotFrom, dotTo;
      do {
        dotFrom = Math.round(randomNumber(1, dotsNumber));
        do { dotTo = Math.round(randomNumber(1, dotsNumber)) } while (dotFrom == dotTo);
      } while (isThisPairUsed([dotFrom, dotTo], pairs));
      pairs.push([dotFrom, dotTo]);
    };

    // Функция для рисования линий
    let drawLines = (pairs) => {
      context.clearRect(0, 0, canvas.width, canvas.height);
      for (let pair of pairs) {
        let dotFromNumber = pair[0], dotToNumber = pair[1];

        let dotFrom = gameContainer.querySelector('.dot:nth-child(' + dotFromNumber + ')');
        let dotFromX = dotFrom.style.left; dotFromX = Number(dotFromX.substring(0, dotFromX.length - 2)) + dotFrom.offsetWidth / 2;
        let dotFromY = dotFrom.style.top; dotFromY = Number(dotFromY.substring(0, dotFromY.length - 2)) + dotFrom.offsetHeight / 2;

        let dotTo = gameContainer.querySelector('.dot:nth-child(' + dotToNumber + ')');
        let dotToX = dotTo.style.left; dotToX = Number(dotToX.substring(0, dotToX.length - 2)) + dotTo.offsetWidth / 2;
        let dotToY = dotTo.style.top; dotToY = Number(dotToY.substring(0, dotToY.length - 2)) + dotTo.offsetHeight / 2;

        context.beginPath();
        context.moveTo(dotFromX, dotFromY);
        context.lineTo(dotToX, dotToY);
        context.lineWidth = 2;
        context.strokeStyle = '#ddd';
        context.stroke();
      }
    }

    // Теперь для каждой точки
    for (let dot of gameContainer.querySelectorAll('.dot')) {

      // Считаем минимальные и максимальные допустимые координаты, чтобы сгенерированные точки не выходили за рамки родительского блока
      let minX = 0 + dot.offsetWidth / 2;
      let maxX = gameContainer.offsetWidth - dot.offsetWidth / 2;
      let minY = 0 + dot.offsetHeight / 2;
      let maxY = gameContainer.offsetHeight - dot.offsetHeight / 2;

      // Можно добавить проверку координат точек на близость. Если точки слишком близко друг к другу, подобрать другие координаты.

      // Расставляем точки по начальным координатам
      dot.style.left = randomNumber(minX, maxX) - dot.offsetWidth / 2 + 'px';
      dot.style.top = randomNumber(minY, maxY) - dot.offsetHeight / 2 + 'px';

      // Рисуем начальные линии
      drawLines(pairs);

      // При нажатии кнопки мыши
      dot.onmousedown = (e) => {

        // Вычисляем координаты курсора относительно точки, чтобы перетаскивать не за центр, а именно там где взяли
        let shiftX = e.pageX - (window.pageXOffset + dot.getBoundingClientRect().left);
        let shiftY = e.pageY - (window.pageYOffset + dot.getBoundingClientRect().top);

        // Вычисляем будущие координаты курсора и начинаем вслед за ним перемещать точку
        let moveDot = (e) => {

          // Вычисляем координаты курсора относительно контейнера, для этого из координат курсора вычитаем координаты блока
          let cursorX = e.pageX - (window.pageXOffset + gameContainer.getBoundingClientRect().left);
          let cursorY = e.pageY - (window.pageYOffset + gameContainer.getBoundingClientRect().top);

          // Считаем новые минимальные и максимальные допустимые координаты, с учетом фиксирования точки произвольным образом под курсором
          minX = 0 + shiftX;
          maxX = gameContainer.offsetWidth - (dot.offsetWidth - shiftX);
          minY = 0 + shiftY;
          maxY = gameContainer.offsetHeight - (dot.offsetHeight - shiftY);

          // Перемещаем за курсором и в заданных рамках точку со сдвигом
          if (cursorX >= minX && cursorX <= maxX) dot.style.left = cursorX - shiftX + 'px';
          if (cursorY >= minY && cursorY <= maxY) dot.style.top = cursorY - shiftY + 'px';

          // Перерисовываем положение линий
          drawLines(pairs);

        }

        // Теперь выполняем всё вышеописанное при движении курсора
        document.addEventListener('mousemove', moveDot);

        // Фиксируем всё, что двигалось до этого момента
        let stopMove = () => {
          // Прекращаем движение точек
          document.removeEventListener('mousemove', moveDot);

          let numberOfIntersections = 0;
          // Выполняем попарную проверку на пересечение всех линий
          for (let pairOne of pairs) { // Выбираем случайно первую линию (пару соединенных между собой точек)

            let dotOne = pairOne[0], dotTwo = pairOne[1];

            dotOne = gameContainer.querySelector('.dot:nth-child(' + dotOne + ')');
            let x1 = dotOne.style.left; x1 = Number(x1.substring(0, x1.length - 2)) + dotOne.offsetWidth / 2;
            let y1 = dotOne.style.top; y1 = Number(y1.substring(0, y1.length - 2)) + dotOne.offsetHeight / 2;

            dotTwo = gameContainer.querySelector('.dot:nth-child(' + dotTwo + ')');
            let x2 = dotTwo.style.left; x2 = Number(x2.substring(0, x2.length - 2)) + dotTwo.offsetWidth / 2;
            let y2 = dotTwo.style.top; y2 = Number(y2.substring(0, y2.length - 2)) + dotTwo.offsetHeight / 2;

            for (let pairTwo of pairs) { // ...и выбираем вторую линию так же

              let dotThree = pairTwo[0], dotFour = pairTwo[1];

              if (dotThree == dotOne && dotFour == dotTwo) continue; // Если была выбрана та же линия, выбираем другую

              dotThree = gameContainer.querySelector('.dot:nth-child(' + dotThree + ')');
              let x3 = dotThree.style.left; x3 = Number(x3.substring(0, x3.length - 2)) + dotThree.offsetWidth / 2;
              let y3 = dotThree.style.top; y3 = Number(y3.substring(0, y3.length - 2)) + dotThree.offsetHeight / 2;

              dotFour = gameContainer.querySelector('.dot:nth-child(' + dotFour + ')');
              let x4 = dotFour.style.left; x4 = Number(x4.substring(0, x4.length - 2)) + dotFour.offsetWidth / 2;
              let y4 = dotFour.style.top; y4 = Number(y4.substring(0, y4.length - 2)) + dotFour.offsetHeight / 2;

              // Функция для проверки факта пересечения отрезков
              let isIntersection = (ax1, ay1, ax2, ay2, bx1, by1, bx2, by2) => {
                v1 = (bx2 - bx1) * (ay1 - by1) - (by2 - by1) * (ax1 - bx1);
                v2 = (bx2 - bx1) * (ay2 - by1) - (by2 - by1) * (ax2 - bx1);
                v3 = (ax2 - ax1) * (by1 - ay1) - (ay2 - ay1) * (bx1 - ax1);
                v4 = (ax2 - ax1) * (by2 - ay1) - (ay2 - ay1) * (bx2 - ax1);

                if ((v1 * v2 < 0) && (v3 * v4 < 0)) return true; else return false;
              }
              if (isIntersection(x1, y1, x2, y2, x3, y3, x4, y4)) numberOfIntersections++;
            }
          }

          numberOfIntersections = numberOfIntersections / 2;

          // Выводим уведомление о победе
          if (numberOfIntersections == 0) {
            let popupContainer = document.createElement('div');
            popupContainer.className = 'popup-container';
            gameContainer.append(popupContainer);

            let popup = document.createElement('div');
            popup.className = 'popup';
            popup.innerHTML = '<div class="text">Поздравляем, вы победили!<br>Линии больше не пересекаются.</div>';
            popupContainer.append(popup);

            let button = document.createElement('button');
            button.className = 'button';
            button.innerHTML = 'Начать заново';
            popup.append(button);

            let showPopup = () => popup.classList.add('shown');
            setTimeout(showPopup, 0);

            // При нажатии кнопки начинаем игру заново
            button.addEventListener('click', () => {
              let previousSibling = gameContainer.previousElementSibling;
              gameContainer.remove();
              gameContainer = document.createElement('div');
              gameContainer.className = 'nonIntersectingLines';
              previousSibling.after(gameContainer);
              nonIntersectingLines(gameContainer);
            });
          }

          // И отключаем перетаскивание точек
          document.removeEventListener('mouseup', stopMove);
        }
        // Теперь при отпускании мыши выполняем всё это
        document.addEventListener('mouseup', stopMove);
      }
    }
  }
  nonIntersectingLines(gameContainer);
}
