import { getAggregatedHardWords, getAllUserWords } from '../model/helpers/apiHelpers';
import { SprintGameModel } from '../model/SprintGameModel';
import { AggregatedWord, Optional, UserWordPlus, WordPlusUserWord } from '../types';
import { LoginData } from '../types/loginTypes';
import { combineWords } from '../view/helpers/combineArr';
import { SprintGameView } from '../view/SprintGameView';
import { refactorResponse } from './helpers/controlHelpers';

export class SprintGameController {
  view;
  model;

  constructor(main: HTMLElement) {
    this.view = new SprintGameView(main);
    this.model = new SprintGameModel();
  }
  
  async show(level?: number, page?: number) {
    const userJSON = localStorage.getItem('user');
    const user: LoginData = JSON.parse(localStorage.getItem('user') as string);

    if(page !== undefined && level !== undefined) { 
  
        if (userJSON && level !== 6) { 
          const data = await this.model.getGameData(page, level);
          const userWords: UserWordPlus[] = await getAllUserWords(user.id, user.token);
          const tempObj = combineWords(data, userWords);
          const userRes: WordPlusUserWord[] = tempObj.combinedArr;
          const userRes1 = userRes.filter((item) => (!(<Optional>item.optional) || ((<Optional>item.optional) && <Optional>item.optional).learned === 'no'));          
          this.view.render(userRes1, user);  
        }
          
        else if (userJSON && level === 6) {
          const temp = await getAggregatedHardWords(user.id, user.token);
          const userRes: AggregatedWord[] = temp[0].paginatedResults;
          const userResNew = refactorResponse(userRes);
          this.view.render(userResNew, user);
        }
 
        else
        {        
         const data = await this.model.getGameData(page, level);
         this.view.render(data);
        }
    } 
    
    else if (page === undefined || level === undefined){
      if(userJSON) this.view.render(undefined, user);
      else this.view.render();
    }
  }

  stopGame() {
    this.view.stopGame()
  }
}
