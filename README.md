# Jira CI/CD Status Panel (Atlassian Forge App)

## 🚀 Overview
A Jira issue panel app built with Atlassian Forge that displays real-time GitHub Actions CI/CD pipeline status directly inside Jira issues. Perfect for hackathons and dev teams who want instant visibility into their deployment pipelines—no more context switching!

## ✨ Features
- **Jira Issue Panel**: Custom panel in Jira issue view
- **GitHub Actions Integration**: Fetches pipeline status for a hardcoded repo/branch
- **Status Display**: Shows pipeline status (success/fail/running), duration, timestamp
- **Commit Info**: Shows commit SHA, message, author
- **Recent Runs**: Displays the last 3 workflow runs with status icons
- **Manual Refresh**: Instantly update the status
- **Dark/Light Mode**: Automatically adapts to Jira/system theme
- **Modern UI**: Beautiful monospace, developer-friendly design

## 🏆 Why Use This App?
- **Instant CI/CD Visibility**: See build/deploy status right in Jira
- **No Context Switching**: Stay focused, no need to open GitHub
- **Impress Judges/Stakeholders**: Demo-ready, visually impressive
- **Zero Config for Users**: Repo/branch/token are hardcoded for hackathon/demo simplicity

## ⚡️ How It Works
1. User opens a Jira issue
2. The app fetches the latest GitHub Actions workflow runs for the configured repo/branch
3. Status, commit info, and recent runs are displayed in a beautiful panel
4. User can click "Refresh" to update instantly

## 🛠️ Setup & Usage
1. **Clone this repo**
2. **Set your GitHub info** in `src/resolvers.js`:
   ```js
   const GITHUB_OWNER = 'your-github-username';
   const GITHUB_REPO = 'your-repo-name';
   const GITHUB_BRANCH = 'main';
   const GITHUB_TOKEN = 'your-personal-access-token';
   ```
   > ⚠️ **Never commit real tokens to public repos!** For hackathons only.
3. **Install dependencies**
   ```bash
   cd issue-panel
   npm install
   cd static/hello-world
   npm install
   ```
4. **Build the frontend**
   ```bash
   npm run build
   cd ../../
   ```
5. **Deploy to Forge**
   ```bash
   forge deploy
   ```
6. **Install the app** in your Jira Cloud site (see Forge docs)
7. **Open a Jira issue** and see the CI/CD panel in action!

## 📝 Customization
- To change the repo/branch/token, edit the constants in `src/resolvers.js` and redeploy.
- For production, implement secure user config and never hardcode secrets.

## 💡 Demo Tips
- Use a repo with active GitHub Actions workflows
- Push a commit to see status update live
- Show dark/light mode by toggling your system/Jira theme

## 🙏 Credits
- Built with Atlassian Forge, React, and GitHub Actions API
- UI inspired by Atlassian Design System




**Made for hackathons and dev teams who want CI/CD at a glance!**


## Snap Shot

![issuepannel](https://github.com/user-attachments/assets/2172c211-ddd2-4cbe-ba44-442fe9bded04)[package-lock.json](https://github.com/user-attachments/files/20524165/package-lock.json)




