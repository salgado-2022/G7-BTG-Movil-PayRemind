# PayRemind

Aplicación móvil híbrida de **recordatorio de pagos** desarrollada como proyecto del curso **Énfasis en Programación Móvil** del Politécnico Grancolombiano.

Permite registrar obligaciones financieras (nombre, valor, fecha y hora), recibir una notificación local en el momento programado y marcarlas como pagadas para consultar el histórico. Funciona **100% offline** — los datos nunca salen del dispositivo.

---

## Probar la app (APK precompilado)

Para evaluar la app sin compilar nada, descarga el APK debug listo para instalar:

**📥 [Descargar PayRemind-debug-v0.0.1.apk](releases/PayRemind-debug-v0.0.1.apk)** (~26 MB)

### Instalación en Android

1. Descarga el archivo en tu dispositivo (o transfiérelo por USB/Drive).
2. Abre el APK desde el gestor de archivos.
3. Android pedirá habilitar **"Instalar apps de fuentes desconocidas"** la primera vez — concédelo solo a la app de archivos que estés usando.
4. Pulsa **Instalar** y abre PayRemind.
5. Al primer uso, acepta el permiso de **Notificaciones** (necesario para los recordatorios).

> ⚠️ Es un APK **debug**: sin firmar para producción, sin minificación. Sirve para evaluación funcional, no para distribución pública. El APK firmado de release se genera siguiendo la sección [Generar APK / AAB firmado](#generar-apk--aab-firmado).
>
> Requisitos del dispositivo: **Android 8.0 (API 26) o superior**.

---

## Tabla de contenidos

1. [Stack tecnológico](#stack-tecnológico)
2. [Requisitos previos](#requisitos-previos)
3. [Instalación](#instalación)
4. [Ejecución en local (web)](#ejecución-en-local-web)
5. [Ejecución en Android](#ejecución-en-android)
6. [Build de producción](#build-de-producción)
7. [Generar APK / AAB firmado](#generar-apk--aab-firmado)
8. [Publicación en Google Play](#publicación-en-google-play)
9. [Tests y linter](#tests-y-linter)
10. [Estructura del proyecto](#estructura-del-proyecto)
11. [Scripts disponibles](#scripts-disponibles)
12. [Troubleshooting](#troubleshooting)

---

## Stack tecnológico

| Capa | Tecnología |
|------|-----------|
| Framework UI | Ionic 8 + Angular 20 (Standalone Components) |
| Runtime nativo | Capacitor 8 |
| Persistencia nativa | `@capacitor-community/sqlite` |
| Persistencia web | `localStorage` (fallback) |
| Notificaciones | `@capacitor/local-notifications` |
| Lenguaje | TypeScript estricto |
| Target mínimo | Android 8.0 (API 26) |

---

## Requisitos previos

Instala las siguientes herramientas antes de comenzar:

| Herramienta | Versión recomendada | Verificación |
|-------------|--------------------|--------------|
| **Node.js** | ≥ 20.x LTS | `node -v` |
| **npm** | ≥ 10.x | `npm -v` |
| **Ionic CLI** | ≥ 7.x | `ionic -v` |
| **Angular CLI** | ≥ 20.x | `ng version` |
| **Java JDK** | 17 (Temurin recomendado) | `java -version` |
| **Android Studio** | Jellyfish o superior | — |
| **Android SDK** | API 34 + Build Tools 34.x | desde Android Studio |
| **Git** | ≥ 2.40 | `git --version` |

### Instalación de CLIs globales

```powershell
npm install -g @ionic/cli @angular/cli
```

### Variables de entorno (Windows)

Asegúrate de tener configuradas estas variables del sistema:

```
JAVA_HOME       C:\Program Files\Eclipse Adoptium\jdk-17.x.x
ANDROID_HOME    C:\Users\<tu-usuario>\AppData\Local\Android\Sdk
```

Y añade a `PATH`:

```
%JAVA_HOME%\bin
%ANDROID_HOME%\platform-tools
%ANDROID_HOME%\emulator
%ANDROID_HOME%\cmdline-tools\latest\bin
```

Verifica con:

```powershell
adb --version
```

---

## Instalación

Clona el repositorio e instala dependencias:

```powershell
git clone <url-del-repo>
cd movil/payremind
npm install
```

Esto descargará tanto las dependencias de Angular/Ionic como los plugins de Capacitor declarados en `package.json`.

---

## Ejecución en local (web)

Para desarrollo rápido en el navegador (usa el adaptador `localStorage` como backend):

```powershell
npm start
```

O equivalente con Ionic CLI (recarga en caliente + DevApp):

```powershell
ionic serve
```

La app queda disponible en [http://localhost:8100](http://localhost:8100) (o `4200` con `npm start`).

> **Nota:** En modo web las notificaciones locales **no disparan** push nativos — el `NotificationService` registra el agendamiento pero requiere un dispositivo/emulador Android para verlas.

---

## Ejecución en Android

### 1. Compilar los assets web

```powershell
npm run build
```

Esto genera la carpeta `www/` que Capacitor empaqueta como WebView.

### 2. Sincronizar con el proyecto nativo

```powershell
npx cap sync android
```

Copia `www/` dentro de `android/app/src/main/assets/` y actualiza plugins.

### 3. Abrir en Android Studio

```powershell
npx cap open android
```

Desde Android Studio:

1. Espera que termine el **Gradle Sync** inicial.
2. Conecta un dispositivo físico (con depuración USB activada) o inicia un emulador (AVD Manager).
3. Pulsa **Run ▶** (o `Shift+F10`).

### Atajo: build + sync + run en un solo comando

```powershell
npm run build; npx cap sync android; npx cap run android
```

> Necesitas un dispositivo conectado o un emulador corriendo para que `cap run` lo detecte.

---

## Build de producción

```powershell
npm run build -- --configuration production
npx cap sync android
```

El build de Angular aplica AOT, tree-shaking y minificación. El `cap sync` actualiza los assets nativos.

---

## Generar APK / AAB firmado

### 1. Crear el keystore (solo una vez)

```powershell
keytool -genkey -v -keystore payremind-release.keystore `
  -alias payremind -keyalg RSA -keysize 2048 -validity 10000
```

Guarda el archivo `payremind-release.keystore` **fuera del repositorio** (está cubierto por `.gitignore`).

### 2. Configurar `android/keystore.properties`

Crea el archivo `android/keystore.properties` (también ignorado por git):

```properties
storeFile=../../payremind-release.keystore
storePassword=<tu-password>
keyAlias=payremind
keyPassword=<tu-password>
```

### 3. Editar `android/app/build.gradle`

Antes del bloque `android { ... }`:

```gradle
def keystorePropertiesFile = rootProject.file("keystore.properties")
def keystoreProperties = new Properties()
keystoreProperties.load(new FileInputStream(keystorePropertiesFile))
```

Dentro de `android { ... }`:

```gradle
signingConfigs {
    release {
        keyAlias keystoreProperties['keyAlias']
        keyPassword keystoreProperties['keyPassword']
        storeFile file(keystoreProperties['storeFile'])
        storePassword keystoreProperties['storePassword']
    }
}
buildTypes {
    release {
        signingConfig signingConfigs.release
        minifyEnabled true
        proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
    }
}
```

### 4. Compilar

**APK** (instalación manual):

```powershell
cd android
.\gradlew assembleRelease
```

Salida: `android/app/build/outputs/apk/release/app-release.apk`

**AAB** (formato requerido por Google Play):

```powershell
cd android
.\gradlew bundleRelease
```

Salida: `android/app/build/outputs/bundle/release/app-release.aab`

---

## Publicación en Google Play

1. Entra a [Google Play Console](https://play.google.com/console) y crea una nueva aplicación.
2. Completa la **ficha de la tienda**: descripción corta/larga, capturas (mínimo 2), ícono 512×512, gráfico de funciones 1024×500.
3. En **Política → Contenido de la app** completa los cuestionarios (anuncios, clasificación, privacidad).
4. Cambia `appId` en `capacitor.config.ts` a un identificador único (ej. `co.edu.poligran.payremind`) y vuelve a sincronizar:
   ```powershell
   npx cap sync android
   ```
5. Sube `app-release.aab` en **Producción → Crear nueva versión**.
6. Completa el formulario de privacidad declarando que la app **no recolecta datos**.
7. Envía a revisión. Aprobación típica: 1–7 días.

> Para pruebas internas previas, usa los canales **Pruebas internas** o **Cerradas** antes de promover a producción.

---

## Tests y linter

```powershell
# Tests unitarios (Karma + Jasmine)
npm test

# Tests con cobertura
npm test -- --code-coverage --watch=false

# Linter
npm run lint
```

La cobertura se genera en `coverage/`. Objetivo mínimo en servicios: **70%**.

---

## Estructura del proyecto

```
payremind/
├── android/                    Proyecto nativo Android (Capacitor)
├── src/
│   └── app/
│       ├── core/
│       │   ├── models/         reminder.model.ts
│       │   ├── services/       reminder, notification, platform
│       │   └── repositories/   repository + storage adapters
│       ├── pages/
│       │   ├── reminder-list/  Lista de pendientes + FAB
│       │   └── history/        Histórico de pagados
│       ├── components/         reminder-form-modal, reminder-item, confirm-dialog
│       ├── app.component.ts
│       ├── app.routes.ts
│       └── app.config.ts
├── capacitor.config.ts
├── ionic.config.json
├── angular.json
└── package.json
```

---

## Scripts disponibles

| Script | Descripción |
|--------|-------------|
| `npm start` | Servidor de desarrollo Angular en `:4200` |
| `ionic serve` | Servidor de desarrollo Ionic en `:8100` |
| `npm run build` | Build de producción a `www/` |
| `npm run watch` | Build incremental en modo dev |
| `npm test` | Ejecuta los tests con Karma |
| `npm run lint` | Linter ESLint sobre `src/` |
| `npx cap sync android` | Sincroniza `www/` y plugins con Android |
| `npx cap open android` | Abre el proyecto en Android Studio |
| `npx cap run android` | Compila e instala en dispositivo/emulador |

---

## Troubleshooting

### `gradlew: command not found` en PowerShell
Usa `.\gradlew` (con backslash inicial). En Windows el script es `gradlew.bat`.

### "SDK location not found"
Crea `android/local.properties` con:
```
sdk.dir=C\:\\Users\\<usuario>\\AppData\\Local\\Android\\Sdk
```

### Las notificaciones no aparecen en Android 13+
Acepta el permiso `POST_NOTIFICATIONS` la primera vez que se solicita. Si lo rechazaste, actívalo manualmente en *Ajustes → Apps → PayRemind → Notificaciones*.

### SQLite no inicializa en el emulador
Verifica que el plugin esté en `android/app/src/main/assets/capacitor.plugins.json` después del `cap sync`. Si no, ejecuta:
```powershell
npx cap sync android --force
```

### Cambios en TypeScript no se reflejan en el dispositivo
Recuerda que tras editar `src/` debes ejecutar **build + sync** antes de relanzar:
```powershell
npm run build; npx cap sync android
```

### Error de versión Java al compilar Gradle
PayRemind requiere **JDK 17**. Verifica con `java -version` y ajusta `JAVA_HOME` si tienes otra versión por defecto.

---

## Licencia

Proyecto académico — Politécnico Grancolombiano, 2026.

**Docente:** Víctor Castro  
**Curso:** Énfasis en Programación Móvil
