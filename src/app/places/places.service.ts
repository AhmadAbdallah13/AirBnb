import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { take, map, delay, tap } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { Place } from './place.model';

@Injectable({
  providedIn: 'root',
})
export class PlacesService {
  private _places = new BehaviorSubject<Place[]>([
    new Place(
      'p1',
      'Manchester Condom',
      'near Old Trafford',
      'https://a0.muscache.com/im/pictures/06a7435e-1002-4c35-b0b4-0caa512351a2.jpg?im_w=1200',
      154,
      new Date('2020-01-01'),
      new Date('2020-12-31'),
      'abc'
    ),
    new Place(
      'p2',
      'Paris Apartment',
      'near parc de prans',
      'https://images.trvl-media.com/hotels/54000000/53160000/53159300/53159202/1bbaaf86_z.jpg',
      112,
      new Date('2020-01-01'),
      new Date('2020-12-31'),
      'abc'
    ),
    new Place(
      'p3',
      'Madrid Apartment',
      'near Bernabeu',
      'https://a0.muscache.com/im/pictures/4c478a53-3b63-4e13-bdde-9381fad45d3e.jpg?im_w=720',
      99,
      new Date('2020-01-01'),
      new Date('2020-12-31'),
      'xyz'
    ),
  ]);

  get places() {
    return this._places.asObservable();
  }

  getPlace(id: string) {
    return this.places.pipe(
      take(1),
      map((places) => {
        return { ...places.find((p) => p.id === id) };
      })
    );
  }

  addPlace(
    title: string,
    description: string,
    price: number,
    dateFrom: Date,
    dateTo: Date
  ) {
    const newPlace = new Place(
      Math.random().toString(),
      title,
      description,
      'https://a0.muscache.com/im/pictures/4c478a53-3b63-4e13-bdde-9381fad45d3e.jpg?im_w=720',
      price,
      dateFrom,
      dateTo,
      this.authService.userId
    );
    return this.places.pipe(
      take(1),
      delay(1000),
      tap((places) => {
        this._places.next(places.concat(newPlace));
      })
    );
  } // end addPlace

  updatePlace(placeId: string, title: string, description: string) {
    return this.places.pipe(
      take(1),
      delay(1000),
      tap((places) => {
        const updatedPlaceIndex = places.findIndex((pl) => pl.id === placeId);
        const updatedPlaces = [...places];
        const oldPlace = updatedPlaces[updatedPlaceIndex];
        updatedPlaces[updatedPlaceIndex] = new Place(
          oldPlace.id,
          title,
          description,
          oldPlace.imageUrl,
          oldPlace.price,
          oldPlace.availableFrom,
          oldPlace.availableTo,
          oldPlace.userId
        );
        this._places.next(updatedPlaces);
      })
    );
  }
  constructor(private authService: AuthService) {}
}
