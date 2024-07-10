# Todolist Microfrontend con Single SPA

Este proyecto es una demostración de cómo integrar múltiples microfrontends utilizando Single SPA. Actualmente, cuenta con dos microfrontends: uno en React y otro en Angular.

# Estructura de carpetas
- `/form` - React Microfrontend
- `/list` - Angular Microfrontend`
- `/store` - Parcel independiente, mantiene el estado de las tareas de manera reactiva usando RxJS. 

## Instalación

npm

```bash
npm install --global create-single-spa
```

yarn

```bash
yarn global add create-single-spa
```

## Root Config

El proyecto principal que configura y sirve los microfrontends.

En la raíz del directorio donde queremos guardar el proyecto, ejecutamos lo siguiente.

```bash
npx create-single-spa --moduleType root-config
```

Seguimos los pasos

1. Directory for new project : `./example` 
2. Which package manager do you want to use? : `npm` 
3. Will this project use Typescript? : No
4. Would you like to use single-spa Layout Engine: Yes
5. Organization name: orgexamplename (usar el mismo en los siguientes pasos)

---

Si abrimos nuestro proyecto, podremos ver dos archivos principales.

- `example/src/index.ejs` - "Este será el primer archivo en cargarse, aquí podremos importar dependencias compartidas y otros microfrontends.`

```ejs
 <script type="systemjs-importmap">
    {
      "imports": {
        "single-spa": "https://cdn.jsdelivr.net/npm/single-spa@5.9.0/lib/system/single-spa.min.js",
      }
    }
  </script>
  <link rel="preload" href="https://cdn.jsdelivr.net/npm/single-spa@5.9.0/lib/system/single-spa.min.js" as="script">

  <!-- Add your organization's prod import map URL to this script's src  -->
  <!-- <script type="systemjs-importmap" src="/importmap.json"></script> -->

  <% if (isLocal) { %>
    <script type="systemjs-importmap">
    {
      "imports": {
        // Eliminamos @single-spa/welcome 
        "@safety/root-config": "//localhost:9000/orgexamplename-root-config.js",
      }
    }
  </script>
    <% } %>
```

- `example/src/microfrontend-layaout.html` - Aquí vamos a registrar cada microfrontend
  
```html
<single-spa-router>
  <!--

    This is the single-spa Layout Definition for your microfrontends.
    See https://single-spa.js.org/docs/layout-definition/ for more information.

  -->

  <!-- Example layouts you might find helpful:

  <nav>
    <application name="@orgexamplename/navbar"></application>
  </nav>
  <route path="settings">    
    <application name="@orgexamplename/settings"></application>
     
  </route>

  -->

  <main>
    <route default>
     // Eliminamos <application name="@single-spa/welcome"></application>
    </route>
  </main>
</single-spa-router>

```
  
## Para Iniciar 

```bash
npm run start
```

## Agregamos microfrontend en React

Este microfrontend sera una lista

 ejecutamos lo siguiente en la raíz del proyecto


```bash
npx create-single-spa --moduleType app-parcel
```

Seguimos los pasos

1. Directory for new project : `./list` 
2. Which framework do you want to use? : `react` 
3. Which package manager do you want to use?: `npm` 
4. Will this project use Typescript? : Yes
5. Organization name: orgexamplename (usar el mismo en los siguientes pasos)
   
---

Configuramos el comando `start` en el package.json

```json
"scripts": {
  "start": "webpack serve -- --port 3000",
}
```

## Agregamos nuestro micrfrontend react al Root Config

Agregamos lo siguiente en nuestro systemjs-importmap en nuestros archivo `example/src/index.ejs`

```ejs
  <!-- Add your organization's prod import map URL to this script's src  -->
  <!-- <script type="systemjs-importmap" src="/importmap.json"></script> -->

  <% if (isLocal) { %>
    <script type="systemjs-importmap">
    {
      "imports": {
        "@orgexamplename/root-config": "//localhost:9000/orgexamplename-root-config.js", 
        "@orgexamplename/list": "http://localhost:3000/orgexamplename-list.js" // React microfrontend
      }
    }
  </script>
    <% } %>
```

Agregamos la importacion de react y react-dom 

```ejs
<script type="systemjs-importmap">
    {
      "imports": {
        "single-spa": "https://cdn.jsdelivr.net/npm/single-spa@5.9.0/lib/system/single-spa.min.js",
        "react": "https://cdn.jsdelivr.net/npm/react@17.0.2/umd/react.production.min.js",
        "react-dom": "https://cdn.jsdelivr.net/npm/react-dom@17.0.2/umd/react-dom.production.min.js"
      }
    }
  </script>
```

registramos el microfrontend en  `example/src/microfrontend-layaout.html`

```html
<single-spa-router>
  <main>
    <route default>
      <application name="@orgexamplename/list"></application>
    </route>
  </main>
</single-spa-router>
```

## Para Iniciar 

ejecutamos en el directorio de nuestro micrfrontend `/list`

```bash
npm run start
```

---


## Agregamos microfrontend en Angular (V17)

Este microfrontend sera un formulario

ejecutamos lo siguiente en la raíz del proyecto

```bash
npx create-single-spa --moduleType app-parcel
```

Seguimos los pasos

1. Directory for new project : `./form` 
2. Which framework do you want to use? : `angular` 
3. Project name: form
4. Would you like to add Angular routing?: Yes
5. Which stylesheet format would you like to use?: `SCSS` 

---

Es posible que necesite eliminar la carpeta `/node_modules`  en su proyecto de Angular y luego volver a ejecutar `npm install`

## Configuración angular.json

Buscamos  `"src/main.single-spa.ts"` y lo movemos a `architect > build > options` También  eliminamos `browser: "src/main.ts"`

```json
  "options": {
            "outputPath": "dist/form",
            "index": "src/index.html",
            "browser": "src/main.ts" // Delete this
            "main": "src/main.single-spa.ts",
            "polyfills": [
              "zone.js"
            ],
            "tsConfig": "tsconfig.app.json",
            "inlineStyleLanguage": "scss",
            "assets": [
              "src/favicon.ico",
              "src/assets"
            ],
            "styles": [
              "src/styles.scss"
            ],
            "scripts": [],
            "customWebpackConfig": {
              "path": "extra-webpack.config.js",
              "libraryName": "form",
              "libraryTarget": "umd"
            },
            "deployUrl": "http://localhost:4200/"
          },
```

## Configuración  `src/main.single-spa.ts` 

Elimine el archivo de entorno por ahora y la condición para habilitar la producción

En lugar de AppModule, utilizaremos AppComponent junto con algunas configuraciones de proveedores

```ts
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

```

## Agregamos nuestro micrfrontend angular al Root Config

Agregamos lo siguiente en nuestro systemjs-importmap en nuestros archivo `example/src/index.ejs`

```ejs
  <!-- Add your organization's prod import map URL to this script's src  -->
  <!-- <script type="systemjs-importmap" src="/importmap.json"></script> -->

  <% if (isLocal) { %>
    <script type="systemjs-importmap">
    {
      "imports": {
        "@orgexamplename/root-config": "//localhost:9000/orgexamplename-root-config.js", 
        "@orgexamplename/list": "http://localhost:3000/orgexamplename-list.js" // React microfrontend
        "@orgexamplename/form": "http://localhost:4200/main.js", // Angular microfrontend
      }
    }
  </script>
    <% } %>
```
Descomentamos la siguiente linea en `example/src/index.ejs`

```ejs
<script src="https://cdn.jsdelivr.net/npm/zone.js@0.11.3/dist/zone.min.js"></script>
```

registramos el microfrontend en  `example/src/microfrontend-layaout.html`

```html
<single-spa-router>
  <main>
    <route default>
      <application name="@orgexamplename/list"></application>
      <application name="@orgexamplename/form"></application>
    </route>
  </main>
</single-spa-router>
```

## Para Iniciar 

ejecutamos en el directorio de nuestro micrfrontend `/form` 

```bash
npm run serve:single-spa:form
```
---

## Agregamos un store

Este microfrontend nos servirá para compartir un estado entre los otros 2 microfrontends de Angular y React.

ejecutamos lo siguiente en la raíz del proyecto

```bash
npx create-single-spa
```

Seguimos los pasos

1. Directory for new project : `./sotre` 
2. Select type to generate : `in-browser utility module (styleguide, api cache, etc)` 
3. Which framework do you want to use?: None
4. Which package manager do you want to use?: `npm` 
5. Will this project use Typescript? : Yes
6. Organization name: orgexamplename
7. Project name: store

Abrimos nuestro proyecto `./sotre` y agregamos el siguiente código  en `src/orgexamplename-store.ts` 

```bash
import { BehaviorSubject, Observable } from "rxjs";

export interface ITodo {
    id: number;
    text: string;
    completed: boolean;
}

class StoreTodo {
    private _storeTodo$: BehaviorSubject<ITodo[]>;
    private _id: number;
    private _key: string;

    constructor() {
        this._id = 0;
        this._key = 'TODOS';
        this._storeTodo$ = new BehaviorSubject(this.getFromLocalStorage())
    }

    get storeTodo$(): Observable<ITodo[]> {
        return this._storeTodo$.asObservable();
    }

    get id(): number {
        return this._id;
    }

    addTodo(todo: ITodo): void {
        this._storeTodo$.next([...this._storeTodo$.value, todo]);
        this._id++;
        this.saveInLocalStorage();
    }

    changeCompleted(id: number): void {
        const todos = this.todos().map((todo): ITodo => (todo.id === id ? { ...todo, completed: !todo.completed } : todo));
        this._storeTodo$.next([...todos]);
        this.saveInLocalStorage();
    }

    deleteTodo(id: number): void {
        const todos = this.todos().filter((todo) => todo.id !== id);
        this._storeTodo$.next([...todos]);
        this.saveInLocalStorage()
    }

    private todos(): ITodo[] {
        return this._storeTodo$.getValue();
    }

    private saveInLocalStorage(): void {
        localStorage.setItem(this._key, JSON.stringify(this.todos()));
    }

    private getFromLocalStorage(): ITodo[] {
        const todos = localStorage.getItem(this._key);
        if (todos) {
            const todosParsed = JSON.parse(todos) as ITodo[];
            this._id = todosParsed.length > 0 ? todosParsed[todosParsed.length - 1].id + 1 : 0;
            return todosParsed;
        } else {
            return []
        }
    }
}

export const storeTodo = new StoreTodo();


```

Instalamos `RxJS` en nuestro proyecto `sotre`

```bash
npm install rxjs
```

Agregamos el `target ES6` en el `tsconfig.json `

```json
 "compilerOptions": {
    "declarationDir": "dist",
    "target": "ES6"
  },
```

Ejecutamos un `Build` este generará  una carpeta dist con un archivo `orgexamplename-store-d.ts`  que usaremos después

```bash
npm run build
```

Configuramos el comando `start` en el package.json

```json
"scripts": {
  "start": "webpack serve -- --port 8500",
}
```

## Para Iniciar 

ejecutamos en el directorio de nuestro micrfrontend  `/store`

```bash
npm run start
```
---

## Agregamos nuestro micrfrontend store al Root Config

Agregamos lo siguiente en nuestro systemjs-importmap en nuestros archivo `example/src/index.ejs`

```ejs
  <!-- Add your organization's prod import map URL to this script's src  -->
  <!-- <script type="systemjs-importmap" src="/importmap.json"></script> -->

  <% if (isLocal) { %>
    <script type="systemjs-importmap">
    {
      "imports": {
        "@orgexamplename/root-config": "//localhost:9000/orgexamplename-root-config.js", 
        "@orgexamplename/list": "http://localhost:3000/orgexamplename-list.js" // React microfrontend
        "@orgexamplename/form": "http://localhost:4200/main.js", // Angular microfrontend
        "@orgexamplename/store": "http://localhost:8500/orgexamplename-store.js", // Store microfrontend
      }
    }
  </script>
    <% } %>
```




