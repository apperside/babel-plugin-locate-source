/**
 * JavaScript handler for clickable source locations
 * This file should be included in your project when using the 'clickable' option
 */
(function () {
    if (typeof window == "undefined") return;
    window.initLocateSourceClickHandlers = function () {
        // Track picker mode state
        let pickerModeActive = false;

        // Simple click handler for when picker mode is active
        document.addEventListener('click', function (e) {
            // If picker mode isn't active, do nothing
            if (!pickerModeActive) return;

            // Find the closest element with data attributes
            const target = e.target.closest('[data-at]');
            
            if (target) {
                e.preventDefault();
                e.stopPropagation();
                
                const filepath = target.getAttribute('data-filepath');
                const line = target.getAttribute('data-line');
                
                if (filepath && line) {
                    // Support multiple IDEs based on user preference
                    // Default to VS Code
                    const defaultIDE = localStorage.getItem('locate-source-ide') || 'vscode';
                    
                    let uri;
                    switch (defaultIDE) {
                        case 'vscode':
                            uri = `vscode://file/${encodeURIComponent(filepath)}:${line}`;
                            break;
                        case 'intellij':
                            uri = `idea://open?file=${encodeURIComponent(filepath)}&line=${line}`;
                            break;
                        case 'atom':
                            uri = `atom://open?file=${encodeURIComponent(filepath)}&line=${line}`;
                            break;
                        case 'sublime':
                            uri = `subl://open?url=file://${encodeURIComponent(filepath)}&line=${line}`;
                            break;
                        case 'cursor':
                            uri = `cursor://file/${encodeURIComponent(filepath)}:${line}`;
                            break;
                        default:
                            uri = `vscode://file/${encodeURIComponent(filepath)}:${line}`;
                    }
                    
                    // Open URL and handle potential erroneous quotes
                    const cleanUri = uri.replace(/['"`]/g, '');
                    window.open(cleanUri, '_blank');
                    console.log(`Opening file: ${filepath} at line ${line} with ${defaultIDE}`);
                    
                    // Disable picker mode after a successful pick
                    setPickerMode(false);
                }
            }
        }, true);

        // Function to toggle picker mode
        const setPickerMode = (active) => {
            pickerModeActive = active;
            
            // Update button state
            const pickerButton = document.getElementById('locate-source-picker-toggle');
            if (pickerButton) {
                if (active) {
                    pickerButton.classList.add('active');
                    document.body.classList.add('locate-source-picker-active');
                    pickerButton.title = 'Click any element to open its source (ESC to cancel)';
                } else {
                    pickerButton.classList.remove('active');
                    document.body.classList.remove('locate-source-picker-active');
                    pickerButton.title = 'Pick element to open source';
                }
            }
        };

        // Add ESC key handler to exit picker mode
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && pickerModeActive) {
                setPickerMode(false);
            }
        });

        // Add a small settings panel to let users choose their IDE
        const createSettingsPanel = () => {
            // Only create once
            if (document.getElementById('locate-source-settings')) return;

            const panel = document.createElement('div');
            panel.id = 'locate-source-settings';
            panel.style.cssText = `
        position: fixed;
        bottom: 10px;
        right: 10px;
        background: #333;
        color: white;
        padding: 10px;
        border-radius: 4px;
        font-family: sans-serif;
        font-size: 12px;
        z-index: 10001;
        box-shadow: 0 2px 5px rgba(0,0,0,0.3);
        display: none;
      `;

            const currentIDE = localStorage.getItem('locate-source-ide') || 'vscode';

            panel.innerHTML = `
        <div style="margin-bottom: 8px;"><strong>Source Location Settings</strong></div>
        <div style="margin-bottom: 8px;">Select your IDE:</div>
        <select id="locate-source-ide-select" style="width: 100%; margin-bottom: 8px;">
          <option value="vscode" ${currentIDE === 'vscode' ? 'selected' : ''}>VS Code</option>
          <option value="intellij" ${currentIDE === 'intellij' ? 'selected' : ''}>IntelliJ</option>
          <option value="atom" ${currentIDE === 'atom' ? 'selected' : ''}>Atom</option>
          <option value="sublime" ${currentIDE === 'sublime' ? 'selected' : ''}>Sublime</option>
          <option value="cursor" ${currentIDE === 'cursor' ? 'selected' : ''}>Cursor</option>
        </select>
        <button id="locate-source-settings-close" style="padding: 3px 8px;">Save & Close</button>
      `;

            document.body.appendChild(panel);

            // Handle settings interaction
            document.getElementById('locate-source-ide-select').addEventListener('change', function (e) {
                localStorage.setItem('locate-source-ide', e.target.value);
            });

            document.getElementById('locate-source-settings-close').addEventListener('click', function () {
                panel.style.display = 'none';
            });
        };

        // Create toggle button for settings
        const createToggleButton = () => {
            // Only create once
            if (document.getElementById('locate-source-settings-toggle')) return;

            const button = document.createElement('div');
            button.id = 'locate-source-settings-toggle';
            button.innerHTML = '⚙️';
            button.title = 'Source Location Settings';
            button.style.cssText = `
        position: fixed;
        bottom: 10px;
        right: 10px;
        background: #333;
        color: white;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        z-index: 10001;
        box-shadow: 0 2px 5px rgba(0,0,0,0.3);
        font-size: 16px;
      `;

            document.body.appendChild(button);

            button.addEventListener('click', function () {
                const panel = document.getElementById('locate-source-settings');
                if (panel) {
                    panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
                    
                    // Turn off picker mode when opening settings
                    if (panel.style.display === 'block') {
                        setPickerMode(false);
                    }
                }
            });
        };
        
        // Create element picker button
        const createPickerButton = () => {
            // Only create once
            if (document.getElementById('locate-source-picker-toggle')) return;

            const button = document.createElement('div');
            button.id = 'locate-source-picker-toggle';
            button.innerHTML = '🎯';
            button.title = 'Pick element to open source (crosshair mode)';
            button.style.cssText = `
        position: fixed;
        bottom: 10px;
        right: 50px;
        background: #333;
        color: white;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        z-index: 10001;
        box-shadow: 0 2px 5px rgba(0,0,0,0.3);
        font-size: 16px;
        transition: background-color 0.2s ease;
      `;

            document.body.appendChild(button);

            // Add active styles
            const style = document.createElement('style');
            style.textContent = `
        #locate-source-picker-toggle.active {
          background-color: #f44336;
        }
        .locate-source-picker-active [data-at]:hover {
          outline: 2px solid #f44336 !important;
          cursor: pointer !important;
        }
      `;
            document.head.appendChild(style);

            button.addEventListener('click', function () {
                // Toggle picker mode
                setPickerMode(!pickerModeActive);
                
                // Close settings panel if open
                const panel = document.getElementById('locate-source-settings');
                if (panel && panel.style.display !== 'none') {
                    panel.style.display = 'none';
                }
            });
        };

        // Initialize UI components
        createSettingsPanel();
        createToggleButton();
        createPickerButton();

        console.log('Source location handlers initialized');
    };

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', window.initLocateSourceClickHandlers);
    } else {
        window.initLocateSourceClickHandlers();
    }
})(); 