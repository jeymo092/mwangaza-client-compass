
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

## Docker MySQL Setup

To run the MySQL database using Docker:

1. Make sure Docker is installed on your system.
2. Run the following command in the project root directory:

```sh
docker-compose up -d
```

This will start a MySQL container with the following credentials:
- Database name: mwangaza_db
- Username: mwangaza_user
- Password: mwangaza_password
- Port: 3306

The database schema will be automatically created using the initialization script in `mysql/init/01-schema.sql`.

To stop the container:

```sh
docker-compose down
```

To stop the container and remove the volume:

```sh
docker-compose down -v
```

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/341329cb-430a-4761-a03c-48338ee59ae0) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
