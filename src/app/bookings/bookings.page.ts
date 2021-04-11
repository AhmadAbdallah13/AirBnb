import { Component, OnDestroy, OnInit } from '@angular/core';
import { IonItemSliding } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Booking } from './booking.model';
import { BookingService } from './booking.service';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.page.html',
  styleUrls: ['./bookings.page.scss'],
})
export class BookingsPage implements OnInit, OnDestroy {
  loadedBooking: Booking[];
  private bookingsSub: Subscription;

  constructor(private bookingService: BookingService) {}

  ngOnInit() {
    this.bookingsSub = this.bookingService.bookings.subscribe((bookings) => {
      this.loadedBooking = bookings;
    });
  }

  ngOnDestroy() {
    if (this.bookingsSub) {
      this.bookingsSub.unsubscribe();
    }
  }

  onCancel(bookingId: string, slidingBooking: IonItemSliding) {
    slidingBooking.close();
  }
}
