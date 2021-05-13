import { Subscription } from 'rxjs';
import { AuthService } from './../auth/auth.service';
import { DataStorageService } from './../shared/data-storage.service';
import { Component, OnDestroy, OnInit } from '@angular/core';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  private userSub!: Subscription;
  isAuthenticated = false;
  isPhoneSize = false;

  constructor(private dataStorageService: DataStorageService, private auth: AuthService) { }

  ngOnInit(): void {
    this.userSub = this.auth.user.subscribe(user => {
      this.isAuthenticated = !user ? false : true;
    });
  }

  onOpenOptions() {
    this.isPhoneSize = !this.isPhoneSize
  }

  onResize(event: any) {
    if(event.target.innerWidth < 780) {
      this.isPhoneSize = true;
    } else {
      this.isPhoneSize = false;
    }
  }

  onSaveData() {
    this.dataStorageService.storeRecipes();
  }

  onFetchData() {
    this.dataStorageService.fetchRecipes().subscribe();
  }

  onLogout() {
    this.auth.logout();
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
  }

}
