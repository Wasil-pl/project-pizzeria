import {templates, select} from '../settings.js';
import utils from '../utils.js';

class Home {
  constructor(element) {
    const thisHome = this;

    thisHome.render(element);

  }

  render() {
    const thisHome = this;

    const generatedHTML = templates.home();
    console.log('generatedHTML:', generatedHTML);

    thisHome.element = utils.createDOMFromHTML(generatedHTML);
    console.log('thisHome.element:', thisHome.element);

    const homeWrapper = document.querySelector(select.containerOf.homePage);
    console.log('homeWrapper:', homeWrapper);

    homeWrapper.appendChild(thisHome.element).innerHTML;
  }
}

export default Home;