import {settings, select} from '../settings.js';

class AmountWidget {
  constructor(element, amount){
    const thisWidget = this;

    thisWidget.getElements(element);
    thisWidget.initAction();
    thisWidget.setValue(amount);
  }

  getElements(element){
    const thisWidget = this;

    thisWidget.dom = {
      wrapper: element,
      input: element.querySelector(select.widgets.amount.input),
      linkDecrease: element.querySelector(select.widgets.amount.linkDecrease),
      linkIncrease: element.querySelector(select.widgets.amount.linkIncrease)
    };

    thisWidget.setValue(settings.amountWidget.defaultValue);
  }

  setValue(value){
    const thisWidget = this;

    const newValue = parseInt(value);

    if (thisWidget.value !== newValue &&
    !isNaN(newValue) && 
    newValue >= settings.amountWidget.defaultMin && 
    newValue <= settings.amountWidget.defaultMax) {
      thisWidget.value = newValue;
    }

    thisWidget.dom.input.value = thisWidget.value;
    thisWidget.announce();
  }

  announce(){
    const thisWidget = this;
    
    const event = new CustomEvent('updated', {
      bubbles: true
    });
    thisWidget.dom.wrapper.dispatchEvent(event);
  }

  initAction() {
    const thisWidget = this;
    
    const action = function() {
      thisWidget.setValue(thisWidget.dom.input.value);
    };
    thisWidget.dom.input.addEventListener('change', action);

    const decrase = function(event) { 
      event.preventDefault();
      thisWidget.setValue(thisWidget.value - 1);
    };
    thisWidget.dom.linkDecrease.addEventListener('click', decrase);

    const increase = function(event) { 
      event.preventDefault();
      thisWidget.setValue(thisWidget.value + 1);
    };
    thisWidget.dom.linkIncrease.addEventListener('click', increase);
  }
}

export default AmountWidget;