# 🔍 Stop Playing Detective with Your React Components!

Ever spent 10 minutes hunting for which component is rendering that one stubborn `<div>` in your React app? 

**babel-plugin-locate-source** automatically adds source location info to every JSX element in dev mode:

```html
<!-- Before: Mystery element -->
<button class="my-button">Click me</button>

<!-- After: Crystal clear! -->
<button 
  data-at="Button.jsx:15" 
  data-is="Button" 
  data-in="HomePage" 
  class="my-button">
  Click me
</button>
```

**The best part?** Enable devTools and you can **click any element to jump straight to its source code** in VS Code, IntelliJ, or your favorite editor! 🚀

```bash
npm install --save-dev babel-plugin-locate-source
```

Just add it to your Babel config and forget about it. Zero production impact, maximum debugging power.

**Who else is tired of component hide-and-seek?** 👀

---

GitHub: https://github.com/apperside/babel-plugin-locate-source

#React #JavaScript #DevTools #Babel #Debugging #WebDev #Frontend #DeveloperExperience #ReactJS #DevLife 