import localforage from 'localforage';
import { genUUID } from '../utils/helpers';
import { userEvenentData, ProductData } from 'types';

const ID_DB = '__wb-userId';

class UserService {
  async init() {
    const id = await this.getId();
    console.warn('UserID: ', id);
  }

  async getId(): Promise<string> {
    let id = await localforage.getItem(ID_DB) as string;

    if (!id) id = await this._setId();

    return id;
  }

  private async _setId(): Promise<string> {
    const id = genUUID();
    await localforage.setItem(ID_DB, id);
    return id;
  }

  async sendRouteEvent(url: string, timestamp: Date) {
    let eventJSON: userEvenentData

    eventJSON = {
      type: "route",
      payload: {
        url: url,
      },
      timestamp: timestamp
    }

    fetch('/api/sendEvent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(eventJSON)
    });
  }

  async sendAddToCardEvent(itemDetails: ProductData, timestamp: Date) {
    let eventJSON: userEvenentData

    eventJSON = {
      type: "addToCard",
      payload: {
        ...itemDetails
      },
      timestamp: timestamp
    }

    fetch('/api/sendEvent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(eventJSON)
    });
  }

  async sendPurchaseEvent(orderId: number, totalPrice: number, productIds: Array<number>, timestamp: Date) {
    let eventJSON: userEvenentData

    eventJSON = {
      type: "purchase",
      payload: {
        orderId: orderId,
        totalPrice: totalPrice,
        productIds: productIds,
      },
      timestamp: timestamp
    }

    fetch('/api/sendEvent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(eventJSON)
    });
  }

  async sendViewCard(itemDetails: ProductData, secretKey: string, timestamp: Date) {
    let eventJSON: userEvenentData

    eventJSON = {
      type: "viewCard",
      payload: {
        ...itemDetails,
        secretKey
      },
      timestamp: timestamp
    }

    if(itemDetails.log){
      if (Object.entries(itemDetails.log).length !== 0 && itemDetails.log !== "") {
        eventJSON.type = "viewCardPromo"
      }
    }

    fetch('/api/sendEvent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(eventJSON)
    });
  }
}

export const userService = new UserService();