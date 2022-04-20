import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private http: HttpClient) { }

  Login(json) {
    return this.http.post('http://localhost:8081/authentication/login', json, {observe: 'response', withCredentials : true},);
  }

  Logout(){
    return this.http.get('http://localhost:8081/authentication/logout', {observe: 'response', withCredentials : true},);
  }

  RegisterCustomer(json) {
    return this.http.post('http://localhost:8081/account/customer', json, {observe: 'response', withCredentials : true}, );
  }

  RegisterDelivery(json) {
    return this.http.post('http://localhost:8081/account/delivery', json, {observe: 'response', withCredentials : true},);
  }

  RegisterAdmin(json) {
    return this.http.post('http://localhost:8081/account/admin', json, {observe: 'response', withCredentials : true},);
  }

  ChangeAdminPosition(json){
    return this.http.put('http://localhost:8081/account/admin/position', json, {withCredentials : true},);
  }

  ChangeDeliveryPosition(json){
    return this.http.put('http://localhost:8081/account/delivery/position', json, {withCredentials : true},);
  }

  GetUserByID(){
    return this.http.get('http://localhost:8081/account/get_user_by_id', {withCredentials : true},);
  }

  RandomProducts(){
    const url = 'http://localhost:8081/product';
    return this.http.get(url, {observe: 'response'});
  }

  SalesProducts(){
    return this.http.get('http://localhost:8081/product/sale', {observe: 'response'});
  }

  MostSold(){
    return this.http.get('http://localhost:8081/product/most_sold', {observe: 'response'});
  }

  InterestProducts(){
    return this.http.get('http://localhost:8081/product/recommended', {observe: 'response', withCredentials : true},);
  }

  RatingProducts(){
    return this.http.get('http://localhost:8081/product/rating',{observe: 'response'});
  }

  VendorProducts(json){
    return this.http.get('http://localhost:8081/product/vendor', json);
  }

  ProductDetail(id){
    return this.http.get(`http://localhost:8081/product/info_id/?id=${id}`,{observe: 'response'});
  }

  AddToCart(json){
    return this.http.post('http://localhost:8081/shopping_cart',json,{observe: 'response', withCredentials : true} );
  }

  getCart(){
    return this.http.get('http://localhost:8081/shopping_cart', {observe: 'response', withCredentials: true});
  }

  getProductByVendorIDandName(vendor_id, name){
    return this.http.get(`http://localhost:8081/product/info/?vendor_id=${vendor_id}&name=${name}`,{observe: 'response'});
  }

  getVendor(id){
    return this.http.get(`http://localhost:8081/account/admin?id=${id}`,{observe: 'response'});
  }

  getVendorforUser(shop_name){
    return this.http.get(`http://localhost:8081/account/admin_customer?shop_name=${shop_name}`,{observe: 'response'});
  }

  getProductofVendor(shop_name){
    return this.http.get(`http://localhost:8081/product/shop_name?shop_name=${shop_name}`,{observe: 'response'});
  }

  deleteFromCart(name, vendor_id){
    return this.http.delete(`http://localhost:8081/shopping_cart/?name=${name}&vendor_id=${vendor_id}`,{observe: 'response', withCredentials : true});
  }

  createOrder(json){
    return this.http.post("http://localhost:8081/order", json, {observe: 'response', withCredentials : true});
  }

  getOrders(){
    return this.http.get("http://localhost:8081/order",{observe: 'response', withCredentials: true});
  }

  getOrdersForDelivery(state){
    return this.http.get(`http://localhost:8081/orders?state=${state}`,{observe: 'response'});
  }

  orderDetail(id){
    return this.http.get(`http://localhost:8081/order/info/?id=${id}`,{observe: 'response', withCredentials: true});
  }

  addReview(json){
    return this.http.post("http://localhost:8081/product/review", json, {observe: 'response', withCredentials : true});
  }

  getProductByType(type){
    return this.http.get(`http://localhost:8081/product/type/?type=${type}`,{observe: 'response'});
  }

  getVendors(){
    return this.http.get("http://localhost:8081/account/admins",{observe: 'response'});
  }

  getDelivery(){
    return this.http.get("http://localhost:8081/account/delivery",{observe: 'response', withCredentials: true});
  }

  getFounder(){
    return this.http.get("http://localhost:8081/account/founder",{observe: 'response', withCredentials: true});
  }

  getListOfVendors(){
    return this.http.get("http://localhost:8081/account/founder/vendor",{observe: 'response', withCredentials: true});
  }

  editFounderData(founderData) {
    return this.http.put("http://localhost:8081/account/founder", founderData, {observe: 'response', withCredentials : true},);
  }

  editVendorStatus(vendorStatus) {
    return this.http.put("http://localhost:8081/account/founder/vendor", vendorStatus, {observe: 'response', withCredentials : true},);
  }

  deleteVendorFromFounder(id) {
    return this.http.delete(`http://localhost:8081/account/founder/vendor?id=${id}`, {observe: 'response', withCredentials : true},);
  }

  deleteFounder() {
    return this.http.delete("http://localhost:8081/account/founder", {observe: 'response', withCredentials : true},);
  }

  getNotVisualizedNotification(){
    return this.http.get("http://localhost:8081/account/customer/not_visualized_notification",{observe: 'response', withCredentials : true} );
  }

  getVendorNotVisualizedNotification(){
    return this.http.get("http://localhost:8081/account/admin/notification",{observe: 'response', withCredentials : true} );
  }

  setDelivery(json){
    return this.http.put("http://localhost:8081/order/delivery", json, {observe: 'response', withCredentials : true} );
  }
  
  getCustumer(){
    return this.http.get("http://localhost:8081/account/customer",{observe: 'response', withCredentials : true});
  }

  getVendorNotification(){
    return this.http.get("http://localhost:8081/account/admin",{observe: 'response', withCredentials : true});
  }

  getVendorProduct(vendorId) {
    const url = `http://localhost:8081/product/vendor/?vendor_id=${vendorId}`;
    return this.http.get(url, {withCredentials : true},);
  }

  getVendorUser() {
    const url = 'http://localhost:8081/account/admin';
    return this.http.get(url, {withCredentials : true},);
  }

  createProduct(productData) {
    const url = 'http://localhost:8081/product';
    return this.http.post(url, productData, {observe: 'response', withCredentials : true},);
  }

  editProduct(productData) {
    const url = 'http://localhost:8081/product/';
    return this.http.put(url, productData, {observe: 'response', withCredentials : true},);
  }

  deleteProduct(productData) {
    const url = `http://localhost:8081/product/?_id=${productData}`;
    return this.http.delete(url, {observe: 'response', withCredentials : true},);
  }

  deleteVendor(vendorData) {
    const url = `http://localhost:8081/account/admin/?username=${vendorData.username}`;
    return this.http.delete(url, {observe: 'response', withCredentials : true},);
  }

  editVendorData(vendorData) {
    const url = 'http://localhost:8081/account/admin';
    return this.http.put(url, vendorData, {observe: 'response', withCredentials : true},);
  }

  editDeliveryData(vendorData) {
    const url = 'http://localhost:8081/account/delivery';
    return this.http.put(url, vendorData, {observe: 'response', withCredentials : true},);
  }

  getDeliveryById(id) {
    return this.http.get(`http://localhost:8081/account/delivery_id?delivery_id=${id}`, {observe: 'response', withCredentials : true},);
  }

  readNotification(id) {
    return this.http.put("http://localhost:8081/account/customer/notification",id,{observe: 'response', withCredentials : true})
  }

  readVendorNotification(id) {
    return this.http.put("http://localhost:8081/account/admin/notification",id,{observe: 'response', withCredentials : true})
  }

  editCustomerData(customerData) {
    const url = 'http://localhost:8081/account/customer';
    return this.http.put(url, customerData, {observe: 'response', withCredentials : true},);
  }

  deleteCustomer() {
    return this.http.delete("http://localhost:8081/account/customer", {observe: 'response', withCredentials : true},);
  }

  addFollower(shop_name) {
    return this.http.post("http://localhost:8081/account/admin/follower", shop_name, {observe: 'response', withCredentials : true});
  }

  removeFollower(shop_name) {
    return this.http.delete(`http://localhost:8081/account/admin/follower?shop_name=${shop_name}`, {observe: 'response', withCredentials : true});
  }

  checkFollower(shop_name) {
    return this.http.get(`http://localhost:8081/account/admin/follows?shop_name=${shop_name}`, {observe: 'response', withCredentials : true},);
  }

  getSuggestion(name){
    return this.http.get(`http://localhost:8081/product/names/similar_name?name=${name}`, {observe: 'response'},);
  }

  searchProduct(name){
    return this.http.get(`http://localhost:8081/product/similar_name?name=${name}`, {observe: 'response'},);
  }
}