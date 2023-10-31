import { Component } from '../component';
import html from './favourites.tpl.html';

import { ProductList } from '../productList/productList';
import { favService } from '../../services/fav.service';

class Favourites extends Component {
  productList: ProductList;

  constructor(props: any) {
    super(props);

    this.productList = new ProductList();
    this.productList.attach(this.view.products);
  }

  async render() {
    const products = await favService.get();
    this.productList.update(products);
  }
}

export const favouritesComp = new Favourites(html);