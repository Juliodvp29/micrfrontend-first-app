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

Buscamos  `"main": "src/main.single-spa.ts"` y lo movemos a `architect > build > options` También  eliminamos `browser: "src/main.ts"`

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
---

## Configuración del formulario en Angular

Vamos al `src` de nuestro microfrontend angular y creamos una carpeta `/types` y dentro de ella un archivo llamado `orgexamplename-store-d.ts`  

Ahora vamos a nuestro proyecto `store` y buscamos el archivo `orgexamplename-store-d.ts` dentro de `/dist` carpeta generada al hacer el  `Build`.  Copiamos el código  y lo usamos en el `orgexamplename-store-d.ts` que acabamos de crear en `/types`

```ts
declare module '@orgexamplename/store' {
  import { Observable } from "rxjs";
  export interface ITodo {
    id: number;
    text: string;
    completed: boolean;
  }
  class StoreTodo {
    private _storeTodo$;
    private _id;
    private _key;
    constructor();
    get storeTodo$(): Observable<ITodo[]>;
    get id(): number;
    addTodo(todo: ITodo): void;
    changeCompleted(id: number): void;
    deleteTodo(id: number): void;
    private todos;
    private saveInLocalStorage;
    private getFromLocalStorage;
  }
  export const storeTodo: StoreTodo;
}

```

Vamos a el `tsconfig.json` y agregamos  `typeRoots` en `compilerOptions`

```json
"typeRoots": [
      "./src/types",
      "./node_modules/@types"
    ],
```

Ahora buscamos el archivo `extra-webpack.config` 

```js
const singleSpaAngularWebpack = require('single-spa-angular/lib/webpack').default;

module.exports = (config, options) => {
  const singleSpaWebpackConfig = singleSpaAngularWebpack(config, options);

  // Feel free to modify this webpack config however you'd like to
  singleSpaWebpackConfig.externals = ["single-spa", /^@orgexamplename\/store$/]; // Agregamos esta linea
  return singleSpaWebpackConfig;
};
```

## En el `app.component.ts` 

```ts

import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { storeTodo, ITodo } from '@orgexamplename/store';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'form';

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      title: new FormControl(null, Validators.required)
    })

    console.log(storeTodo)
  }

  onSubmit(): void {
    const { title } = this.form.value;

    const todo: ITodo = {
      completed: true,
      id: storeTodo.id,
      text: title
    }

    storeTodo.addTodo(todo);
    this.form.reset()
    Swal.fire({
      position: 'top-end',
      icon: 'success',
      title: 'Tarea agregada exitosamente',
      showConfirmButton: false,
      timer: 1500,
      customClass: {
        popup: 'swal2-toast'
      }
    });
  }

}

```

Agregamos la importación  de `storeTodo`  &  `ITodo` del archivo `orgexamplename-store-d.ts`. `import { storeTodo, ITodo } from '@orgexamplename/store';` 

Instalamos  `sweetalert2`

```bash
npm install sweetalert2
```

## En el `app.component.html` 

```html
<form class="inputform" [formGroup]="form" (ngSubmit)="onSubmit()">
  <input type="text" placeholder="Agrega una nueva tarea" formControlName="title" />
  <button type="submit">Enviar</button>
</form>
```

Estilos para el formulario  `app.component.scss`

```scss
.inputform {
  display: flex;
  justify-content: center;
  flex-direction: row;
  gap: 1em;
  position: relative;
  top: 5em;
  width: max-content;
  margin: auto;


  input {
    width: 500px;
    height: 46px;
    outline: none;
    border-radius: 7px;
    border: .5px solid rgb(137, 137, 137);
    padding: .5em;
    font-size: 14px;
  }

  button {
    height: 46px;
    outline: none;
    border-radius: 7px;
    width: 96px;
    border: none;
    background: rgb(149, 207, 61);
    color: whitesmoke;
    font-size: 17px;
    font-weight: bold;
    cursor: pointer;
  }
}

```
---

## Configuración de la lista en React

Vamos al `src` de nuestro microfrontend react y creamos una carpeta `/types` y dentro de ella un archivo llamado `orgexamplename-store-d.ts`  

```ts
declare module '@orgexamplename/store' {
  import { Observable } from "rxjs";
  export interface ITodo {
    id: number;
    text: string;
    completed: boolean;
  }
  class StoreTodo {
    private _storeTodo$;
    private _id;
    private _key;
    constructor();
    get storeTodo$(): Observable<ITodo[]>;
    get id(): number;
    addTodo(todo: ITodo): void;
    changeCompleted(id: number): void;
    deleteTodo(id: number): void;
    private todos;
    private saveInLocalStorage;
    private getFromLocalStorage;
  }
  export const storeTodo: StoreTodo;
}

```

Instalamos `RxJS` 

```bash
npm install rxjs
```

Instalamos  `sweetalert2`

```bash
npm install sweetalert2
```

Vamos a el `tsconfig.json` y agregamos  `typeRoots` en `compilerOptions`

```json
 "typeRoots": [
      "./types",
      "./node_modules/@types"
    ]
```

## En el `root.component.tsx`

```tsx
import { useEffect, useState } from "react";
import Swal from 'sweetalert2';
import { ITodo, storeTodo } from "@orgexamplename/store";
import './css/style.css'

export default function Root(props) {
  const [todos, setTodos] = useState<ITodo[]>([])

  useEffect(() => {
    const sub = storeTodo.storeTodo$.subscribe(setTodos)
    return () => {
      sub.unsubscribe();
    }
  }, [])

  const handleDelete = (id: number) => {
    Swal.fire({
      title: '¿Estás seguro?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí!'
    }).then((result) => {
      if (result.isConfirmed) {
        storeTodo.deleteTodo(id)
        Swal.fire(
          'Eliminado!',
          'La tarea ha sido eliminada.',
          'success'
        )
        setTodos(todos.filter(todo => todo.id !== id));
      }
    })
  }


  return (
    <section className="listMenu">
      <table>
        <thead>
          <tr>
            <th>Task</th>
            <th>Completed</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {todos.map(todo => (
            <tr key={todo.id}>
              <td>{todo.text}</td>
              <td>{todo.completed ? 'Terminado' : 'En Proceso'}</td>
              <td>
                <button onClick={() => handleDelete(todo.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

```

Estilos para la lista

```css
.listMenu {
    width: 100%;
    max-width: 800px;
    margin: 20px auto;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    background-color: #f9f9f9;
}

table {
    width: 100%;
    border-collapse: collapse;
}

th,
td {
    padding: 12px;
    text-align: left;
    border-bottom: 1px solid #ddd;
}

th {
    background-color: #f4f4f4;
    color: #333;
    font-weight: bold;
}

tr:nth-child(even) {
    background-color: #f2f2f2;
}

tr:hover {
    background-color: #e9e9e9;
}

button {
    background-color: #ff4d4d;
    color: white;
    border: none;
    padding: 8px 16px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 14px;
    margin: 4px 2px;
    cursor: pointer;
    border-radius: 4px;
}

button:hover {
    background-color: #e60000;
}
```

## Regresamos a la raíz  de nuestro proyecto, el Root Config

En el archivo `microfrontend-layout.html` agregamos las siguientes rutas

```html

<single-spa-router>
  <main>
    <single-spa-router>
      <nav class="topnav">
        <li><a href="/">Home</a></li>
        <li><a href="/form">Form</a></li>
        <li><a href="/list">List</a></li>
      </nav>
      <route path="form">
        <application name="@orgexamplename/form"></application>
      </route>
      <route path="list">
        <application name="@orgexamplename/list"></application>
      </route>
    </single-spa-router>
  </main>
</single-spa-router>
 
```
Agregamos los siguientes estilos en el `index.ejs`

```css
<style>
  * {
    padding: 0;
    margin: 0;
    box-sizing: border-box;
  }

  .topnav {
    background-color: #000;
    display: flex;
    position: sticky;
    top: 0;
    flex-direction: row;
    padding: 1em;
    justify-content: space-evenly;
    -webkit-box-shadow: 1px 6px 7px -2px rgba(0, 0, 0, 0.75);
    -moz-box-shadow: 1px 6px 7px -2px rgba(0, 0, 0, 0.75);
    box-shadow: 1px 6px 7px -2px rgba(0, 0, 0, 0.75);
  }

  .topnav li a {
    text-decoration: none;
    font-weight: 600;
    color: whitesmoke;
    font-size: 17px;
  }

  .topnav li a:hover {
    font-size: 18px;
    color: aliceblue
  }
</style>

```

Por último, nos aseguramos de que todos los microfrontends estén corriendo en sus respectivos puertos.

Deberíamos poder visualizar nuestra aplicación en http://localhost:9000, que es el puerto por defecto configurado en el package.json del Root Config.

## Resultado final

Formulario en angular  
![formulario angular]([formulario.jpg](https://github.com/Juliodvp29/microfrontend-first-app/blob/main/formulario.png))

Lista en React 
![formulario angular]([formulario.jpg](https://github.com/Juliodvp29/microfrontend-first-app/blob/main/lista.png))


