# Projektstruktur für interaktive Lern-Web-Apps

Dieses Dokument beschreibt die Architektur und Struktur des Projekts "Schriftliche Rechenverfahren". Sie kann als Vorlage (Template) und Leitfaden für zukünftige Projekte (z. B. weitere Mathe-Trainer, Sprach-Apps etc.) verwendet werden.

## 1. Verzeichnisstruktur
Ein typisches Projekt dieses Typs besteht aus den folgenden Grunddateien, die in einem Ordner liegen:

```text
/ [Projekt-Root]
├── index.html       # Struktur und Benutzeroberfläche (SPA-Konzept)
├── style.css        # Design, Layouts, Animationen und responsive Anpassungen
├── script.js        # Spiellogik, Zustandsverwaltung (State), Event-Handling
└── background.jpg   # (Optional) Globale Medien wie Hintergrundbilder oder Icons
```

## 2. Architekturkonzept: Single Page Application (SPA)
Das Projekt nutzt ein simples SPA-Konzept ohne schwergewichtige Frameworks (wie React oder Angular). Alle "Seiten" sind in der `index.html` vorhanden und werden durch CSS (Klassen `.screen` und `.active`) ein- oder ausgeblendet.

### 2.1. HTML-Struktur (`index.html`)
Die `index.html` ist systematisch in logische "Screens" (Bildschirme) unterteilt:

1. **Globaler Hintergrund**: Ein statisches Element, das hinter allen Screens liegt.
2. **Startbildschirm** (`#startScreen`): Das Hauptmenü mit Navigation zu den Untermodulen.
3. **Auswahl-Screens** (z. B. `#additionSelectionScreen`): Menüs zur Auswahl des Schwierigkeitsgrads / Modus innerhalb einer Kategorie.
4. **Übungs-Screens** (z. B. `#additionScreen`): Die eigentliche Arbeitsfläche mit Aufgabe, Timer, Punktestand und interaktiven Elementen (z. B. Drag-and-Drop).
5. **Ergebnis-Screens** (z. B. `#resultScreen`): Zusammenfassung am Ende einer Runde mit Feedback und Button zum Neustart.

**Beispiel für eine Screen-Struktur:**
```html
<div id="screenName" class="screen">
    <div class="header">
        <button class="back-btn" onclick="showScreen('previousScreen')">Zurück</button>
        <!-- Timer / Fortschrittsanzeige -->
    </div>
    <div class="content">
        <!-- Titel, Aufgabe, interaktive Elemente, Feedback, Buttons -->
    </div>
</div>
```

### 2.2. Styling (`style.css`)
Das CSS ist modular aufgebaut und nutzt CSS-Variablen für ein konsistentes Theme.

1. **CSS Variablen (`:root`)**: Definition der Primärfarben für die Module (z. B. Grün für Addition, Blau für Subtraktion).
2. **Globale Styles & Resets**: `box-sizing`, Schriftarten, `body`-Styling.
3. **Screen Management**: Hilfsklassen zum Ein-/Ausblenden (`.screen`, `.active`).
4. **UI-Komponenten**: Buttons (`.operation-btn`, `.check-btn`), Container (`.task-area`), und Feedback-Boxen.
5. **Grid & Layouts**: Für spezifische Aufgabenformate (z. B. `display: grid` für Rechenkästchen).
6. **Responsive Design**: `@media`-Queries zur Anpassung der Größen auf Tablets und Smartphones.
7. **Montessori-Farben**: Globale Klassen für Stellenwerte (`.color-ones`, `.color-tens` etc.).

### 2.3. Logik (`script.js`)
Das JavaScript steuert den Ablauf und berechnet die Aufgaben dynamisch.

1. **Zustandsvariablen (State)**: Variablen, die den aktuellen Stand speichern (z. B. `currentScore`, `timerInterval`, `currentTask`).
2. **Navigation (`showScreen`)**: Eine zentrale Funktion, die allen `.screen` Elementen die Klasse `.active` wegnimmt und sie dem gewünschten Screen hinzufügt.
3. **Aufgabengenerierung (`generateTask`)**: Funktionen, die zufällige Zahlen basierend auf dem gewählten Modus generieren und das HTML (`innerHTML` oder DOM-Nodes) für die Aufgabe aufbauen.
4. **Interaktion & Drag-and-Drop**: Event-Listener für Bedienelemente. Bei Drag-and-Drop die Registrierung der Events `dragstart`, `dragover`, `drop`.
5. **Überprüfung (`checkAnswer`)**: Logik, die prüft, ob die Benutzereingaben korrekt sind, daraufhin die Klassen `.correct` / `.wrong` verteilt und das Feedback aktualisiert.
6. **Spielrunden-Management**: Funktionen wie `endRound()`, die den Timer stoppen, zum Ergebnisbildschirm wechseln und den Endstand anzeigen.

## 3. Best Practices für neue Projekte
Wenn ein neues Lern-Projekt gestartet wird, empfiehlt sich folgender Ablauf:

1. **Grundgerüst kopieren**: Übernimm die Navigation (`showScreen`) und die CSS-Klassen für `.screen` und `.active`.
2. **Farbkonzept anlegen**: Definiere in der `:root` Ebene der CSS-Datei das neue Farbschema deines Projekts.
3. **Screens definieren**: Baue in der `index.html` die Dummy-Divs für Main-Menu, Übung X, Übung Y, und Resultate.
4. **Logik Schritt-für-Schritt**:
   - Navigation testen.
   - Eine statische Aufgabe anzeigen.
   - Überprüfungslogik programmieren.
   - Zufallsgenerator für Aufgaben hinzufügen.
   - (Optional) Timer und Punkte-Zählung aktivieren.
5. **Mobile First**: Überprüfe zwischendurch immer, ob die `task-area` und die UI-Elemente auch auf kleineren Bildschirmen bedienbar bleiben.

## 4. Erweiterungen & Module hinzufügen
Um einem bestehenden Projekt ein neues Modul hinzuzufügen:
1. Button auf dem `#startScreen` ergänzen.
2. Einen Auswahl-Screen und einen Übungs-Screen ins HTML kopieren & IDs anpassen.
3. Eine neue Farbvariable in der CSS definieren und eine entsprechende Klasse (z. B. `.modul-color`) anlegen.
4. In der JS-Datei die Aufgabengenerierungs- und Prüfungslogik für das neue Modul implementieren.
