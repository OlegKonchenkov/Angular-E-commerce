import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import {MatDialogModule} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import {MatIconModule} from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { LoginComponent } from './login/login.component';
import { CartComponent } from './cart/cart.component';

import { HttpClientModule } from '@angular/common/http';
import { RegisterComponent } from './register/register.component';
import { CartProductComponent } from './cart-product/cart-product.component';
import { NavbarComponent } from './navbar/navbar.component';
import { HomeComponent } from './home/home.component';
import { AdminCRUDComponent } from './admin-crud/admin-crud.component';
import { HomeProductComponent } from './home-product/home-product.component';
import { FooterComponent } from './footer/footer.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { MapComponent } from './map/map.component';
import { MyOrderComponent } from './my-order/my-order.component';
import { ImageComponent } from './image/image.component';
import { OrderComponent } from './order/order.component';
import { OrderDetailComponent } from './order-detail/order-detail.component';
import { OffersOfTheMomentComponent } from './offers-of-the-moment/offers-of-the-moment.component';
import { BestSellersComponent } from './best-sellers/best-sellers.component';
import { BestReviewedComponent } from './best-reviewed/best-reviewed.component';
import { InterestingForYouComponent } from './interesting-for-you/interesting-for-you.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { DialogComponent } from './dialog/dialog.component';
import { VendorPageComponent } from './vendor-page/vendor-page.component';
import { OrderDialogComponent } from './order-dialog/order-dialog.component';
import { OrderProductDetailComponent } from './order-product-detail/order-product-detail.component';
import { StarsComponent } from './stars/stars.component';
import { ReviewsComponent } from './reviews/reviews.component';
import { ReviewDialogComponent } from './review-dialog/review-dialog.component';
import { ReviewDetailComponent } from './review-detail/review-detail.component';
import { CategoryComponent } from './category/category.component';
import { VendorsComponent } from './vendors/vendors.component';
import { CardSingleProductComponent } from './card-single-product/card-single-product.component';
import { FounderComponent } from './founder/founder.component';
import { DeliveryDetailComponent } from './delivery-detail/delivery-detail.component';
import { NotificationComponent } from './notification/notification.component';
import { NotificationCardComponent } from './notification-card/notification-card.component';
import { FounderActionComponent } from './founder-action/founder-action.component';
import { VendorActionComponent } from './vendor-action/vendor-action.component';
import { DeliverySettingsComponent } from './delivery-settings/delivery-settings.component';
import { CustomerMapComponent } from './customer-map/customer-map.component';
import { DeliveryStateComponent } from './delivery-state/delivery-state.component';
import { VendorDetailComponent } from './vendor-detail/vendor-detail.component';
import { CustomerComponent } from './customer/customer.component';
import { OffersOfTheMomentPageComponent } from './offers-of-the-moment-page/offers-of-the-moment-page.component';
import { BestReviewedPageComponent } from './best-reviewed-page/best-reviewed-page.component';
import { BestSellersPageComponent } from './best-sellers-page/best-sellers-page.component';
import { InterestingForYouPageComponent } from './interesting-for-you-page/interesting-for-you-page.component';
import { VendorAdvComponent } from './vendor-adv/vendor-adv.component';
import {ImageCropperModule} from 'ngx-image-cropper';
import { NotifyComponent } from './notify/notify.component';

import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatFormFieldModule} from '@angular/material/form-field';
import { SearchbarComponent } from './searchbar/searchbar.component';
import { SearchedProductsComponent } from './searched-products/searched-products.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    CartComponent,
    RegisterComponent,
    CartProductComponent,
    NavbarComponent,
    HomeComponent,
    HomeProductComponent,
    AdminCRUDComponent,
    FooterComponent,
    AboutUsComponent,
    MapComponent,
    MyOrderComponent,
    ImageComponent,
    OrderComponent,
    OrderDetailComponent,
    OffersOfTheMomentComponent,
    BestSellersComponent,
    BestReviewedComponent,
    InterestingForYouComponent,
    ProductDetailComponent,
    DialogComponent,
    VendorPageComponent,
    OrderDialogComponent,
    OrderProductDetailComponent,
    StarsComponent,
    ReviewsComponent,
    ReviewDialogComponent,
    ReviewDetailComponent,
    CategoryComponent,
    VendorsComponent,
    CardSingleProductComponent,
    FounderComponent,
    DeliveryDetailComponent,
    NotificationComponent,
    NotificationCardComponent,
    FounderActionComponent,
    VendorActionComponent,
    DeliverySettingsComponent,
    CustomerMapComponent,
    DeliveryStateComponent,
    VendorDetailComponent,
    CustomerComponent,
    OffersOfTheMomentPageComponent,
    BestReviewedPageComponent,
    BestSellersPageComponent,
    InterestingForYouPageComponent,
    VendorAdvComponent,
    NotifyComponent,
    SearchbarComponent,
    SearchedProductsComponent
  ],
  imports: [
    MatIconModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatDialogModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatSnackBarModule,
    HttpClientModule,
    MatTabsModule,
    ImageCropperModule,
    BrowserModule, FormsModule,MatFormFieldModule,MatAutocompleteModule,MatInputModule,ReactiveFormsModule,BrowserAnimationsModule
  ],
  providers: [NotifyComponent, NavbarComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
