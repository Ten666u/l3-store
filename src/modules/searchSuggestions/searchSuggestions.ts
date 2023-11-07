import { ViewTemplate } from '../../utils/viewTemplate';
import { View } from '../../utils/view';
import suggHtml from './searchSuggestions.tpl.html'

const suggestionsJson = require('./suggestions.json');

export class searchSuggestions {
    suggestions: Array<string>;
    view: View;
    root: View;
    searchInput: HTMLInputElement;
    
    constructor(searchInput: HTMLInputElement, root: View) {
        this.searchInput = searchInput
        this.view = new ViewTemplate(suggHtml).cloneView();
        this.root = root
        this.suggestions = suggestionsJson.suggestions
        this.render()
    }
  
    private render() {
      this.suggestions.forEach((txt, index) => {
        this.view[`suggestion${index + 1}`].innerText = txt
        this.view[`suggestion${index + 1}`].onclick = this.clickSuggEvent.bind(this, index)  
      })
      this.root.appendChild(this.view.root);
    }

    private clickSuggEvent(index: number){
      this.searchInput.value = this.suggestions[index]
    }
}