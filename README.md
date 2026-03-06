# LinkImageViewer

Visualizador de imágenes por enlaces. Permite ingresar URLs de imágenes y visualizarlas en una galería responsive con modo lightbox.

## Funcionalidades

- **Agregar imágenes por URL**: Campo de texto para pegar un enlace individual y cargarlo en la galería.
- **Carga masiva**: Diálogo para pegar múltiples enlaces (uno por línea) y cargarlos todos de golpe.
- **Galería responsive**: Cuadrícula CSS Grid que se adapta automáticamente al tamaño de pantalla.
- **Vista lista**: Modo alternativo donde las imágenes se muestran apiladas verticalmente a ancho completo.
- **Lightbox**: Al hacer clic en una imagen se amplía con navegación anterior/siguiente y contador.
- **Manejo de errores**: Indicadores visuales para imágenes en carga o con error.
- **Eliminar imágenes**: Individualmente o limpiar toda la galería.
- **Tema oscuro**: Interfaz con fondo oscuro y acentos en rosa/magenta (Material magenta-violet).

## Tecnologías

- **Angular 19** (standalone components, signals)
- **Angular Material 19** (MatDialog, MatFormField, MatInput, MatButton, MatIcon, MatSnackBar, MatTooltip)
- **SCSS** con CSS Grid
- **GitHub Pages** para despliegue

## Estructura de componentes

```
src/app/components/
├── image-gallery/        → Componente principal: input de URLs, galería grid/lista
├── image-lightbox/       → Diálogo lightbox para ampliar imágenes con navegación
└── bulk-add-dialog/      → Diálogo para cargar múltiples enlaces de golpe
```

## Desarrollo local

### Requisitos

- Node.js 20+
- Angular CLI (`npm install -g @angular/cli`)

### Instalar dependencias

```bash
npm install
```

### Servidor de desarrollo

```bash
ng serve
```

Abre [http://localhost:4200](http://localhost:4200) en tu navegador.

## Despliegue en GitHub Pages

### Publicar cambios

Cada vez que hagas cambios y quieras actualizarlos en la página publicada, ejecuta estos comandos en orden:

```bash
# 1. Agregar los cambios
git add .

# 2. Crear un commit con un mensaje descriptivo
git commit -m "descripción de los cambios"

# 3. Subir los cambios al repositorio
git push

# 4. Construir y desplegar en GitHub Pages
ng deploy --base-href=/LinkImageViewer/
```

El paso 4 genera el build de producción y lo sube automáticamente a la rama `gh-pages`, actualizando la página pública.

### Resumen rápido

| Acción | Comando |
|--------|---------|
| Desarrollo local | `ng serve` |
| Build producción | `ng build` |
| Publicar en GitHub Pages | `ng deploy --base-href=/LinkImageViewer/` |
