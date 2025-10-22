// Application AS/400 - Version simplifiée
class AS400App {
    constructor() {
        this.currentScreen = 'auth-screen';
        this.init();
    }

    init() {
        console.log("Initializing AS400App");
        this.setupEventListeners();
        this.updateTime();
        setInterval(() => this.updateTime(), 1000);
        this.showScreen('auth-screen');
    }

    setupEventListeners() {
        console.log("Setting up event listeners");
        
        // Bouton de connexion
        const connectBtn = document.getElementById('auth-signin');
        if (connectBtn) {
            connectBtn.addEventListener('click', () => this.handleConnect());
        }

        // Gestion du clavier
        document.addEventListener('keydown', (e) => {
            if (e.key === 'F3' || e.key === 'Escape' || e.key === 'F12') {
                e.preventDefault();
                this.goBack();
            }
        });

        // Menu principal
        const mainMenuInput = document.getElementById('main-menu-input');
        if (mainMenuInput) {
            mainMenuInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.handleMainMenuChoice(mainMenuInput.value);
                    mainMenuInput.value = '';
                }
            });
        }

        // Menu comptabilité
        const accountingMenuInput = document.getElementById('accounting-menu-input');
        if (accountingMenuInput) {
            accountingMenuInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.handleAccountingMenuChoice(accountingMenuInput.value);
                    accountingMenuInput.value = '';
                }
            });
        }

        // Menu écritures
        const entriesMenuInput = document.getElementById('entries-menu-input');
        if (entriesMenuInput) {
            entriesMenuInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.handleEntriesMenuChoice(entriesMenuInput.value);
                    entriesMenuInput.value = '';
                }
            });
        }

        // Sélection société
        this.setupCompanySelection();

        // Options de menu cliquables
        this.setupMenuOptions();

        // Formulaire de saisie d'écriture
        this.setupEntryForm();
    }

    handleConnect() {
        console.log("Connexion initiee");
        this.showScreen('system-screen');
        setTimeout(() => {
            this.showScreen('company-screen');
        }, 2000);
    }

    setupCompanySelection() {
        const companyList = document.querySelector('.company-list');
        if (companyList) {
            const companies = companyList.querySelectorAll('div');
            companies.forEach((company, index) => {
                if (index > 0) { // Skip header
                    company.addEventListener('click', () => {
                        companies.forEach(c => c.classList.remove('selected'));
                        company.classList.add('selected');
                        setTimeout(() => {
                            this.showScreen('main-menu-screen');
                        }, 500);
                    });
                }
            });
        }
    }

    setupMenuOptions() {
        // Menu principal
        const mainMenuOptions = document.querySelector('#main-menu-screen .menu-options');
        if (mainMenuOptions) {
            const options = mainMenuOptions.querySelectorAll('div');
            options.forEach((option, index) => {
                option.addEventListener('click', () => {
                    this.handleMainMenuChoice((index + 1).toString());
                });
            });
        }

        // Menu comptabilité
        const accountingMenuOptions = document.querySelector('#accounting-menu-screen .menu-options');
        if (accountingMenuOptions) {
            const options = accountingMenuOptions.querySelectorAll('div');
            options.forEach((option, index) => {
                option.addEventListener('click', () => {
                    this.handleAccountingMenuChoice((index + 1).toString());
                });
            });
        }

        // Menu écritures
        const entriesMenuOptions = document.querySelector('#entries-screen .menu-options');
        if (entriesMenuOptions) {
            const options = entriesMenuOptions.querySelectorAll('div');
            options.forEach((option, index) => {
                option.addEventListener('click', () => {
                    this.handleEntriesMenuChoice((index + 1).toString());
                });
            });
        }
    }

    setupEntryForm() {
        // Navigation depuis l'écran de saisie d'écriture
        const entryFormInputs = document.querySelectorAll('#entry-input-screen input');
        entryFormInputs.forEach(input => {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    const codeDocument = document.getElementById('code-document');
                    if (codeDocument && codeDocument.value.trim()) {
                        this.showScreen('entry-detail-screen');
                    } else {
                        this.showMessage('Veuillez saisir au moins le code document');
                    }
                }
            });
        });

        // Validation des champs obligatoires
        this.setupMandatoryFieldsValidation();
    }

    setupMandatoryFieldsValidation() {
        const mandatoryFields = document.querySelectorAll('.mandatory-fields input');
        
        mandatoryFields.forEach(field => {
            field.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    const nextField = this.getNextMandatoryField(field);
                    if (nextField) {
                        nextField.focus();
                    } else {
                        this.validateAllMandatoryFields();
                    }
                }
            });
        });
    }

    getNextMandatoryField(currentField) {
        const mandatoryFields = Array.from(document.querySelectorAll('.mandatory-fields input'));
        const currentIndex = mandatoryFields.indexOf(currentField);
        return mandatoryFields[currentIndex + 1] || null;
    }

    validateAllMandatoryFields() {
        const compte = document.querySelector('.mandatory-fields input[placeholder="Requis"]');
        const montant = document.querySelector('.mandatory-fields input[placeholder="0,00"]');
        const libelle = document.querySelector('.mandatory-fields input[placeholder*="Description"]');
        const date = document.querySelector('.mandatory-fields input[placeholder="JJ/MM/AA"]');

        if (compte && compte.value && montant && montant.value && libelle && libelle.value && date && date.value) {
            this.showMessage('Ecriture validee - Tous les champs sont remplis');
            this.saveAccountingEntry();
        } else {
            this.showMessage('Veuillez remplir tous les champs obligatoires');
        }
    }

    saveAccountingEntry() {
        const entryData = {
            compte: document.querySelector('.mandatory-fields input[placeholder="Requis"]').value,
            montant: document.querySelector('.mandatory-fields input[placeholder="0,00"]').value,
            libelle: document.querySelector('.mandatory-fields input[placeholder*="Description"]').value,
            date: document.querySelector('.mandatory-fields input[placeholder="JJ/MM/AA"]').value,
            timestamp: new Date().toISOString()
        };

        const entries = JSON.parse(localStorage.getItem('as400_accounting_entries') || '[]');
        entries.push(entryData);
        localStorage.setItem('as400_accounting_entries', JSON.stringify(entries));

        this.showMessage('Ecriture comptable sauvegardee avec succes');
        
        setTimeout(() => {
            document.querySelectorAll('.mandatory-fields input').forEach(input => {
                input.value = '';
            });
        }, 1500);
    }

    handleMainMenuChoice(choice) {
        switch(choice) {
            case '1':
                this.showScreen('accounting-menu-screen');
                break;
            case '2':
                this.showMessage('Menu Securite - Non implemente');
                break;
            case '3':
                this.showScreen('company-screen');
                break;
            case '4':
                this.showMessage('Session terminee');
                setTimeout(() => {
                    this.showScreen('auth-screen');
                }, 1500);
                break;
            default:
                this.showMessage('Option invalide');
        }
    }

    handleAccountingMenuChoice(choice) {
        switch(choice) {
            case '1':
                this.showMessage('Comptes - Non implemente');
                break;
            case '2':
                this.showMessage('Journaux - Non implemente');
                break;
            case '3':
                this.showScreen('entries-screen');
                break;
            case '4':
                this.showMessage('Editions - Non implemente');
                break;
            case '5':
                this.showMessage('Parametres - Non implemente');
                break;
            case '6':
                this.showMessage('Traitements fin exercice - Non implemente');
                break;
            default:
                this.showMessage('Option invalide');
        }
    }

    handleEntriesMenuChoice(choice) {
        switch(choice) {
            case '1':
                this.showMessage('Gestion des Brouillards - Non implemente');
                break;
            case '2':
                this.showMessage('Parametrage des masques - Non implemente');
                break;
            case '3':
                this.showScreen('entry-input-screen');
                break;
            default:
                if (parseInt(choice) >= 4 && parseInt(choice) <= 13) {
                    this.showMessage('Integration ' + choice + ' - Non implemente');
                } else {
                    this.showMessage('Option invalide');
                }
        }
    }

    showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });

        const screen = document.getElementById(screenId);
        if (screen) {
            screen.classList.add('active');
            this.currentScreen = screenId;
            
            const firstInput = screen.querySelector('input[type="text"]');
            if (firstInput) {
                setTimeout(() => firstInput.focus(), 100);
            }
        }
    }

    goBack() {
        switch(this.currentScreen) {
            case 'system-screen':
                this.showScreen('auth-screen');
                break;
            case 'company-screen':
                this.showScreen('system-screen');
                break;
            case 'main-menu-screen':
                this.showScreen('company-screen');
                break;
            case 'accounting-menu-screen':
                this.showScreen('main-menu-screen');
                break;
            case 'entries-screen':
                this.showScreen('accounting-menu-screen');
                break;
            case 'entry-input-screen':
                this.showScreen('entries-screen');
                break;
            case 'entry-detail-screen':
                this.showScreen('entry-input-screen');
                break;
            default:
                this.showScreen('main-menu-screen');
        }
    }

    showMessage(message) {
        const messageDiv = document.createElement('div');
        messageDiv.style.position = 'fixed';
        messageDiv.style.top = '50%';
        messageDiv.style.left = '50%';
        messageDiv.style.transform = 'translate(-50%, -50%)';
        messageDiv.style.backgroundColor = '#333';
        messageDiv.style.color = '#ffff00';
        messageDiv.style.padding = '20px';
        messageDiv.style.border = '2px solid #00ff00';
        messageDiv.style.fontFamily = 'Courier New, monospace';
        messageDiv.style.zIndex = '1000';
        messageDiv.textContent = message;

        document.body.appendChild(messageDiv);

        setTimeout(() => {
            document.body.removeChild(messageDiv);
        }, 2000);
    }

    updateTime() {
        const now = new Date();
        const timeString = now.toLocaleTimeString('fr-FR', { 
            hour: '2-digit', 
            minute: '2-digit', 
            second: '2-digit' 
        });
        const dateString = now.toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: '2-digit'
        });

        document.querySelectorAll('.header .right').forEach(element => {
            if (element.textContent.includes(':')) {
                element.textContent = timeString;
            } else if (element.textContent.includes('/')) {
                element.textContent = dateString;
            }
        });
    }
}

// Initialisation de l'application
document.addEventListener('DOMContentLoaded', () => {
    window.as400App = new AS400App();
});