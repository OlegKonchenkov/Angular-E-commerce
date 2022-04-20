import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.scss'],
})

export class ImageComponent implements OnInit {

  imageChangedEvent: any = ""
  imageBase64

  constructor() { }

  ngOnInit(): void {
  }

  encodeImageFileAsURL(event) {
    this.imageChangedEvent = event
  }

  imageCropped(event){
    this.imageBase64 = event.base64
  }

}
