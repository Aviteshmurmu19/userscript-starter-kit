# Userscript Starter Kit

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![Issues](https://img.shields.io/github/issues/Aviteshmurmu19/userscript-starter-kit)](https://github.com/Aviteshmurmu19/userscript-starter-kit/issues)
[![Forks](https://img.shields.io/github/forks/Aviteshmurmu19/userscript-starter-kit)](https://github.com/Aviteshmurmu19/userscript-starter-kit/network/members)
[![Stars](https://img.shields.io/github/stars/Aviteshmurmu19/userscript-starter-kit)](https://github.com/Aviteshmurmu19/userscript-starter-kit/stargazers)

A professional starter kit for building complex and optimized userscripts using a modern Gulp-based build process. Go from modular source files to a production-ready, minified userscript with a single command.

## About The Project

Writing userscripts in a single file can be difficult to manage, debug, and scale. This starter kit solves that problem by providing a modern development environment that separates concerns and automates the build process.

It allows you to write your UI in **HTML**, your styling in **CSS**, and your logic in **JavaScript**, and then intelligently bundles and optimizes them into a final, high-performance userscript.

**Core Technologies:**

- [Gulp.js](https://gulpjs.com/) for task automation
- [Terser](https://terser.org/) for JavaScript minification
- [CSSNano](https://cssnano.co/) for CSS minification
- [html-minifier-terser](https://github.com/terser/html-minifier-terser) for HTML minification

## Features

- **Modular Structure:** Keep your HTML, CSS, and JavaScript in separate, organized files.
- **Automated Build Process:** Automatically bundle, minify, and assemble your source files.
- **Powerful Optimization:** Leverages Terser and CSSNano for best-in-class JavaScript and CSS minification.
- **Safe HTML Injection:** Uses `DOMParser` to safely inject HTML, bypassing modern browser security policies like Trusted Types.
- **Multiple Build Targets:** Generate human-readable development builds and highly-optimized production builds.
- **Aggressive Mode:** An optional aggressive build for maximum size reduction.
- **Live Development Server:** Automatically rebuilds your script every time you save a file.

## Getting Started

Follow these steps to get your local development environment up and running.

### Prerequisites

You must have [Node.js](https://nodejs.org/) (which includes npm) installed on your system.

- `node` (v18.x or later recommended)
- `npm` (v8.x or later recommended)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/Aviteshmurmu19/userscript-starter-kit.git
    ```
2.  **Navigate into the project directory:**
    ```bash
    cd userscript-starter-kit
    ```
3.  **Install the necessary npm packages:**
    ```bash
    npm install
    ```

## Folder Structure

The project is organized into two main directories:

```
.
├── dist/                # Output directory for your final, built userscripts.
├── src/                 # Your development source code lives here.
│   ├── core-logic.js    # Your main script functionality.
│   ├── styles.css       # Your CSS styles.
│   ├── template.js      # The userscript metadata block (header).
│   └── ui.html          # The HTML structure for your UI.
├── gulpfile.js          # The "factory blueprint" that defines all build tasks.
├── package.json         # Project metadata and list of dependencies.
└── README.md            # This file.
```

## Usage

This starter kit is managed through simple npm commands.

| Command                    | Description                                                                                                     |
| -------------------------- | --------------------------------------------------------------------------------------------------------------- |
| `npm start`                | **For Development.** Starts a watcher that automatically rebuilds all versions whenever you save a source file. |
| `npm run build`            | Builds both the development (`.user.js`) and standard production (`.min.user.js`) versions once.                |
| `npm run build:dev`        | Builds only the unminified development version.                                                                 |
| `npm run build:prod`       | Builds only the standard, minified production version.                                                          |
| `npm run build:aggressive` | Builds a special, ultra-optimized production version (`.aggressive.min.user.js`).                               |

### Development Workflow

1.  Run the watch command in your terminal:
    ```bash
    npm start
    ```
2.  Edit the files in the `src/` directory.
3.  Every time you save, Gulp will automatically generate the final userscripts in the `dist/` folder.
4.  Install a generated script (e.g., `dist/my-cool-script.user.js`) into Violentmonkey or Tampermonkey.
5.  Simply refresh the target webpage to see your changes. There is no need to reinstall the script after the initial installation.

## Customizing Your Script

To adapt this kit for your own project, you'll primarily edit the files in the `src/` directory:

1.  **`src/template.js`**:

    - Change the userscript metadata (`@name`, `@description`, `@match`, etc.) to fit your script's needs.

2.  **`src/ui.html`**:

    - Write the HTML for any UI elements your script needs to add to the page.

3.  **`src/styles.css`**:

    - Write the CSS to style your UI elements.

4.  **`src/core-logic.js`**:
    - This is where your main application logic goes. The file is already set up to inject the HTML from `ui.html` and attach event listeners.

## Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## License

Distributed under the MIT License. This project is free and open-source.

## Contact

Avitesh Murmu - [@Aviteshmurmu19](https://github.com/Aviteshmurmu19) - (aviteshmurmu19@gmail.com)

Project Link: [https://github.com/Aviteshmurmu19/userscript-starter-kit](https://github.com/Aviteshmurmu19/userscript-starter-kit)
