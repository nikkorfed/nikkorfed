let ruslan = (req, res) => {
  let word = req.body.request.nlu.tokens[req.body.request.nlu.tokens.length - 1];
  let answer;

  let consonants = "бвгджзклмнпрстфхцчшщ";
  let vowels = "аеёийоуыэюя";

  if (!word) answer = "Теперь я буду вести себя как Руслан. Скажите мне любое слово.";
  else {
    if (consonants.includes(word[0])) word = word.slice(1);
    if (consonants.includes(word[0])) word = word.slice(1);

    if (word[0] == "а" || word[0] == "я") answer = "хуя" + word.slice(1);
    else if (word[0] == "е" || word[0] == "э") answer = "хуе" + word.slice(1);
    else if (word[0] == "ё" || word[0] == "о") answer = "хуи" + word;
    else if (word[0] == "и" || word[0] == "й") answer = "хуи" + word.slice(1);
    else if (word[0] == "у" || word[0] == "ю") answer = "хую" + word.slice(1);
    else answer = "хуе" + word;
  }

  res.json({ response: { text: answer, tts: `${answer.slice(0, 2)}${answer.slice(2)}`, end_session: false }, version: "1.0" });
};

module.exports = ruslan;
