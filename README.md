# ⚡ FILTER-WERKSTATT

![CI](https://github.com/RadioFrequency073/filter-werkstatt/actions/workflows/ci.yml/badge.svg)

Ein Arcade-Spiel für Elektronik-Fans und alle, die Schaltungsentwicklung mal spielerisch erleben wollen: Du sitzt in der Entwicklungsabteilung und musst für drei Kundenaufträge die Bestückung einer Filterschaltung so justieren, dass die gemessene Frequenzgang-Kurve die Vorgabe des Kunden trifft — **bevor die 2-Minuten-Uhr ablauft**.

Das komplette Spiel steckt in **einer einzigen HTML-Datei** — kein Build, keine Abhängigkeiten, kein Server. Einfach im Browser öffnen und losspielen.

---

## 🚀 Schnellstart

**Option 1 — lokal spielen:**

1. Repository klonen oder [`index.html`](index.html) herunterladen
2. Datei per Doppelklick im Browser öffnen
3. „Werkstatt betreten" klicken (startet auch die Musik)

**Option 2 — online spielen (GitHub Pages):**

1. In den Repo-Einstellungen → **Pages** → Source: `main`
2. Danach unter `https://radiofrequency073.github.io/filter-werkstatt/` direkt spielbar

---

## 🎮 Spielprinzip

Jeder Level ist ein Kundenauftrag:

- Die **Schaltung ist vorgegeben** (Signalgeber, Bauteile, Ausgang) — aber die Bauteile sind falsch bestückt.
- Im **Bode-Diagramm** siehst du deine aktuelle Messkurve (cyan) und die **Kundenvorgabe** (gelb, gestrichelt).
- Mit den **Slidern** justierst du die Bauteile, bis beide Kurven übereinstimmen.
- Mit der **Prüffrequenz** fährst du einen Messpunkt durchs Spektrum — der **Sweep**-Button lässt ihn automatisch von 20 Hz bis 20 kHz laufen.
- Du hast **2 Minuten** pro Auftrag. Bei **≥ 85 % Überdeckung** nimmt die Qualitätsabnahme den Filter ab, die Restzeit gibt Bonuspunkte.

Läuft die Zeit ab, muss der Auftrag wiederholt werden.

### Die drei Aufträge

| Level | Filter | Schaltung | Einstellbare Bauteile | Ziel |
|-------|--------|-----------|----------------------|------|
| 1 | **Tiefpass** | Zweistufiger RC-Tiefpass (2. Ordnung) | R1, C1, R2, C2 | Tiefe Frequenzen passieren, hohe werden mit −40 dB/Dekade gedämpft |
| 2 | **Hochpass** | Zweistufiger RC-Hochpass (2. Ordnung) | R1, C1, R2, C2 | Tiefe Frequenzen werden blockiert, hohe passieren |
| 3 | **Bandpass** | RLC-Reihenschaltung | R, L, C | Nur ein Frequenzband um die Resonanzfrequenz f0 kommt durch |

### Steuerung

| Element | Funktion |
|---------|----------|
| **Slider R1 / C1 / R2 / C2 (bzw. R / L / C beim Bandpass)** | Bauteilwerte einstellen (logarithmisch über den gesamten Wertebereich) |
| **Slider Prüffrequenz** | Position des Messpunkts im Spektrum |
| **▶ Sweep starten** | Messpunkt fährt automatisch über 20 Hz – 20 kHz |
| **✅ Filter abnehmen** | Abnahme-Check: ≥ 85 % Überdeckung = bestanden |
| **🎵 Musik: AN/AUS** | Arcade-Chiptune-Hintergrundmusik |

---

## 🏆 Punktevergabe

```
Punkte (pro Level) = Überdeckung × 10 + Restzeit in Sekunden × 5
```

| Ergebnis | Punkte |
|----------|--------|
| Perfektion: 100 % Überdeckung, volle 2:00 übrig | 100 × 10 + 120 × 5 = **1600** pro Level |
| Knapp bestanden: 85 %, keine Restzeit | 85 × 10 = **850** |
| Theoretisches Maximum über alle 3 Level | **4800** |

---

## 🔬 Die Physik dahinter

Das Spiel rechnet mit echten Übertragungsfunktionen — was du siehst, ist keine gestellte Animation:

### Tiefpass / Hochpass (je zwei RC-Stufen)

Jede Stufe trägt ihre eigene Sperrfrequenz bei — die Gesamt-Kurve ist die **Summe beider Stufen** in dB. Liegen fc1 und fc2 gleichauf, entsteht ein runder 2.-Ordnungs-Knick; liegen sie auseinander, bildet sich ein Knie aus. Die Kundenforderungen nutzen das aus.

```
Grenzfrequenzen: fc1 = 1 / (2π · R1 · C1)
                 fc2 = 1 / (2π · R2 · C2)
Tiefpass:        A(f) = Σ Stufen   −10 · log10(1 + (f/fci)²)                  [dB]
Hochpass:        A(f) = Σ Stufen   ( 20 · log10(f/fci) − 10 · log10(1 + (f/fci)²) )   [dB]
```

### Bandpass (RLC-Reihenschaltung, Ausgang über R)

```
Resonanzfrequenz:  f0 = 1 / (2π · √(L · C))
Güte:              Q  = (1/R) · √(L / C)
Amplitude:         A(f) = 20 · log10( ωRC / √( (1 − ω²LC)² + (ωRC)² ) )   [dB]
```

Q bestimmt dabei die Schärfe der Resonanzspitze: großes Q = schmales Band, kleines Q = breites Band.

### Bauteilbereiche

| Bauteil | Bereich |
|---------|---------|
| Widerstand R | 1 kΩ – 1 MΩ |
| Kondensator C | 1 nF – 1 µF |
| Spule L | 1 mH – 1 H |
| Frequenzbereich | 20 Hz – 20 kHz (logarithmische Achse) |

Jede Kundenvorgabe ist zufällig generiert, aber **immer lösbar**.

---

## 💡 Tipps

- **Sweep nutzen:** Fahre zuerst einmal über das Spektrum und finde, wo deine Kurve vom Ziel abweicht.
- **−3-dB-Punkt:** Beim Tief-/Hochpass liegt die effektive Grenzfrequenz dort, wo die Kurve 3 dB unter dem Durchlassbereich liegt — bei zwei gleichauf liegenden Stufen genau bei fc1 = fc2.
- **Zwei Stufen, ein Ziel:** Stelle zuerst eine Stufe grob ein (z. B. per Sweep den Knick finden), dann die zweite — die Summenkurve ändert sich mit jeder Änderung sofort.
- **Resonanzspitze:** Beim Bandpass stellen L und C gemeinsam die Mittenfrequenz ein — R ändert nur die Bandbreite. Erst f0 treffen, dann mit R schärfen.
- **Ruhig bleiben:** Bei 10 Sekunden Restzeit tippt die Uhr rot und es gibt akustische Warnsignale.

---

## 📁 Projektstruktur

```
filter-werkstatt/
├── index.html                  # Das komplette Spiel (HTML + CSS + JS in einer Datei)
├── scripts/
│   └── validate.mjs            # CI-Prüfskript (HTML-Sanity, JS-Syntax, DOM-Referenzen)
└── .github/
    └── workflows/
        └── ci.yml              # GitHub-Actions-Workflow
```

## 🤖 Entwickeln & CI

Bei jedem Push und Pull Request läuft automatisch der [Workflow `ci.yml`](.github/workflows/ci.yml) und führt `scripts/validate.mjs` aus:

1. **HTML-Sanity** — DOCTYPE und `<title>` vorhanden
2. **JavaScript-Syntax** — der eingebettete `<script>`-Block wird extrahiert und mit `node --check` geprüft
3. **DOM-Integrität** — jede per `el()`/`em()` referenzierte ID muss im HTML existieren
4. **Selbstständigkeit** — keine externen Ressourcen, das Spiel läuft auch offline

Lokal ausführen:

```bash
node scripts/validate.mjs
```

## 🛠 Technik

- **Reines HTML/CSS/JavaScript** — keine Frameworks, keine Bibliotheken, keine Build-Schritte
- **Canvas-API** für das Bode-Diagramm inkl. Überdeckungs-Färbung (grün = Treffer, gelb = knapp, rot = daneben)
- **SVG-Schaltpläne** (IEC-Symbole: Rechteckwiderstand, Kondensatorplatten, Spulenschleifen)
- **Web Audio API** für die komplett prozedural generierte Arcade-Musik (Square-Lead, Triangel-Bass, Noise-Hi-Hats) und SFX — keine Audiodateien nötig
- Audiostart erst nach User-Geste, wie von Browsern vorgesehen

## 📜 Lizenz

Mit ♥ und Wechselspannung gebaut. Viel Spaß beim Bestücken — besonders beim Bandpass.
