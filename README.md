# Cuby

## What is it about?
Cuby is a minimalistic 2D platform game starring a black and white cube. The game consists of single-room levels, where a key mechanic is color inversion. The cube can switch between black and white, altering the room’s layout. In a world where perception is everything, Cuby's ability to invert colors reshapes reality itself: with every switch, new paths emerge, obstacles disappear... All to achieve the ultimate goal: reunite Cuby with the Cubo family, torn from its very vertices by the evil Tetrahedron Association. 

## Team members - Group I
| Member | Email | Role | Description |
|---------|----------------------------|-----|----------------------------------------------------------|
| Rubén Oliva Zamora | rubenoliva@uma.es | CEO | General group leader, responsible for submissions to the virtual campus. |
| Juan Manuel Valenzuela González | amcgil@uma.es | CTO | Responsible for technical aspects. |
| Jorge Repullo Serrano | jorgers4@uma.es | CIO | Manages information and documentation research. |
| Artur Vargas Carrion | arturvargas797@uma.es | COO | Responsible for planning and milestone tracking. |
| Eduardo González Bautista | edugb@uma.es | CXO | Oversees usability aspects. |

## Play Online

You can play Cuby directly in your browser without any installation.
Access it here: [https://arrozet.github.io/Cuby/](https://arrozet.github.io/Cuby/)

## How to install and run locally

To get Cuby up and running on your local machine, follow these steps. This guide assumes you are starting from scratch with no prior installations of the necessary tools.

### Prerequisites

1.  **Node.js and npm:** Cuby is a web application built with React, which requires Node.js and its package manager, npm.
    *   Go to the official Node.js website: [https://nodejs.org/](https://nodejs.org/)
    *   Download the LTS (Long Term Support) version recommended for most users.
    *   Run the installer and follow the on-screen instructions. npm is included with Node.js, so you don't need to install it separately.
    *   To verify the installation, open your terminal or command prompt and type:
        ```bash
        node -v
        npm -v
        ```
        You should see the installed versions of Node.js and npm printed.

2.  **Git (optional but recommended):** to clone the repository, Git is the easiest way.
    *   Go to the official Git website: [https://git-scm.com/downloads](https://git-scm.com/downloads)
    *   Download and install Git for your operating system.
    *   During installation, you can generally accept the default settings.

### Installation and running the application

1.  **Clone the repository:**
    *   Open your terminal or command prompt.
    *   Navigate to the directory where you want to store the project.
    *   If you have Git installed, clone the repository using the following command (replace `<repository_url>` with the actual URL of the Git repository):
        ```bash
        git clone <repository_url>
        ```
    *   If you don't have Git, you can download the project ZIP file from the repository (e.g., from GitHub) and extract it to your desired location.
    *   Navigate into the cloned/extracted project directory:
        ```bash
        cd Cuby
        ```

2.  **Navigate to the web application directory:**
    The React application is located within the `web/cuby` subfolder.
    ```bash
    cd web/cuby
    ```

3.  **Install dependencies:**
    Once inside the `web/cuby` directory, install the project's dependencies using npm:
    ```bash
    npm install
    ```
    This command reads the `package.json` file and downloads all the necessary libraries and packages for the project.

4.  **Run the application:**
    After the dependencies are installed, you can start the development server:
    ```bash
    npm start
    ```
    This will launch the application in your default web browser, usually at `http://localhost:3000`.

You should now have Cuby running locally on your machine!

[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/arrozet/Cuby)
