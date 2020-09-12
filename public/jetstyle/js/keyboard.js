for (let keyboardContainer of document.querySelectorAll('.keyboard')) {

  let keyboard = (keyboardContainer, language) => {

    // Объявляем цифры
    let digits = '1234567890'.split('');

    // Объявляем алфавиты ([алфавит, количество букв в первой строке клавиатуры, -//- во второй строке])
    let alphabets = {
      ru: ['йцукенгшщзхъфывапролджэёячсмитьбю'.split(''), 12, 12],
      ru2: ['абвгдеёжзийклмнопрстуфхцчшщъыьэюя'.split(''), 12, 12],
      en: ['qwertyuiopasdfghjklzxcvbnm'.split(''), 10, 9],
      en2: ['abcdefghijklmnopqrstuvwxyz'.split(''),  10, 9],
    };

    // Выбираем язык по-умолчанию
    if (language === undefined) language = 'ru';

    // Добавляем поле для вывода вводимого текста
    let outputField = document.createElement('div');
    outputField.className = 'output-field';
    if (keyboardContainer.querySelector('.output-field') === null) {
      keyboardContainer.append(outputField);
      // ...и span в него для отображения курсора
      let span = document.createElement('span');
      span.setAttribute('placeholder', 'Начните вводить с экранной клавиатуры');
      outputField.append(span);
    }
    outputField = keyboardContainer.querySelector('.output-field span');

    // Добавляем блок для кнопок
    let buttons = document.createElement('div');
    buttons.className = 'buttons';
    keyboardContainer.append(buttons);

    // Добавляем блок ряда
    let row = document.createElement('div');
    row.className = 'row';
    buttons.append(row);

    // Добавляем кнопки c цифрами
    let index = 0;
    digits.forEach((item) => {
      let digit = document.createElement('div');
      digit.className = 'button';
      digit.setAttribute('tabindex', ++index);
      digit.innerHTML = item;
      row.append(digit);
    });

    // ...кнопку backspace
    let backspace = document.createElement('div');
    backspace.className = 'button backspace';
    backspace.setAttribute('tabindex', ++index);
    row.append(backspace);

    // Добавляем первый ряд с буквами
    row = document.createElement('div');
    row.className = 'row';
    buttons.append(row);
    let letters = alphabets[language][0];
    for (let i = 0; i < alphabets[language][1]; i++) {
      let letter = document.createElement('div');
      letter.className = 'button';
      letter.setAttribute('tabindex', ++index);
      letter.innerHTML = letters[i];
      row.append(letter);
    };

    // ...второй ряд с буквами
    row = document.createElement('div');
    row.className = 'row';
    buttons.append(row);
    for (let i = alphabets[language][1]; i < alphabets[language][1] + alphabets[language][2]; i++) {
      let letter = document.createElement('div');
      letter.className = 'button';
      letter.setAttribute('tabindex', ++index);
      letter.innerHTML = letters[i];
      row.append(letter);
    };

    // ...и третий
    row = document.createElement('div');
    row.className = 'row';
    buttons.append(row);
    for (let i = alphabets[language][1] + alphabets[language][2]; i < alphabets[language][0].length; i++) {
      let letter = document.createElement('div');
      letter.className = 'button';
      letter.setAttribute('tabindex', ++index);
      letter.innerHTML = letters[i];
      row.append(letter);
    };

    // И еще один новый ряд
    row = document.createElement('div');
    row.className = 'row';
    buttons.append(row);

    // ...для кнопки смены языка
    let changeLanguage = document.createElement('div');
    changeLanguage.className = 'button change-language';
    changeLanguage.setAttribute('tabindex', ++index);
    row.append(changeLanguage);

    // ...и для пробела
    let space = document.createElement('div');
    space.className = 'button space';
    space.setAttribute('tabindex', ++index);
    space.innerHTML = ' ';
    row.append(space);

    // Отправляем символы в итоговое поле при клике на кнопках для ввода
    let inputButtons = keyboardContainer.querySelectorAll('[class="button"]');
    inputButtons = Array.prototype.slice.call(inputButtons); // Конвертируем NodeList в массив
    inputButtons = inputButtons.concat(keyboardContainer.querySelector('.button.space')); // Добавляем пробел к обрабатываемым для клика клавишам
    inputButtons.forEach((item) => {
      item.addEventListener('click', () => {
        outputField.innerHTML += item.innerHTML
      });
    });

    // Стираем один символ при клике на backspace
    backspace.addEventListener('click', () => {
      outputField.innerHTML = outputField.innerHTML.substr(0, outputField.innerHTML.length - 1);
    });

    // Переключаем язык при клике по кнопке смены языка
    changeLanguage.addEventListener('click', () => {
      // Удаляем все имеющиеся кнопки
      buttons.remove();
      // Сбрасываем фокус
      document.activeElement = null;
      // Определяем язык, на который нужно переключиться
      let languages = [];
      for (key in alphabets) languages.push(key);
      let currentLanguageNumber;
      for (let i = 0; i < languages.length; i++) {
        if (language == languages[i]) {
          currentLanguageNumber = i;
        }
      }
      let newLanguageNumber = (currentLanguageNumber == languages.length - 1) ? 0 : ++currentLanguageNumber;
      // Собственно, переключаемся
      document.removeEventListener('keydown', whenEnterImitateClick); //Не забыв снять сохраняющийся обработчик событий
      keyboard(keyboardContainer, languages[newLanguageNumber]);
    });

    // При нажатии Enter имитируем клик
    let whenEnterImitateClick = (e) => {
      if (e.code == 'Enter') {
        // ...по кнопке в фокусе
        if (document.activeElement.classList.contains('button')) {
          document.activeElement.click();
          // ...либо по той, что под ховером
        } else {
          keyboardContainer.querySelector('.button:hover').click();
        }
      }
    }
    document.addEventListener('keydown', whenEnterImitateClick);

    // А еще можно добавить имитацию нажатий на экранную клавиатуре при использовании физической. Мелочь, а будет прикольно. Подумаю...

    // Теперь пофиксим мелкие недочеты.
    let allButtons = keyboardContainer.querySelectorAll('.buttons .button');

    // Вычисляем и устанавливаем оптимальную ширину буквенных кнопок
    for (let key in alphabets) {
      alphabets[key].push(alphabets[key][0].length - alphabets[key][1] - alphabets[key][2]);
      alphabets[key][3] = 100 / Math.max(alphabets[key][1], alphabets[key][2], alphabets[key][3]);
    }
    letterButtons = keyboardContainer.querySelectorAll('.buttons .row:nth-child(2) .button, .buttons .row:nth-child(3) .button, .buttons .row:nth-child(4) .button');
    for (let item of letterButtons) {
      item.style.width = 'calc(' + alphabets[language][3] + '% - 10px)';
    }

    // Убираем фокусировку с клавиши при срабатывании ховера (а точнее, mouseover)
    allButtons.forEach((item) => {
      item.addEventListener('mouseover', () => {
        document.activeElement.blur();
      });
      // Возврат фокуса при ховере над той же клавишей, с которой его только что убрали. Пока оказалось больше проблем, чем пользы, отключил.
      // item.addEventListener('mousemove', () => {
      //   item.focus();
      // });
    });

    // И наоборот, убираем возможность ховера при фокусировке на любой клавише
    allButtons.forEach((item) => {
      item.addEventListener('focus', () => {
        keyboardContainer.querySelector('.buttons').classList.add('no-hover');
      });
      // При расфокусе обратно возвращаем возможность ховера
      item.addEventListener('blur', () => {
        keyboardContainer.querySelector('.buttons').classList.remove('no-hover');
      })
    });

  }

  keyboard(keyboardContainer);

}
