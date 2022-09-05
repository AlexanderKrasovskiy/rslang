import { AggregatedWord } from '../../types';

export function refactorResponse(arr: AggregatedWord[]) {
  return arr.map((el) => {
    const newObj = {
      ...el,
      /* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */
      id: el._id as string,
      difficulty: el?.userWord?.difficulty,
      optional: el?.userWord?.optional,
    };

    /* eslint-disable-next-line @typescript-eslint/naming-convention */
    delete newObj._id;
    delete newObj.userWord;

    return newObj;
  });
}
