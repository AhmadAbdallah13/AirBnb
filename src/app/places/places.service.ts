import { Injectable } from '@angular/core';
import { Place } from './place.model';

@Injectable({
  providedIn: 'root'
})
export class PlacesService {
  private _places: Place[] = [
    new Place('p1', 'Manchester Condom', 'near Old Trafford', "https://a0.muscache.com/im/pictures/06a7435e-1002-4c35-b0b4-0caa512351a2.jpg?im_w=1200", 154),
    new Place('p2', 'Paris Apartment', 'near parc de prans', "https://images.trvl-media.com/hotels/54000000/53160000/53159300/53159202/1bbaaf86_z.jpg", 112),
    new Place('p3', 'Madrid Apartment', 'near Bernabeu', "https://a0.muscache.com/im/pictures/4c478a53-3b63-4e13-bdde-9381fad45d3e.jpg?im_w=720", 99),
  ]

  get places() {
    return [...this._places]
  }

  getPlace(id: string) {
    return {...this._places.find(p => p.id === id)}
  }

  constructor() { }
}
