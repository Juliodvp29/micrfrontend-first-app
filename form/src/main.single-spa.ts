import { enableProdMode, NgZone } from '@angular/core';

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { Router, NavigationStart, provideRouter } from '@angular/router';

import { singleSpaAngular, getSingleSpaExtraProviders } from 'single-spa-angular';


import { singleSpaPropsSubject } from './single-spa/single-spa-props';
import { AppComponent } from './app/app.component';
import { APP_BASE_HREF } from '@angular/common';
import { EmptyRouteComponent } from './app/empty-route/empty-route.component';
import { bootstrapApplication } from '@angular/platform-browser';


const lifecycles = singleSpaAngular({
  bootstrapFunction: singleSpaProps => {
    singleSpaPropsSubject.next(singleSpaProps);
    return bootstrapApplication(AppComponent, {
      providers: [
        { provide: APP_BASE_HREF, useValue: '/' },
        getSingleSpaExtraProviders(),
        provideRouter([{ path: '**', component: EmptyRouteComponent }])
      ]
    })
  },
  template: '<app-root />',
  Router,
  NavigationStart,
  NgZone,
});

export const bootstrap = lifecycles.bootstrap;
export const mount = lifecycles.mount;
export const unmount = lifecycles.unmount;
