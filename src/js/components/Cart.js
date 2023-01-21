import {settings, select, classNames, templates} from '../settings.js';
import CartProduct from './CartProduct.js';
import utils from '../utils.js';

class Cart {
  constructor(element){ 
    const thisCart = this;

    thisCart.products = [];

    thisCart.getElements(element);
    thisCart.initAction();
  }

  getElements(element){
    const thisCart = this;

    thisCart.dom = {
      wrapper: element,
      deliveryFee: element.querySelector(select.cart.deliveryFee),
      toggleTrigger: element.querySelector(select.cart.toggleTrigger),
      productList: element.querySelector(select.cart.productList),
      subtotalPrice: element.querySelector(select.cart.subtotalPrice),
      totalPrice: element.querySelectorAll(select.cart.totalPrice),
      totalNumber: element.querySelector(select.cart.totalNumber),
      form: element.querySelector(select.cart.form),
      phone: element.querySelector(select.cart.phone),
      address: element.querySelector(select.cart.address)
    };
  }

  initAction(){
    const thisCart = this;

    thisCart.dom.toggleTrigger.addEventListener('click', function(){
      thisCart.dom.wrapper.classList.toggle(classNames.cart.wrapperActive);
    });

    thisCart.dom.productList.addEventListener('updated', function(){
      thisCart.update();
    });

    thisCart.dom.productList.addEventListener('remove', function(event){
      thisCart.remove(event.detail.cartProduct);
    });

    const validatePhoneNumber = /^\d{9}$/;

    thisCart.dom.form.addEventListener('submit', function(event){
      event.preventDefault();

      if (thisCart.products == 0) {
        return window.alert('Cart is empty');
      }

      if (!thisCart.dom.phone.value.match(validatePhoneNumber)) {
        return window.alert('Please enter a valid phone number (min 9 digits)');
      }

      if (thisCart.dom.address.value.length < 15) {
        return window.alert('Please enter a valid address (min 15 digits)');
      }

      thisCart.sendOrder();

      if(thisCart.sendOrder) {
        thisCart.products.splice(0, thisCart.products.length),
        thisCart.dom.productList.innerHTML = '',
        thisCart.dom.phone.value = '',
        thisCart.dom.address.value = '',
        thisCart.update();
      }
    });
  }

  add(menuProduct){
    const thisCart = this;

    const generatedHTML = templates.cartProduct(menuProduct);
    const generatedDOM = utils.createDOMFromHTML(generatedHTML);
    thisCart.dom.productList.appendChild(generatedDOM);

    thisCart.products.push(new CartProduct(menuProduct, generatedDOM));
    thisCart.update();
  }

  update() {
    const thisCart = this;

    const deliveryFee = settings.cart.defaultDeliveryFee;

    thisCart.totalNumber = 0;
    thisCart.subtotalPrice = 0;
    thisCart.totalPrice = 0;

    for(let product of thisCart.products){
      thisCart.totalNumber += product.amount;
      thisCart.subtotalPrice += product.price;
    }

    if(thisCart.subtotalPrice != 0) {
      thisCart.totalPrice = thisCart.subtotalPrice + deliveryFee;
      thisCart.dom.deliveryFee.innerHTML = deliveryFee;

    } else if (thisCart.subtotalPrice == 0) {
      thisCart.totalPrice = 0;
      thisCart.dom.deliveryFee.innerHTML = 0;
    }

    for(let link of thisCart.dom.totalPrice) {
      link.innerHTML = thisCart.totalPrice;
    }
    
    
    thisCart.dom.subtotalPrice.innerHTML = thisCart.subtotalPrice;
    
    thisCart.dom.totalNumber.innerHTML = thisCart.totalNumber;
  }

  remove(cartProduct){
    const thisCart = this;

    const item = thisCart.products.indexOf(cartProduct);
    thisCart.products.splice(item, 1);

    const cartHTML = cartProduct.dom.wrapper;
    cartHTML.remove();

    thisCart.update();
  }

  sendOrder() {
    const thisCart = this;

    const url = settings.db.url + '/' + settings.db.orders;

    const payload = {
      address: thisCart.dom.address.value,
      phone: thisCart.dom.phone.value,
      totalPrice: thisCart.totalPrice,
      subtotalPrice: thisCart.subtotalPrice,
      totalNumber: thisCart.totalNumber,
      deliveryFee: settings.cart.defaultDeliveryFee,
      products: [],
    };

    for(let prod of thisCart.products){
      payload.products.push(prod.getData());
    }

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    };

    fetch(url, options)
      .then(function(response){
        return response.json();
      }).then(function(){
        window.alert('zamówienie wysłane, życzymy smacznego');
      });
  }
}

export default Cart;