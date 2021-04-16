import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';
import { take, map, delay, tap, switchMap } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { Place } from './place.model';

// [new Place(
//   'p1',
//   'Manchester Condom',
//   'near Old Trafford',
//   'https://a0.muscache.com/im/pictures/06a7435e-1002-4c35-b0b4-0caa512351a2.jpg?im_w=1200',
//   154,
//   new Date('2020-01-01'),
//   new Date('2020-12-31'),
//   'abc'
// ),
// new Place(
//   'p2',
//   'Paris Apartment',
//   'near parc de prans',
//   'https://images.trvl-media.com/hotels/54000000/53160000/53159300/53159202/1bbaaf86_z.jpg',
//   112,
//   new Date('2020-01-01'),
//   new Date('2020-12-31'),
//   'abc'
// ),
// new Place(
//   'p3',
//   'Madrid Apartment',
//   'near Bernabeu',
//   'https://a0.muscache.com/im/pictures/4c478a53-3b63-4e13-bdde-9381fad45d3e.jpg?im_w=720',
//   99,
//   new Date('2020-01-01'),
//   new Date('2020-12-31'),
//   'xyz'
// ),]

interface PlaceData {
  availableFrom: string;
  availableTo: string;
  description: string;
  imageUrl: string;
  price: number;
  title: string;
  userId: string;
}

@Injectable({
  providedIn: 'root',
})
export class PlacesService {
  private _places = new BehaviorSubject<Place[]>([]);

  get places() {
    return this._places.asObservable();
  }

  fetchPlcaes() {
    return this.httpC
      .get<{ [key: string]: PlaceData }>(
        'https://ion-tuto-default-rtdb.firebaseio.com/offered-places.json'
      )
      .pipe(
        map((responseData) => {
          const places = [];
          for (const key in responseData) {
            if (responseData.hasOwnProperty(key)) {
              places.push(
                new Place(
                  key,
                  responseData[key].title,
                  responseData[key].description,
                  responseData[key].imageUrl,
                  responseData[key].price,
                  new Date(responseData[key].availableFrom),
                  new Date(responseData[key].availableTo),
                  responseData[key].userId
                )
              );
            }
          }
          return places;
        }),
        tap((places) => {
          this._places.next(places);
        })
      );
  }

  getPlace(id: string) {
    return this.httpC
      .get<PlaceData>(
        `https://ion-tuto-default-rtdb.firebaseio.com/offered-places/${id}.json`
      )
      .pipe(
        map((placeData) => {
          return new Place(
            id,
            placeData.title,
            placeData.description,
            placeData.imageUrl,
            placeData.price,
            new Date(placeData.availableFrom),
            new Date(placeData.availableTo),
            placeData.userId
          );
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
    let generatedId: string;
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
    return this.httpC
      .post<{ name: string }>(
        'https://ion-tuto-default-rtdb.firebaseio.com/offered-places.json',
        { ...newPlace, id: null }
      )
      .pipe(
        switchMap((responseData) => {
          generatedId = responseData.name;
          return this.places;
        }),
        take(1),
        tap((places) => {
          newPlace.id = generatedId;
          this._places.next(places.concat(newPlace));
        })
      );
    // return this.places.pipe(
    //   take(1),
    //   delay(1000),
    //   tap((places) => {
    //     this._places.next(places.concat(newPlace));
    //   })
    // );
  } // end addPlace

  updatePlace(placeId: string, title: string, description: string) {
    let updatedPlaces: Place[];
    return this.places.pipe(
      take(1),
      switchMap((places) => {
        if (!places || places.length <= 0) {
          return this.fetchPlcaes();
        } else {
          return of(places);
        }
      }),
      switchMap((places) => {
        const updatedPlaceIndex = places.findIndex((pl) => pl.id === placeId);
        updatedPlaces = [...places];
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
        return this.httpC.put(
          `https://ion-tuto-default-rtdb.firebaseio.com/offered-places/${placeId}.json`,
          { ...updatedPlaces[updatedPlaceIndex] }
        );
      }),
      tap(() => {
        this._places.next(updatedPlaces);
      })
    );
  }

  constructor(private authService: AuthService, private httpC: HttpClient) {}
}
