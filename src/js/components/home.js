import {select, templates} from '../settings.js';
import utils from '../utils.js';

class Home {
  constructor(element) {
    const thisHome = this;

    thisHome.render(element);
    thisHome.carousel();
  }

  render(element) {
    const thisHome = this;

    const generatedHTML = templates.home();

    thisHome.element = utils.createDOMFromHTML(generatedHTML);

    element.appendChild(thisHome.element).innerHTML;
  }

  carousel() {
    // eslint-disable-next-line no-undef
    new Flickity(select.containerOf.carousel, {
      imagesLoaded: true,
      percentPosition: false,
      autoPlay: true,
      prevNextButtons: false,
    });
  }

}

export default Home;