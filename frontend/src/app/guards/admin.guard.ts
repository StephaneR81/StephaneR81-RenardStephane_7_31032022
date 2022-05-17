import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {
  constructor(private router: Router) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (this.isAdministrator()) {
      return true;
    }
    this.router.navigate(['/wall']);
    return false;
  }

  //Function returning true if user is logged in and is an administrator
  public isAdministrator(): boolean {
    let status = false;
    if (localStorage.getItem('isAdmin') === 'true') {
      status = true;
    }
    return status;
  }
}
