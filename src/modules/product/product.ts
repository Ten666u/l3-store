import { ViewTemplate } from '../../utils/viewTemplate';
import { View } from '../../utils/view';
import { formatPrice } from '../../utils/helpers'
import html from './product.tpl.html';
import { ProductData } from 'types';
import { userService } from '../../services/user.service';

type ProductComponentParams = { [key: string]: any };

export class Product {
  view: View;
  product: ProductData;
  params: ProductComponentParams;

  constructor(product: ProductData, params: ProductComponentParams = {}) {
    this.product = product;
    this.params = params;
    this.view = new ViewTemplate(html).cloneView();
  }

  attach($root: HTMLElement) {
    $root.appendChild(this.view.root);
  }

  render() {
    const { id, name, src, salePriceU } = this.product;

    this.view.root.setAttribute('href', `/product?id=${id}`);
    this.view.img.setAttribute('src', src);
    this.view.title.innerText = name;
    this.view.price.innerText = formatPrice(salePriceU);

    if (this.params.isHorizontal) this.view.root.classList.add('is__horizontal')

    const options = {
      root: null,
      rootMargin: "0px",
      threshold: 0.99
    };
    
    const observer = new IntersectionObserver(this.handleIntersection, options);
    observer.observe(this.view.root);
  }

  handleIntersection = (entries: IntersectionObserverEntry[], observer: IntersectionObserver) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        this.sendEvent()
        observer.unobserve(entry.target);
      }
    });
  }

  sendEvent(){
    fetch(`/api/getProductSecretKey?id=${this.product.id}`)
      .then((res) => res.json())
      .then((secretKey) => {
        userService.sendViewCard(this.product, secretKey, new Date(Date.now()))
      });
  }
}