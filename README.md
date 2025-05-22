
# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/341329cb-430a-4761-a03c-48338ee59ae0

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/341329cb-430a-4761-a03c-48338ee59ae0) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## XAMPP MySQL Setup

To set up the MySQL database using XAMPP:

1. Download and install XAMPP from https://www.apachefriends.org/
2. Start the XAMPP Control Panel and start the Apache and MySQL services
3. Open your web browser and go to http://localhost/phpmyadmin
4. Create a new database named `mwangaza_db`
5. Import the database schema from the SQL file in the `mysql/init/01-schema.sql` directory
6. Update the database connection settings in the application:
   - Go to the Database Configuration page
   - Verify that the host is set to "localhost"
   - Username should be "root"
   - Password is typically blank in default XAMPP installations
   - Database name should be "mwangaza_db"
   - Click "Test Connection" and then "Save Configuration"

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/341329cb-430a-4761-a03c-48338ee59ae0) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
