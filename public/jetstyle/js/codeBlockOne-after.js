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
