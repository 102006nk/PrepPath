# PrepPath — Personal Placement Preparation Website

This is a personal placement tracker built with Java Spring Boot. The progress is saved in your browser using `localStorage`; no account or database is needed.

## Requirements
- JDK 17 or newer
- Maven 3.6 or newer
- VS Code (recommended) with Extension Pack for Java

## Run it
1. Extract `preppath-personal.zip`.
2. Open the extracted `preppath-personal` folder in VS Code.
3. Open Terminal → New Terminal.
4. Run `mvn spring-boot:run`.
5. Visit `http://localhost:8080`.

The first Maven run may need internet access to download Spring Boot dependencies. After it has downloaded dependencies, the website itself can be used locally. The analytics charts load Chart.js from a CDN, so charts need internet access; all other tracking works without it.

## Where is progress stored?
Progress is stored in the browser's local storage for the website origin `http://localhost:8080`. Use the Export my progress button to download a JSON backup. Use Import progress to restore it.

Important:
- Do not clear browser site data unless you have exported a backup.
- Use the same browser and same address (`http://localhost:8080`) to see the same saved progress.
- Local storage is not encrypted and is not suitable for passwords or sensitive information.
- This is a single-user local website, not an online multi-user service.

## Project structure
- `src/main/java/com/preppath/PrepPathApplication.java` — Java Spring Boot entry point
- `src/main/resources/static/index.html` — website structure
- `src/main/resources/static/style.css` — design and responsive layout
- `src/main/resources/static/app.js` — planner, trackers, charts and local saving
- `src/main/resources/application.properties` — local server settings

## Roadmap date
The 100-day planner starts on 26 November 2026, matching the plan we discussed. You can still use the planner at any time; it displays the full sequence of 100 days.
