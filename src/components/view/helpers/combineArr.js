export const combineWords = (res, userWords) => {
    let num = 0;
    // 1 - превращаем в объект вида { id_слова: { инфа по слову из res } }
    const resToObj = res.reduce((acc, curr) => {
        acc[curr.id] = curr;
        return acc;
    }, {});

    // 2 - обходим каждое из userWords. Если id совпал - объединяем
    userWords.forEach(({ wordId, difficulty, optional }) => {
        if (wordId in resToObj) {
            if (difficulty === 'difficult' || optional.learned === 'yes') num += 1;
            resToObj[wordId] = {
                ...resToObj[wordId],
                difficulty,
                optional,
            };
        }
    });

    // 3 превращаем п.1 опять в массив :)
    const combinedArr = Object.values(resToObj);
    return { combinedArr, num };
};