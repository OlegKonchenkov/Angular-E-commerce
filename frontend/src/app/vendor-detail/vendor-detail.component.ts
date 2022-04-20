import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-vendor-detail',
  templateUrl: './vendor-detail.component.html',
  styleUrls: ['./vendor-detail.component.scss']
})
export class VendorDetailComponent implements OnInit {

  constructor() { }

  @Input() vendor;

  ngOnInit(): void {
    console.log(this.vendor);
  }

}
