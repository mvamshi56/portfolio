# 🚀 How to Deploy - Simple Guide

## Method 1: Double-Click Script (EASIEST) ⚡

### Windows Users:
1. **Find** the file `deploy.bat` in your portfolio folder
2. **Double-click** `deploy.bat`
3. **Wait** for it to finish
4. **Done!** Visit https://mvamshi56.github.io/portfolio/ in 2 minutes

That's it! The script does everything automatically.

---

## Method 2: PowerShell (Alternative)

1. **Right-click** `deploy.ps1`
2. **Select** "Run with PowerShell"
3. If prompted, press `R` to run once
4. **Wait** for completion
5. **Done!**

---

## Method 3: Manual Commands (If scripts don't work)

### Step 1: Open Command Prompt or Terminal
- **Windows**: Press `Win + R`, type `cmd`, press Enter
- **Or**: Open Git Bash if you have it installed

### Step 2: Navigate to portfolio folder
```bash
cd C:\Users\USER\OneDrive\Desktop\demo\portfolio
```

### Step 3: Run these 3 commands one by one:

```bash
git add .
```
Press Enter, then:

```bash
git commit -m "feat: add 2026 portfolio upgrades"
```
Press Enter, then:

```bash
git push origin main
```
Press Enter and wait for completion.

---

## 📋 What Happens Next?

1. ✅ Files upload to GitHub
2. ✅ GitHub Pages automatically rebuilds (1-2 minutes)
3. ✅ Your live site updates with new features

---

## 🔍 Verify It Worked

### After 2 minutes, visit: https://mvamshi56.github.io/portfolio/

**You should see:**
- 🌓 Theme toggle button (top-right corner)
- 📊 GitHub stats (Projects section)
- 🎬 Smooth animations when scrolling
- 🔔 Welcome toast message

---

## ❓ Troubleshooting

### Issue: "git is not recognized"
**Solution**: You need to install Git first
- Download from: https://git-scm.com/download/win
- Install, then restart terminal and try again

### Issue: "Permission denied" or authentication error
**Solution**: Configure Git credentials
```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

### Issue: Script won't run on PowerShell
**Solution**: Run this first to allow scripts:
```powershell
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
```
Then try `deploy.ps1` again.

### Issue: Changes not visible after 2 minutes
**Solution**: 
- Clear browser cache (Ctrl+Shift+R)
- Check GitHub Actions: https://github.com/mvamshi56/portfolio/actions
- Wait another minute

---

## 📱 Test Features After Deploy

1. **Dark Mode**: Click moon/sun icon (top-right)
2. **GitHub Stats**: Scroll to Projects section
3. **Animations**: Scroll down the page
4. **Mobile**: Test on phone browser
5. **Performance**: Run Google PageSpeed test

---

## ✅ You're Done!

Once deployed, your portfolio has:
- ✨ Dark/Light mode toggle
- 📊 Live GitHub metrics
- 🔍 Enhanced SEO
- ♿ Better accessibility
- 🎬 Smooth animations
- ⚡ Performance optimizations

**No more steps needed!** 🎉

---

## 📞 Need Help?

If you have any issues:
1. Check the error message carefully
2. Google the error if needed
3. Or share the error message and I can help troubleshoot

---

**Quick Links:**
- Your Portfolio: https://mvamshi56.github.io/portfolio/
- GitHub Repo: https://github.com/mvamshi56/portfolio
- Full Docs: Read `UPGRADES.md`
