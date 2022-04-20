import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { CartComponent } from './cart/cart.component';
import { RegisterComponent } from './register/register.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { HomeComponent } from './home/home.component';
import { MapComponent } from './map/map.component';
import { ImageComponent } from './image/image.component';
import { AdminCRUDComponent } from './admin-crud/admin-crud.component';
import { MyOrderComponent } from './my-order/my-order.component';
import { OrderDetailComponent } from './order-detail/order-detail.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { VendorPageComponent } from './vendor-page/vendor-page.component';
import { ReviewsComponent } from './reviews/reviews.component';
import { CategoryComponent } from './category/category.component';
import { VendorsComponent } from './vendors/vendors.component';
import { DeliveryDetailComponent } from './delivery-detail/delivery-detail.component';
import { FounderComponent} from './founder/founder.component';
import { NotificationComponent} from './notification/notification.component';
import { FounderActionComponent } from './founder-action/founder-action.component';
import { VendorActionComponent } from './vendor-action/vendor-action.component';
import { DeliverySettingsComponent } from './delivery-settings/delivery-settings.component';
import { DeliveryStateComponent } from './delivery-state/delivery-state.component';
import { CustomerComponent } from './customer/customer.component';
import { InterestingForYouPageComponent} from './interesting-for-you-page/interesting-for-you-page.component';
import { BestReviewedPageComponent} from './best-reviewed-page/best-reviewed-page.component';
import { BestSellersPageComponent} from './best-sellers-page/best-sellers-page.component';
import {OffersOfTheMomentPageComponent} from './offers-of-the-moment-page/offers-of-the-moment-page.component';
import { VendorAdvComponent } from './vendor-adv/vendor-adv.component';
import {SearchedProductsComponent  } from './searched-products/searched-products.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'cart', component: CartComponent },
  { path: 'about-us', component: AboutUsComponent},
  { path: 'my-order', component: MyOrderComponent},
  { path: 'order-detail/:id', component: OrderDetailComponent},
  { path: 'product-detail/:id', component: ProductDetailComponent},
  { path: 'map', component: MapComponent},
  { path: 'image', component: ImageComponent},
  { path: 'admin', component: AdminCRUDComponent},
  { path: 'vendor-page/:shop_name', component: VendorPageComponent},
  { path: 'vendors', component: VendorsComponent},
  { path: 'reviews/:id', component: ReviewsComponent},
  { path: 'category/:name', component: CategoryComponent },
  { path: 'delivery-detail/:id/:vendor_id/:shop_name/:state', component: DeliveryDetailComponent },
  { path: 'founder', component: FounderComponent},
  { path: 'notifications/:user', component: NotificationComponent},
  { path: 'founder-action', component: FounderActionComponent },
  { path: 'vendor-action', component: VendorActionComponent },
  { path: 'delivery-action', component: DeliverySettingsComponent},
  { path: 'delivery-state/:state', component: DeliveryStateComponent},
  { path: 'customer', component: CustomerComponent},
  { path: 'offers-of-the-moment', component: OffersOfTheMomentPageComponent},
  { path: 'best-reviewed', component: BestReviewedPageComponent},
  { path: 'best-sellers', component: BestSellersPageComponent},
  { path: 'interesting-for-you', component: InterestingForYouPageComponent},
  { path: 'vendor-adv', component: VendorAdvComponent},
  { path: 'search/:name', component: SearchedProductsComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
