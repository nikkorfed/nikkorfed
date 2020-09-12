// Блок кода #1

let func = (string, a, b) => {

  // Проверяем входную строку на непустоту
	if (string != '') {

    let index = string.length - 1; // Номер последнего символа
    let isFound = false; // Переменная, отражающая результат поиска

    while (!isFound) { // Выполняем проверку символов с конца, пока не найдем совпадение
      if (string[index] == a || string[index] == b) { // Если символ совпал с переменными a или b
        isFound = true;
        return index;
      } else if (index < 0) { // Если ничего не нашли и индекс стал меньше 0, возвращаем -1
        return -1;
      } else { // В остальных случаях продолжаем
        index--;
      }
    }

  } else return -1;

}

// Блок кода #2
function drawRating(vote) {
	if (vote >= 0 && vote <= 20) {
    	return '★☆☆☆☆';
	}
	else if (vote > 20 && vote <= 40) {
		return '★★☆☆☆';
	}
	else if (vote > 40 && vote <= 60) {
		return '★★★☆☆';
	}
	else if (vote > 60 && vote <= 80) {
		return '★★★★☆';
	}
	else if (vote > 80 && vote <= 100) {
		return '★★★★★';
	}
}

// Проверка работы результата
console.log(func('строка', 'т', 'о'));
console.log(drawRating(0) ); // ★☆☆☆☆
console.log(drawRating(1) ); // ★☆☆☆☆
console.log(drawRating(50)); // ★★★☆☆
console.log(drawRating(99)); // ★★★★★
