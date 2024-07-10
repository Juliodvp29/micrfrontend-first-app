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

1. Directory for new project : ./example
2. Which package manager do you want to use? : npm
3. Will this project use Typescript? : No
4. Would you like to use single-spa Layout Engine: Yes
5. Organization name: orgexamplename (usar el mismo en los siguientes pasos)

---

Si abrimos nuestro proyecto, podremos ver dos archivos principales.

- `/src/index.ejs` - "Este será el primer archivo en cargarse, aquí podremos importar dependencias compartidas y otros microfrontends.`

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

- `/src/microfrontend-layaout.html` - Aquí vamos a registrar cada microfrontend
  
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

 ejecutamos lo siguiente en la raíz del proyecto,.


```bash
npx create-single-spa --moduleType app-parcel
```

Seguimos los pasos

1. Directory for new project : ./list
2. Which framework do you want to use? : react
3.  Which package manager do you want to use?: npm
4. Will this project use Typescript? : Yes
5. Organization name: orgexamplename (usar el mismo en los siguientes pasos)
   
---

Configuramos el comando `start` en el package.json

```json
"scripts": {
  "start": "webpack serve -- --port 3000",
}
```

## Para Iniciar 

ejecutamos en el directorio de nuestro micrfrontend /list.

```bash
npm run start
```





