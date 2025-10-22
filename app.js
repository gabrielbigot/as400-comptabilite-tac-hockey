// Application AS/400 - Logique de navigation et fonctionnalités
class AS400App {
    constructor() {
        this.currentScreen = 'auth-screen';
        this.navigationPath = []; // Chemin de navigation pour le fil d'Ariane
        this.screenHistory = []; // Historique pour la fonction "retour"
        this.selectedCompany = null; // Société sélectionnée
        this.entryBatch = []; // Lot d'écritures temporaires
        this.currentJournal = null; // Journal actuellement sélectionné (id et name)
        this.allAccounts = []; // Cache pour tous les comptes
        this.currentEditingBatchId = null; // Pour suivre le lot en cours de modification
        this.currentlyEditingLineIndex = null; // Pour suivre la ligne en cours de modification dans un lot
        this.refreshCallback = null; // Pour rafraîchir la vue après une modification
        this.displayedEntries = []; // Pour stocker les écritures actuellement affichées
        this.init();
    }

    init() {
        console.log("app.js loaded");
console.log("Initializing AS400App");
        this.setupEventListeners();
        this.updateTime();
        setInterval(() => this.updateTime(), 1000);
        this.loadAllAccounts(); // Load all accounts on app initialization

        // Vérifier la session Supabase au démarrage
        supabase.auth.getSession().then(({ data: { session } }) => {
            console.log("Supabase session check completed.");
            if (session) {
                console.log("Session found. Showing company-screen.");
                this.showScreen('company-screen', ['AS400 beta 2', 'Choix Société']);
            } else {
                console.log("No session found. Showing auth-screen.");
                this.showScreen('auth-screen', ['AS400 beta 2', 'Authentification']);
            }
        });
    }

    setupEventListeners() {
        console.log("Setting up event listeners");

        // Authentification
        const signinBtn = document.getElementById('auth-signin');
        if (signinBtn) {
            signinBtn.addEventListener('click', () => this.handleAuth('signin'));
        }

        const signupBtn = document.getElementById('auth-signup');
        if (signupBtn) {
            signupBtn.addEventListener('click', () => this.handleAuth('signup'));
        }

        // Gestion du clavier pour tous les écrans
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));

        // Menu principal
        const mainMenuInput = document.getElementById('main-menu-input');
        if (mainMenuInput) {
            mainMenuInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.handleMainMenuChoice(mainMenuInput.value);
            });
        }

        // Menu comptabilité
        const accountingMenuInput = document.getElementById('accounting-menu-input');
        if (accountingMenuInput) {
            accountingMenuInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.handleAccountingMenuChoice(accountingMenuInput.value);
            });
        }

        // Menu écritures
        const entriesMenuInput = document.getElementById('entries-menu-input');
        if (entriesMenuInput) {
            entriesMenuInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.handleEntriesMenuChoice(entriesMenuInput.value);
            });
        }

        // Invite de commande des comptes
        const accountsCommandInput = document.getElementById('accounts-command-input');
        if (accountsCommandInput) {
            accountsCommandInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.handleAccountCommand(accountsCommandInput.value);
            });
        }

        // Invite de commande des journaux
        const journalsCommandInput = document.getElementById('journals-command-input');
        if (journalsCommandInput) {
            journalsCommandInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.handleJournalCommand(journalsCommandInput.value);
            });
        }

        // Écouteurs pour les boutons de tri
        document.getElementById('account-sort-asc').addEventListener('click', () => this.handleSort('account', 'asc'));
        document.getElementById('account-sort-desc').addEventListener('click', () => this.handleSort('account', 'desc'));
        document.getElementById('journal-sort-asc').addEventListener('click', () => this.handleSort('journal', 'asc'));
        document.getElementById('journal-sort-desc').addEventListener('click', () => this.handleSort('journal', 'desc'));

        // Écouteurs pour les boutons d'impression
        document.getElementById('print-account-btn').addEventListener('click', () => this.handlePrint('account'));
        document.getElementById('print-journal-btn').addEventListener('click', () => this.handlePrint('journal'));
        
        // Formulaire de saisie d'écriture
        this.setupEntryForm();

        // Bouton d'ajout de société
        const addCompanyBtn = document.getElementById('add-company-btn');
        if (addCompanyBtn) {
            addCompanyBtn.addEventListener('click', () => this.addCompany());
        }

        // Bouton d'ajout de ligne d'écriture
        const addEntryLineBtn = document.getElementById('add-entry-line-btn');
        if (addEntryLineBtn) {
            addEntryLineBtn.addEventListener('click', () => this.addEntryLine());
        }

        // Bouton de validation du lot
        const validateBatchBtn = document.getElementById('validate-batch-btn');
        if (validateBatchBtn) {
            validateBatchBtn.addEventListener('click', () => this.validateBatch());
        }

        // Bouton d'ajout de journal
        const addJournalBtn = document.getElementById('add-journal-btn');
        if (addJournalBtn) {
            console.log('Add journal button found, adding listener');
            addJournalBtn.addEventListener('click', () => this.addJournal());
        }

        // Bouton d'ajout de compte
        const addAccountBtn = document.getElementById('add-account-btn');
        if (addAccountBtn) {
            console.log('Add account button found, adding listener');
            addAccountBtn.addEventListener('click', () => this.addAccount());
        }

        // Account lookup modal event listeners
        const accountLookupModal = document.getElementById('account-lookup-modal');
        if (accountLookupModal) {
            const closeButton = accountLookupModal.querySelector('.close-button');
            if (closeButton) {
                closeButton.addEventListener('click', () => this.hideAccountLookupModal());
            }
            accountLookupModal.addEventListener('click', (e) => {
                if (e.target === accountLookupModal) {
                    this.hideAccountLookupModal();
                }
            });
        }

        const mfCompteInput = document.getElementById('mf-compte');
        if (mfCompteInput) {
            mfCompteInput.addEventListener('input', (e) => this.handleAccountInput(e.target.value));
        }

        // Batch listing filters
        const batchFilterBtn = document.getElementById('batch-filter-btn');
        if (batchFilterBtn) {
            batchFilterBtn.addEventListener('click', () => this.loadBatchesList());
        }

        const batchResetFilterBtn = document.getElementById('batch-reset-filter-btn');
        if (batchResetFilterBtn) {
            batchResetFilterBtn.addEventListener('click', () => this.resetBatchFilters());
        }
    }

    async loadAllAccounts() {
        try {
            const { data: accounts, error } = await supabase
                .from('accounts')
                .select('account_number, label')
                .order('account_number', { ascending: true });

            if (error) throw error;
            this.allAccounts = accounts;
            console.log('Accounts loaded:', this.allAccounts);
        } catch (error) {
            console.error('Error loading accounts:', error.message);
            this.showMessage(`Erreur de chargement des comptes: ${error.message}`);
        }
    }

    handleAccountInput(inputValue) {
        const trimmedInput = inputValue.trim();
        if (trimmedInput.length > 0) {
            this.showAccountLookupModal(trimmedInput);
        } else {
            this.hideAccountLookupModal();
        }
    }

    showAccountLookupModal(filterText = '') {
        const modal = document.getElementById('account-lookup-modal');
        const accountList = document.getElementById('account-lookup-list');
        accountList.innerHTML = '';

        const filteredAccounts = this.allAccounts.filter(account =>
            account.account_number.startsWith(filterText)
        );

        if (filteredAccounts.length === 0 && filterText.length > 0) {
            // If no match, show all accounts
            this.allAccounts.forEach(account => {
                const row = document.createElement('div');
                row.className = 'table-row';
                row.innerHTML = `<span style="display: inline-block; width: 15ch;">${account.account_number}</span><span>${account.label}</span>`;
                row.addEventListener('click', () => this.selectAccount(account.account_number));
                accountList.appendChild(row);
            });
        } else {
            filteredAccounts.forEach(account => {
                const row = document.createElement('div');
                row.className = 'table-row';
                row.innerHTML = `<span style="display: inline-block; width: 15ch;">${account.account_number}</span><span>${account.label}</span>`;
                row.addEventListener('click', () => this.selectAccount(account.account_number));
                accountList.appendChild(row);
            });
        }

        modal.style.display = 'block';
    }

    hideAccountLookupModal() {
        const modal = document.getElementById('account-lookup-modal');
        modal.style.display = 'none';
    }

    selectAccount(accountNumber) {
        document.getElementById('mf-compte').value = accountNumber;
        this.hideAccountLookupModal();
    }

    updateNavbar() {
        const breadcrumbElements = document.querySelectorAll('.breadcrumb');
        const pathHtml = this.navigationPath
            .map(item => `<span class="path-item">${item}</span>`)
            .join('<span class="path-separator"> / </span>');
        breadcrumbElements.forEach(el => el.innerHTML = pathHtml);
    }

    updateTime() {
        const now = new Date();
        const timeString = now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        const dateString = now.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: '2-digit' });
        document.querySelectorAll('.datetime .time').forEach(el => el.textContent = timeString);
        document.querySelectorAll('.datetime .date').forEach(el => el.textContent = dateString);
    }

    async handleAuth(type) {
        console.log(`Handling auth for type: ${type}`);
        const email = document.getElementById('auth-email').value;
        const password = document.getElementById('auth-password').value;
        if (!email || !password) {
            this.showMessage('Veuillez saisir un email et un mot de passe.');
            return;
        }
        this.showMessage('Authentification en cours...');
        try {
            const { data, error } = type === 'signup'
                ? await supabase.auth.signUp({ email, password })
                : await supabase.auth.signInWithPassword({ email, password });

            if (error) throw error;
            if (data.user) {
                this.showMessage(`Connexion réussie pour ${data.user.email}`);
                this.showScreen('company-screen', ['AS400 beta 2', 'Choix Société']);
            }
        } catch (err) {
            this.showMessage(`Erreur d'authentification: ${err.message}`);
        }
    }

    async signOut() {
        await supabase.auth.signOut();
        this.showMessage('Déconnexion réussie.');
        this.selectedCompany = null;
        this.showScreen('auth-screen', ['AS400 beta 2', 'Authentification']);
    }

    async loadCompanies() {
        const companyListContainer = document.getElementById('company-list-container');
        companyListContainer.innerHTML = ''; // Vider la liste

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        try {
            const { data: companies, error } = await supabase
                .from('companies')
                .select('id, name')
                .eq('user_id', user.id)

            if (error) throw error;

            companies.forEach(company => {
                const div = document.createElement('div');
                div.innerHTML = `<button class="delete-company-btn" data-company-id="${company.id}" data-company-name="${company.name}" style="margin-right: 5px; background-color: #550000; color: white; border: 1px solid red;">X</button><input type="text" class="company-choice" maxlength="1" data-company-id="${company.id}" data-company-name="${company.name}">&nbsp;&nbsp;&nbsp;${company.name}`;

                const input = div.querySelector('.company-choice');
                input.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        this.handleCompanyChoice(e.target);
                    }
                });

                const deleteBtn = div.querySelector('.delete-company-btn');
                deleteBtn.addEventListener('click', (e) => {
                    const companyId = e.target.dataset.companyId;
                    const companyName = e.target.dataset.companyName;
                    this.deleteCompany(companyId, companyName);
                });

                companyListContainer.appendChild(div);
            });
        } catch (error) {
            this.showMessage(`Erreur de chargement des sociétés: ${error.message}`);
        }
    }

    async addCompany() {
        const newCompanyName = document.getElementById('new-company-name').value;
        if (!newCompanyName) {
            this.showMessage('Veuillez saisir un nom pour la nouvelle société.');
            return;
        }

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        try {
            const { error } = await supabase.from('companies').insert([{ name: newCompanyName, user_id: user.id }]);
            if (error) throw error;
            this.showMessage('Société ajoutée avec succès !');
            document.getElementById('new-company-name').value = '';
            this.loadCompanies();
        } catch (error) {
            this.showMessage(`Erreur lors de l'ajout de la société: ${error.message}`);
        }
    }

    async deleteCompany(companyId, companyName) {
        const confirmation = confirm(`Êtes-vous sûr de vouloir supprimer la société "${companyName}" et toutes ses écritures associées ? Cette action est irréversible.`);
        if (!confirmation) return;

        try {
            const { error } = await supabase.from('companies').delete().eq('id', companyId);
            if (error) throw error;
            this.showMessage('Société supprimée avec succès !');
            this.loadCompanies();
        } catch (error) {
            this.showMessage(`Erreur lors de la suppression de la société: ${error.message}`);
        }
    }

    handleCompanyChoice(inputElement) {
        if (inputElement.value) {
            this.selectedCompany = {
                id: inputElement.dataset.companyId,
                name: inputElement.dataset.companyName
            };
            this.showScreen('main-menu-screen', ['AS400 beta 2', this.selectedCompany.name, 'Menu Général']);
        } else {
            this.showMessage('Option invalide');
        }
    }

    handleMainMenuChoice(choice) {
        const basePath = ['AS400 beta 2', this.selectedCompany.name];
        switch (choice) {
            case '1':
                this.showScreen('accounting-menu-screen', [...basePath, 'Menu Comptabilité']);
                break;
            case '3':
                this.showScreen('company-screen', ['AS400 beta 2', 'Choix Société']);
                break;
            case '4':
                this.signOut();
                break;
            default:
                this.showMessage('Option invalide');
        }
    }

    handleAccountingMenuChoice(choice) {
        const basePath = ['AS400 beta 2', this.selectedCompany.name, 'Menu Comptabilité'];
        switch (choice) {
            case '1':
                this.showScreen('accounts-screen', [...basePath, 'Comptes']);
                break;
            case '2':
                this.showScreen('journals-screen', [...basePath, 'Journaux']);
                break;
            case '3':
                this.showScreen('entries-screen', [...basePath, 'Écritures']);
                break;
            default:
                this.showMessage('Option invalide');
        }
    }

    handleEntriesMenuChoice(choice) {
        const basePath = ['AS400 beta 2', this.selectedCompany.name, 'Menu Comptabilité', 'Écritures'];
        if (choice === '3') {
            this.showScreen('entry-input-screen', [...basePath, 'Saisie d\'écriture']);
        } else if (choice === '4') {
            this.showScreen('batches-screen', [...basePath, 'Liste des lots']);
        } else {
            this.showMessage('Option invalide');
        }
    }

    handleAccountCommand(accountNumber) {
        this.showScreen('account-detail-screen', [...this.navigationPath, accountNumber]);
        const accountStartDateInput = document.getElementById('account-start-date');
        accountStartDateInput.value = '';
        accountStartDateInput.onchange = () => this.loadAccountEntries(accountNumber, accountStartDateInput.value);
        this.loadAccountEntries(accountNumber);
    }

    async handleJournalCommand(journalCode) {
        const trimmedCode = journalCode.trim().toUpperCase();
        if (!trimmedCode) {
            this.showMessage('Veuillez saisir un code de journal.');
            return;
        }

        try {
            const { data: journals, error } = await supabase
                .from('journals')
                .select('id, name')
                .eq('company_id', this.selectedCompany.id)
                .eq('code', trimmedCode);

            if (error) throw error;

            if (journals.length > 0) {
                const journal = journals[0];
                this.handleJournalClick(journal.id, journal.name);
            } else {
                this.showMessage(`Journal avec le code '${trimmedCode}' non trouvé.`);
            }
        } catch (error) {
            this.showMessage(`Erreur lors de la recherche du journal: ${error.message}`);
        }
    }

    setupEntryForm() {
        const journalCodeInput = document.getElementById('journal-code-input');

        if (journalCodeInput) {
            const handler = async (e) => {
                if (e.key === 'Enter') {
                    const journalCode = journalCodeInput.value.trim().toUpperCase();
                    if (!journalCode) {
                        this.showMessage('Veuillez saisir un code de journal.');
                        return;
                    }

                    try {
                        this.showMessage('Vérification du journal...');
                        const { data: journal, error } = await supabase
                            .from('journals')
                            .select('id, name')
                            .eq('company_id', this.selectedCompany.id)
                            .eq('code', journalCode)
                            .single();

                        if (error) {
                            if (error.code === 'PGRST116') throw new Error(`Journal '${journalCode}' non trouvé.`);
                            throw error;
                        }

                        // Réinitialiser l'état pour un nouveau lot
                        this.currentJournal = journal;
                        this.entryBatch = [];
                        this.currentEditingBatchId = null;
                        this.currentlyEditingLineIndex = null;

                        const basePath = this.navigationPath;
                        this.showScreen('entry-detail-screen', [...basePath, 'Détail']);

                    } catch (error) {
                        this.showMessage(`Erreur: ${error.message}`);
                        this.currentJournal = null;
                    }
                }
            };
            journalCodeInput.addEventListener('keypress', handler);
        }
    }

    showScreen(screenId, newPath, isGoingBack = false) {
        console.log(`Showing screen: ${screenId}`);
        document.querySelectorAll('.screen').forEach(screen => screen.classList.remove('active'));
        const screen = document.getElementById(screenId);
        if (screen) {
            if (!isGoingBack && this.currentScreen && this.currentScreen !== screenId) {
                this.screenHistory.push({ screen: this.currentScreen, path: this.navigationPath });
            }
            this.currentScreen = screenId;
            if (newPath) {
                this.navigationPath = newPath;
            }
            screen.classList.add('active');
            this.updateNavbar();

            // Actions spécifiques
            if (screenId === 'company-screen') this.loadCompanies();
            if (screenId === 'entry-detail-screen') this.initializeEntryDetailScreen(screen);
            if (screenId === 'accounts-screen') this.updateAccountsTable();
            if (screenId === 'journals-screen') this.updateJournalsTable();
            if (screenId === 'batches-screen') {
                this.loadJournalsForBatchFilter();
                this.loadBatchesList();
            }
            if (screenId === 'entry-input-screen') {
                document.getElementById('date-comptable').value = '';
                document.getElementById('journal-code-input').value = '';
                this.loadJournalsForEntryInput();
                const journalCodeInput = document.getElementById('journal-code-input');
                if (journalCodeInput) setTimeout(() => journalCodeInput.focus(), 100);
            } else if (screenId === 'accounts-screen') {
                const accountsCommandInput = document.getElementById('accounts-command-input');
                if (accountsCommandInput) setTimeout(() => accountsCommandInput.focus(), 100);
            } else if (screenId === 'journals-screen') {
                const journalsCommandInput = document.getElementById('journals-command-input');
                if (journalsCommandInput) setTimeout(() => journalsCommandInput.focus(), 100);
            } else {
                const firstInput = screen.querySelector('input[type="text"]');
                if (firstInput) setTimeout(() => firstInput.focus(), 100);
            }
        }
    }

    goBack() {
        const lastState = this.screenHistory.pop();
        if (lastState) {
            this.showScreen(lastState.screen, lastState.path, true);
        }
    }
    
    handleKeyPress(e) {
        if (e.key === 'F3' || e.key === 'Escape' || e.key === 'F12') {
            e.preventDefault();
            this.goBack();
        }
    }

    async loadJournalsForEntryInput() {
        const journalListDiv = document.getElementById('journal-selection-list');
        if (!journalListDiv) return;

        journalListDiv.innerHTML = '<p>Chargement des journaux...</p>';

        try {
            const { data: journals, error } = await supabase
                .from('journals')
                .select('code, name')
                .eq('company_id', this.selectedCompany.id)
                .order('code', { ascending: true });

            if (error) throw error;

            if (journals.length === 0) {
                journalListDiv.innerHTML = '<p>Aucun journal trouvé pour cette société.</p>';
                return;
            }

            let listHtml = '<ul>';
            journals.forEach(j => {
                listHtml += `<li><b>${j.code}</b>: ${j.name}</li>`;
            });
            listHtml += '</ul>';
            journalListDiv.innerHTML = listHtml;

        } catch (error) {
            journalListDiv.innerHTML = `<p style="color: red;">Erreur: ${error.message}</p>`;
        }
    }

    initializeEntryDetailScreen(screenElement) {
        const accountingDate = document.getElementById('date-comptable').value;
        const mandatoryDateField = document.getElementById('mf-date');
        if (accountingDate) {
            mandatoryDateField.value = accountingDate;
        }

        const journalDisplay = document.getElementById('current-journal-display');
        if (this.currentJournal && this.currentJournal.id && journalDisplay) {
            journalDisplay.textContent = `Journal: ${this.currentJournal.name}`;
            screenElement.dataset.journalId = this.currentJournal.id;
            console.log(`[initializeEntryDetailScreen] Stored journalId: ${screenElement.dataset.journalId}`); // DEBUG
        } else if (journalDisplay) {
            journalDisplay.textContent = 'Journal: Non défini';
            screenElement.dataset.journalId = '';
            console.warn('[initializeEntryDetailScreen] Journal not set or invalid.', this.currentJournal); // DEBUG
        }

        // Ensure buttons are visible (may have been hidden in view mode)
        const validateBatchBtn = document.getElementById('validate-batch-btn');
        if (validateBatchBtn) {
            validateBatchBtn.style.display = 'inline-block';
        }
        const addLineBtn = document.getElementById('add-entry-line-btn');
        if (addLineBtn) {
            addLineBtn.style.display = 'inline-block';
        }

        this.updateEntriesTable(this.entryBatch);
    }

    // ... (les autres fonctions comme saveAccountingEntry, updateEntriesTable, etc., restent ici)
    addEntryLine() {
        const entryData = {
            compte: document.getElementById('mf-compte').value,
            s: document.getElementById('mf-s').value,
            montant: parseFloat(document.getElementById('mf-montant').value.replace(',', '.')) || 0,
            libelle: document.getElementById('mf-libelle').value,
            date: this.formatDateForSave(document.getElementById('mf-date').value),
        };

        if (!entryData.compte || !entryData.s || !entryData.montant || !entryData.libelle || !entryData.date) {
            this.showMessage('Veuillez remplir tous les champs obligatoires.');
            return;
        }

        // Validate account number
        const accountExists = this.allAccounts.some(account => account.account_number === entryData.compte);
        if (!accountExists) {
            this.showMessage('Numéro de compte invalide. Veuillez sélectionner un compte existant.');
            this.showAccountLookupModal(entryData.compte); // Show modal with current invalid input
            return;
        }

        // Si nous modifions une ligne existante
        if (this.currentlyEditingLineIndex !== null) {
            this.entryBatch[this.currentlyEditingLineIndex] = entryData;
            this.currentlyEditingLineIndex = null; // Réinitialiser l'index
            document.getElementById('add-entry-line-btn').textContent = 'Ajouter la ligne'; // Rétablir le texte du bouton
        } else {
            this.entryBatch.push(entryData);
        }

        this.updateEntriesTable(this.entryBatch);
        document.querySelectorAll('.mandatory-fields input').forEach(input => input.value = '');
        document.getElementById('mf-compte').focus();
    }

    async validateBatch() {
        const totalDebit = this.entryBatch.reduce((sum, entry) => entry.s.toUpperCase() !== 'C' ? sum + entry.montant : sum, 0);
        const totalCredit = this.entryBatch.reduce((sum, entry) => entry.s.toUpperCase() === 'C' ? sum + entry.montant : sum, 0);

        if (Math.abs(totalDebit - totalCredit) > 0.001) { // Utiliser une tolérance pour les flottants
            this.showMessage('Le total des débits doit être égal au total des crédits.');
            return;
        }

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            this.showMessage('Veuillez vous connecter pour sauvegarder une écriture.');
            return;
        }

        if (!this.selectedCompany) {
            this.showMessage('Veuillez sélectionner une société avant de saisir une écriture.');
            return;
        }

        const entryDetailScreen = document.getElementById('entry-detail-screen');
        const journalId = entryDetailScreen.dataset.journalId;
        
        const validateBatchBtn = document.getElementById('validate-batch-btn');
        const editingBatchId = validateBatchBtn ? validateBatchBtn.dataset.batchId : null; // Lire l'ID du lot depuis le bouton

        console.log(`[validateBatch] Read journalId from screen dataset: ${journalId}`); // DEBUG
        console.log(`[validateBatch] Read editingBatchId from validate-batch-btn: ${editingBatchId}`); // DEBUG

        if (!journalId || !/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(journalId)) {
            this.showMessage('Erreur: Le journal n\'est pas correctement défini. Veuillez recommencer la saisie.');
            console.error('validateBatch error: journalId is invalid or missing from screen dataset.', journalId);
            return;
        }

        try {
            // Si nous sommes en mode modification
            if (editingBatchId) {
                console.log(`Modification mode: Attempting to delete entries with batch_id: ${editingBatchId}`);
                // 1. Supprimer les anciennes écritures du lot
                const { error: deleteError } = await supabase.from('journal_entries').delete().eq('batch_id', editingBatchId);
                if (deleteError) {
                    console.error('Error deleting old batch:', deleteError);
                    throw deleteError;
                }
                console.log(`Successfully deleted entries for batch ID: ${editingBatchId}`);
            } else {
                console.log('Not in modification mode. Creating a new batch.');
            }

            const batchId = editingBatchId || crypto.randomUUID();
            const entriesToSave = this.entryBatch.map(entry => ({
                compte: entry.compte,
                s: entry.s,
                montant: entry.montant,
                libelle: entry.libelle,
                date: entry.date,
                user_id: user.id,
                company_id: this.selectedCompany.id,
                journal_id: journalId,
                batch_id: batchId
            }));

            if (entriesToSave.length > 0) {
                const { error: insertError } = await supabase.from('journal_entries').insert(entriesToSave);
                if (insertError) throw insertError;
            }

            this.showMessage("Lot d'écritures sauvegardé avec succès !");
            this.entryBatch = [];
            // Réinitialiser le batchId sur le bouton après la sauvegarde
            if (validateBatchBtn) {
                delete validateBatchBtn.dataset.batchId;
                console.log('[validateBatch] Cleared batchId from validate-batch-btn.');
            }
            this.currentEditingBatchId = null;
            this.currentlyEditingLineIndex = null;
            document.getElementById('add-entry-line-btn').textContent = 'Ajouter la ligne';
            this.updateEntriesTable(this.entryBatch);
            if (this.refreshCallback) {
                this.refreshCallback();
                this.refreshCallback = null; // Utiliser une seule fois
            }
            // Optionnel: revenir à l'écran précédent après la sauvegarde
            this.goBack();

        } catch (error) {
            console.error('Error in validateBatch:', error);
            this.showMessage(`Erreur lors de la sauvegarde: ${error.message}`);
        }
    }

    

    async updateEntriesTable(entries = null) {
        const tableContent = document.querySelector('#entry-detail-screen .table-content');
        if (!entries) {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) {
                    tableContent.innerHTML = '<span class="no-data">(Veuillez vous connecter)</span>';
                    return;
                }

                if (!this.selectedCompany) {
                    tableContent.innerHTML = '<span class="no-data">(Veuillez sélectionner une société)</span>';
                    return;
                }

                const { data: fetchedEntries, error } = await supabase
                    .from('journal_entries')
                    .select('*')
                    .eq('user_id', user.id)
                    .eq('company_id', this.selectedCompany.id)
                    .order('created_at', { ascending: false });

                if (error) throw error;
                entries = fetchedEntries;
            } catch (error) {
                this.showMessage(`Erreur de chargement des écritures: ${error.message}`);
                return;
            }
        }

        tableContent.innerHTML = ''; // Clear existing content

        if (entries) {
            const headerRow = document.createElement('div');
            headerRow.className = 'table-row header-row';
            headerRow.style.fontWeight = 'bold';
            headerRow.style.borderBottom = '1px solid #00FF00';
            headerRow.innerHTML = `
                <span style="display: inline-block; width: 4ch; text-align: left;">Lgn</span>
                <span style="display: inline-block; width: 10ch; text-align: left;">Date</span>
                <span style="display: inline-block; width: 10ch; text-align: left;">Compte</span>
                <span style="display: inline-block; width: 25ch; text-align: left;">Libellé</span>
                <span style="display: inline-block; width: 12ch; text-align: right;">Débit</span>
                <span style="display: inline-block; width: 12ch; text-align: right;">Crédit</span>
            `;
            tableContent.appendChild(headerRow);
        }

        if (entries.length === 0) {
            tableContent.innerHTML += '<span class="no-data" style="padding-top: 10px;">(Aucun élément à afficher)</span>';
            return;
        }

        let totalDebit = 0;
        let totalCredit = 0;

        entries.forEach((entry, index) => {
            const isDebit = entry.s.toUpperCase() !== 'C';
            const amount = parseFloat(entry.montant) || 0;
            const debit = isDebit ? this.formatAmount(amount) : '';
            const credit = !isDebit ? this.formatAmount(amount) : '';

            if (isDebit) totalDebit += amount;
            else totalCredit += amount;

            const row = document.createElement('div');
            row.className = 'table-row';
            row.innerHTML = `
                <span style="display: inline-block; width: 4ch; text-align: left;">${index + 1}</span>
                <span style="display: inline-block; width: 10ch; text-align: left;">${this.formatDateForDisplay(entry.date)}</span>
                <span style="display: inline-block; width: 10ch; text-align: left;">${entry.compte}</span>
                <span style="display: inline-block; width: 25ch; text-align: left;">${entry.libelle}</span>
                <span style="display: inline-block; width: 12ch; text-align: right;">${debit}</span>
                <span style="display: inline-block; width: 12ch; text-align: right;">${credit}</span>
            `;
            row.addEventListener('click', () => this.editEntryLine(index));
            tableContent.appendChild(row);
        });

        const totalsLine = document.querySelector('#entry-detail-screen .totals-line');
        const balance = totalDebit - totalCredit;
        const spaceBeforeTotals = '49ch'; // Corresponds to Lgn, Date, Compte, Libellé columns

        totalsLine.innerHTML = `
            <span style="display: inline-block; width: ${spaceBeforeTotals};">Solde ${this.formatAmount(balance)}</span>
            <span style="display: inline-block; width: 12ch; text-align: right;">${this.formatAmount(totalDebit)}</span>
            <span style="display: inline-block; width: 12ch; text-align: right;">${this.formatAmount(totalCredit)}</span>
        `;
    }
    
    formatAmount(amount) {
        return new Intl.NumberFormat('fr-FR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(amount);
    }

    formatDateForSave(dateString) {
        // Converts DD/MM/YY to DD/MM/YYYY for saving
        const parts = dateString.split('/');
        if (parts.length === 3) {
            let year = parseInt(parts[2], 10);
            if (year < 100) {
                year = (year < (new Date().getFullYear() % 100) + 10) ? 2000 + year : 1900 + year;
            }
            return `${parts[0]}/${parts[1]}/${year}`;
        }
        return dateString; // Return as is if not in expected format
    }

    formatDateForDisplay(dateString) {
        // Converts DD/MM/YY (from DB) to DD/MM/YYYY for display
        const parts = dateString.split('/');
        if (parts.length === 3) {
            let year = parseInt(parts[2], 10);
            if (year < 100) {
                year = (year < (new Date().getFullYear() % 100) + 10) ? 2000 + year : 1900 + year;
            }
            return `${parts[0]}/${parts[1]}/${year}`;
        }
        return dateString; // Return as is if not in expected format
    }

    editEntryLine(index) {
        if (this.currentEditingBatchId === null) {
            this.showMessage("Vous ne pouvez modifier les lignes qu'en mode modification de lot.");
            return;
        }

        const entry = this.entryBatch[index];
        if (!entry) return;

        // Remplir les champs du formulaire
        document.getElementById('mf-compte').value = entry.compte;
        document.getElementById('mf-s').value = entry.s;
        document.getElementById('mf-montant').value = entry.montant.toString().replace('.', ',');
        document.getElementById('mf-libelle').value = entry.libelle;
        document.getElementById('mf-date').value = this.formatDateForDisplay(entry.date);

        // Changer le bouton et stocker l'index
        document.getElementById('add-entry-line-btn').textContent = 'Modifier la ligne';
        this.currentlyEditingLineIndex = index;

        // Mettre le focus sur le premier champ
        document.getElementById('mf-compte').focus();
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
        setTimeout(() => document.body.removeChild(messageDiv), 2000);
    }
    
    async updateAccountsTable() {
        const tableContent = document.getElementById('accounts-table-content');
        this.showMessage('Chargement des comptes...');
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                tableContent.innerHTML = '<span class="no-data">(Veuillez vous connecter)</span>';
                return;
            }

            const { data: accounts, error } = await window.supabase
                .from('accounts')
                .select('account_number, label')
                .eq('user_id', user.id) // Filter by user_id
                .order('account_number', { ascending: true });

            if (error) throw error;

            if (accounts.length === 0) {
                tableContent.innerHTML = '<span class="no-data">(Aucun compte à afficher)</span>';
                return;
            }

            tableContent.innerHTML = '';
            accounts.forEach(account => {
                const row = document.createElement('div');
                row.className = 'table-row';
                row.innerHTML = `
                    <span style="display: inline-block; width: 10ch;">${account.account_number}</span>
                    <span style="display: inline-block; width: 30ch;">${account.label}</span>
                    <button class="action-btn modify-account-btn" data-account-number="${account.account_number}" data-account-label="${account.label}">Modifier</button>
                    <button class="action-btn delete-account-btn" data-account-number="${account.account_number}" data-account-label="${account.label}">Supprimer</button>
                `;
                tableContent.appendChild(row);
            });

            // Add event listeners for the modify and delete buttons
            tableContent.querySelectorAll('.modify-account-btn').forEach(button => {
                button.addEventListener('click', (e) => {
                    const accountNumber = e.target.dataset.accountNumber;
                    const accountLabel = e.target.dataset.accountLabel;
                    this.editAccount(accountNumber, accountLabel);
                });
            });
            tableContent.querySelectorAll('.delete-account-btn').forEach(button => {
                button.addEventListener('click', (e) => {
                    const accountNumber = e.target.dataset.accountNumber;
                    const accountLabel = e.target.dataset.accountLabel;
                    this.deleteAccount(accountNumber, accountLabel);
                });
            });
        } catch (error) {
            this.showMessage(`Erreur lors du chargement des comptes: ${error.message}`);
        }
    }

    async addAccount() {
        console.log('addAccount function called');
        const accountNumberInput = document.getElementById('new-account-number');
        const accountLabelInput = document.getElementById('new-account-label');
        const addAccountBtn = document.getElementById('add-account-btn');

        const accountNumber = accountNumberInput.value.trim();
        const accountLabel = accountLabelInput.value.trim();
        const mode = addAccountBtn.dataset.mode; // 'add' or 'edit'
        const originalAccountNumber = addAccountBtn.dataset.originalAccountNumber; // Only for edit mode

        if (!accountNumber || !accountLabel) {
            this.showMessage('Veuillez saisir un numéro et un libellé pour le compte.');
            return;
        }

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        try {
            if (mode === 'add') {
                const { error } = await supabase.from('accounts').insert([{ 
                    account_number: accountNumber, 
                    label: accountLabel, 
                    user_id: user.id 
                }]);
                if (error) throw error;
                this.showMessage('Compte ajouté avec succès !');
            } else if (mode === 'edit') {
                const { error } = await supabase.from('accounts')
                    .update({ account_number: accountNumber, label: accountLabel })
                    .eq('account_number', originalAccountNumber)
                    .eq('user_id', user.id); // Ensure user owns the account
                if (error) throw error;
                this.showMessage('Compte modifié avec succès !');
                addAccountBtn.dataset.mode = 'add'; // Reset to add mode
                addAccountBtn.textContent = 'Ajouter'; // Reset button text
                delete addAccountBtn.dataset.originalAccountNumber; // Clear original account number
            }
            
            accountNumberInput.value = '';
            accountLabelInput.value = '';
            this.loadAllAccounts(); // Refresh the cache
            this.updateAccountsTable(); // Refresh the list
        } catch (error) {
            this.showMessage(`Erreur lors de l'ajout/modification du compte: ${error.message}`);
        }
    }

    editAccount(accountNumber, accountLabel) {
        document.getElementById('new-account-number').value = accountNumber;
        document.getElementById('new-account-label').value = accountLabel;
        const addAccountBtn = document.getElementById('add-account-btn');
        addAccountBtn.textContent = 'Sauvegarder les modifications';
        addAccountBtn.dataset.mode = 'edit';
        addAccountBtn.dataset.originalAccountNumber = accountNumber; // Store original account number for update
    }

    async deleteAccount(accountNumber, accountLabel) {
        const confirmation = confirm(`Êtes-vous sûr de vouloir supprimer le compte "${accountNumber} - ${accountLabel}" ?`);
        if (!confirmation) return;

        try {
            const { error } = await supabase.from('accounts').delete().eq('account_number', accountNumber);
            if (error) throw error;
            this.showMessage('Compte supprimé avec succès !');
            this.loadAllAccounts(); // Refresh the cache
            this.updateAccountsTable(); // Refresh the list
        } catch (error) {
            this.showMessage(`Erreur lors de la suppression du compte: ${error.message}`);
        }
    }

    async updateJournalsTable() {
        const tableContent = document.getElementById('journals-table-content');
        this.showMessage('Chargement des journaux...');
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user || !this.selectedCompany) {
                tableContent.innerHTML = '<span class="no-data">(Veuillez sélectionner une société)</span>';
                return;
            }

            const { data: journals, error } = await window.supabase
                .from('journals')
                .select('id, code, name')
                .eq('company_id', this.selectedCompany.id)
                .order('code', { ascending: true });

            if (error) throw error;

            if (journals.length === 0) {
                tableContent.innerHTML = '<span class="no-data">(Aucun journal à afficher)</span>';
                return;
            }

            tableContent.innerHTML = '';
            journals.forEach(journal => {
                const row = document.createElement('div');
                row.className = 'table-row';
                row.innerHTML = `
                    <span style="display: inline-block; width: 10ch;">${journal.code}</span>
                    <span style="display: inline-block; width: 30ch;">${journal.name}</span>
                    <button class="action-btn modify-journal-btn" data-journal-id="${journal.id}" data-journal-code="${journal.code}" data-journal-name="${journal.name}">Modifier</button>
                    <button class="action-btn delete-journal-btn" data-journal-id="${journal.id}" data-journal-name="${journal.name}">Supprimer</button>
                `;
                tableContent.appendChild(row);
            });

            // Add event listeners for the modify and delete buttons
            tableContent.querySelectorAll('.modify-journal-btn').forEach(button => {
                button.addEventListener('click', (e) => {
                    const journalId = e.target.dataset.journalId;
                    const journalCode = e.target.dataset.journalCode;
                    const journalName = e.target.dataset.journalName;
                    this.editJournal(journalId, journalCode, journalName);
                });
            });
            tableContent.querySelectorAll('.delete-journal-btn').forEach(button => {
                button.addEventListener('click', (e) => {
                    const journalId = e.target.dataset.journalId;
                    const journalName = e.target.dataset.journalName;
                    this.deleteJournal(journalId, journalName);
                });
            });
        } catch (error) {
            this.showMessage(`Erreur lors du chargement des journaux: ${error.message}`);
        }
    }

    async addJournal() {
        console.log('addJournal function called');
        const newJournalCodeInput = document.getElementById('new-journal-code');
        const newJournalNameInput = document.getElementById('new-journal-name');
        const addJournalBtn = document.getElementById('add-journal-btn');

        const code = newJournalCodeInput.value.trim().toUpperCase();
        const name = newJournalNameInput.value.trim();
        const mode = addJournalBtn.dataset.mode; // 'add' or 'edit'
        const originalJournalId = addJournalBtn.dataset.originalJournalId; // Only for edit mode

        if (!code || !name) {
            this.showMessage('Veuillez saisir un code et un nom pour le journal.');
            return;
        }

        if (!this.selectedCompany) {
            this.showMessage('Veuillez d\'abord sélectionner une société.');
            return;
        }

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        try {
            if (mode === 'add') {
                const { error } = await supabase.from('journals').insert([{ 
                    code, 
                    name, 
                    company_id: this.selectedCompany.id, 
                    user_id: user.id 
                }]);
                if (error) throw error;
                this.showMessage('Journal ajouté avec succès !');
            } else if (mode === 'edit') {
                const { error } = await supabase.from('journals')
                    .update({ code, name })
                    .eq('id', originalJournalId)
                    .eq('company_id', this.selectedCompany.id)
                    .eq('user_id', user.id); // Ensure user owns the journal
                if (error) throw error;
                this.showMessage('Journal modifié avec succès !');
                addJournalBtn.dataset.mode = 'add'; // Reset to add mode
                addJournalBtn.textContent = 'Ajouter'; // Reset button text
                delete addJournalBtn.dataset.originalJournalId; // Clear original journal ID
            }
            
            newJournalCodeInput.value = '';
            newJournalNameInput.value = '';
            this.updateJournalsTable(); // Refresh the list
        } catch (error) {
            this.showMessage(`Erreur lors de l\'ajout/modification du journal: ${error.message}`);
        }
    }

    editJournal(journalId, journalCode, journalName) {
        document.getElementById('new-journal-code').value = journalCode;
        document.getElementById('new-journal-name').value = journalName;
        const addJournalBtn = document.getElementById('add-journal-btn');
        addJournalBtn.textContent = 'Sauvegarder les modifications';
        addJournalBtn.dataset.mode = 'edit';
        addJournalBtn.dataset.originalJournalId = journalId; // Store original journal ID for update
    }

    async deleteJournal(journalId, journalName) {
        const confirmation = confirm(`Êtes-vous sûr de vouloir supprimer le journal "${journalName}" ?`);
        if (!confirmation) return;

        try {
            const { error } = await supabase.from('journals').delete().eq('id', journalId);
            if (error) throw error;
            this.showMessage('Journal supprimé avec succès !');
            this.updateJournalsTable(); // Refresh the list
        } catch (error) {
            this.showMessage(`Erreur lors de la suppression du journal: ${error.message}`);
        }
    }

    handleJournalClick(journalId, journalName) {
        this.currentJournal = { id: journalId, name: journalName };
        this.showScreen('journal-detail-screen', ['AS400 beta 2', this.selectedCompany.name, 'Journaux', journalName]);
        const journalStartDateInput = document.getElementById('journal-start-date');
        journalStartDateInput.value = '';
        journalStartDateInput.onchange = () => this.loadJournalEntries(journalId, journalName, journalStartDateInput.value);
        this.loadJournalEntries(journalId, journalName);
    }

    handleSort(type, direction) {
        // Mettre à jour l'UI des boutons
        document.getElementById(`${type}-sort-asc`).classList.toggle('active', direction === 'asc');
        document.getElementById(`${type}-sort-desc`).classList.toggle('active', direction === 'desc');

        // Recharger les données avec le nouveau tri
        if (type === 'account') {
            const accountNumber = this.navigationPath[this.navigationPath.length - 1];
            const startDate = document.getElementById('account-start-date').value;
            this.loadAccountEntries(accountNumber, startDate, direction);
        } else if (type === 'journal') {
            const { id, name } = this.currentJournal;
            const startDate = document.getElementById('journal-start-date').value;
            this.loadJournalEntries(id, name, startDate, direction);
        }
    }

    async loadJournalEntries(journalId, journalName, startDate = null, sortDirection = 'desc') {
        const tableContent = document.getElementById('journal-entries-table-content');
        tableContent.innerHTML = '<span class="no-data">(Chargement des écritures...)</span>';

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        try {
            let query = supabase
                .from('journal_entries')
                .select('*')
                .eq('user_id', user.id)
                .eq('company_id', this.selectedCompany.id);

            if (journalName !== 'Banque') {
                query = query.eq('journal_id', journalId);
            }

            const { data: entries, error } = await query.order('date', { ascending: sortDirection === 'asc' });

            if (error) throw error;

            // Client-side filtering by date
            let filteredEntries = entries;
            if (startDate) {
                const filterDate = new Date(startDate);
                filterDate.setHours(0, 0, 0, 0); // Set to start of the day for accurate comparison

                filteredEntries = entries.filter(entry => {
                    const parts = entry.date.split('/');
                    const entryDay = parseInt(parts[0], 10);
                    const entryMonth = parseInt(parts[1], 10) - 1; // Month is 0-indexed
                    let entryYear = parseInt(parts[2], 10);

                    // Robust 2-digit year to 4-digit year conversion
                    if (entryYear < 100) {
                        const currentYearLastTwoDigits = new Date().getFullYear() % 100;
                        entryYear = (entryYear <= currentYearLastTwoDigits + 10) ? 2000 + entryYear : 1900 + entryYear;
                    }
                    const entryDate = new Date(entryYear, entryMonth, entryDay);
                    entryDate.setHours(0, 0, 0, 0); // Set to start of the day

                    return entryDate >= filterDate;
                });
            }

            this.displayedEntries = filteredEntries; // Stocker les écritures pour l'impression

            tableContent.innerHTML = ''; // Clear existing content

            let totalDebit = 0;
            let totalCredit = 0;

            const headerRow = document.createElement('div');
            headerRow.className = 'table-row header-row';
            headerRow.style.fontWeight = 'bold';
            headerRow.style.borderBottom = '1px solid #00FF00';
            headerRow.innerHTML = `
                <span style="display: inline-block; width: 4ch; text-align: left;">Lgn</span>
                <span style="display: inline-block; width: 10ch; text-align: left;">Date</span>
                <span style="display: inline-block; width: 10ch; text-align: left;">Compte</span>
                <span style="display: inline-block; width: 25ch; text-align: left;">Libellé</span>
                <span style="display: inline-block; width: 12ch; text-align: right;">Débit</span>
                <span style="display: inline-block; width: 12ch; text-align: right;">Crédit</span>
                <span style="display: inline-block; width: 25ch; text-align: center;">Actions</span>
            `;
            tableContent.appendChild(headerRow);

            if (filteredEntries.length === 0) {
                tableContent.innerHTML += '<span class="no-data">(Aucune écriture à afficher pour ce journal)</span>';
                return;
            }

            filteredEntries.forEach((entry, index) => {
                const isDebit = entry.s.toUpperCase() !== 'C';
                const amount = parseFloat(entry.montant) || 0;
                const debit = isDebit ? this.formatAmount(amount) : '';
                const credit = !isDebit ? this.formatAmount(amount) : '';

                if (isDebit) totalDebit += amount;
                else totalCredit += amount;

                const actionsHtml = entry.batch_id ? `
                        <button class="action-btn modify-btn" data-batch-id="${entry.batch_id}" style="margin-right: 5px;">Modifier</button>
                        <button class="action-btn delete-btn" data-batch-id="${entry.batch_id}">Supprimer</button>
                    ` : '';

                const row = document.createElement('div');
                row.className = 'table-row';
                row.innerHTML = `
                    <span style="display: inline-block; width: 4ch; text-align: left;">${index + 1}</span>
                    <span style="display: inline-block; width: 10ch; text-align: left;">${this.formatDateForDisplay(entry.date)}</span>
                    <span style="display: inline-block; width: 10ch; text-align: left;">${entry.compte}</span>
                    <span style="display: inline-block; width: 25ch; text-align: left;">${entry.libelle}</span>
                    <span style="display: inline-block; width: 12ch; text-align: right;">${debit}</span>
                    <span style="display: inline-block; width: 12ch; text-align: right;">${credit}</span>
                    <span style="display: inline-block; width: 25ch; text-align: center;">
                        ${actionsHtml}
                    </span>
                `;
                tableContent.appendChild(row);
            });

            // Add event listeners for new buttons
            tableContent.querySelectorAll('.modify-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    this.refreshCallback = () => this.loadJournalEntries(journalId, journalName, startDate);
                    this.startModification(e.target.dataset.batchId);
                });
            });
            tableContent.querySelectorAll('.delete-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    this.refreshCallback = () => this.loadJournalEntries(journalId, journalName, startDate);
                    this.deleteEntryBatch(e.target.dataset.batchId); // Utiliser directement le batchId du bouton
                });
            });

            const totalsLine = document.querySelector('#journal-detail-screen .totals-line');
            const balance = totalDebit - totalCredit;
            const spaceBeforeTotals = '49ch'; // Corresponds to Lgn, Date, Compte, Libellé columns

            totalsLine.innerHTML = `
                <span style="display: inline-block; width: ${spaceBeforeTotals};">Solde ${this.formatAmount(balance)}</span>
                <span style="display: inline-block; width: 12ch; text-align: right;">${this.formatAmount(totalDebit)}</span>
                <span style="display: inline-block; width: 12ch; text-align: right;">${this.formatAmount(totalCredit)}</span>
            `;

        } catch (error) {
            this.showMessage(`Erreur de chargement des écritures du journal: ${error.message}`);
        }
    }

    async loadAccountEntries(accountNumber, startDate = null, sortDirection = 'desc') {
        const tableContent = document.getElementById('account-entries-table-content');
        tableContent.innerHTML = '<span class="no-data">(Chargement des écritures...)</span>';

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        try {
            let query = supabase
                .from('journal_entries')
                .select('*')
                .eq('user_id', user.id)
                .eq('company_id', this.selectedCompany.id)
                .eq('compte', accountNumber);

            const { data: entries, error } = await query.order('date', { ascending: sortDirection === 'asc' });

            if (error) throw error;

            // Client-side filtering by date
            let filteredEntries = entries;
            if (startDate) {
                const filterDate = new Date(startDate);
                filterDate.setHours(0, 0, 0, 0); // Set to start of the day for accurate comparison

                filteredEntries = entries.filter(entry => {
                    const parts = entry.date.split('/');
                    const entryDay = parseInt(parts[0], 10);
                    const entryMonth = parseInt(parts[1], 10) - 1; // Month is 0-indexed
                    let entryYear = parseInt(parts[2], 10);

                    // Robust 2-digit year to 4-digit year conversion
                    if (entryYear < 100) {
                        const currentYearLastTwoDigits = new Date().getFullYear() % 100;
                        entryYear = (entryYear <= currentYearLastTwoDigits + 10) ? 2000 + entryYear : 1900 + entryYear;
                    }
                    const entryDate = new Date(entryYear, entryMonth, entryDay);
                    entryDate.setHours(0, 0, 0, 0); // Set to start of the day

                    return entryDate >= filterDate;
                });
            }

            this.displayedEntries = filteredEntries; // Stocker les écritures pour l'impression

            tableContent.innerHTML = ''; // Clear existing content

            let totalDebit = 0;
            let totalCredit = 0;

            const headerRow = document.createElement('div');
            headerRow.className = 'table-row header-row';
            headerRow.style.fontWeight = 'bold';
            headerRow.style.borderBottom = '1px solid #00FF00';
            headerRow.innerHTML = `
                <span style="display: inline-block; width: 4ch;">Lgn</span>
                <span style="display: inline-block; width: 10ch;">Date</span>
                <span style="display: inline-block; width: 30ch;">Libellé</span>
                <span style="display: inline-block; width: 12ch; text-align: right;">Débit</span>
                <span style="display: inline-block; width: 12ch; text-align: right;">Crédit</span>
                <span style="display: inline-block; width: 25ch; text-align: center;">Actions</span>
            `;
            tableContent.appendChild(headerRow);

            if (filteredEntries.length === 0) {
                tableContent.innerHTML += '<span class="no-data" style="padding-top: 10px;">(Aucune écriture à afficher pour ce compte)</span>';
                return;
            }

            filteredEntries.forEach((entry, index) => {
                const isDebit = entry.s.toUpperCase() !== 'C';
                const amount = parseFloat(entry.montant) || 0;
                const debit = isDebit ? this.formatAmount(amount) : '';
                const credit = !isDebit ? this.formatAmount(amount) : '';

                if (isDebit) totalDebit += amount;
                else totalCredit += amount;

                const actionsHtml = entry.batch_id ? `
                        <button class="action-btn modify-btn" data-batch-id="${entry.batch_id}" style="margin-right: 5px;">Modifier</button>
                        <button class="action-btn delete-btn" data-batch-id="${entry.batch_id}">Supprimer</button>
                    ` : '';

                const row = document.createElement('div');
                row.className = 'table-row';
                row.innerHTML = `
                    <span style="display: inline-block; width: 4ch;">${index + 1}</span>
                    <span style="display: inline-block; width: 10ch;">${entry.date}</span>
                    <span style="display: inline-block; width: 30ch;">${entry.libelle}</span>
                    <span style="display: inline-block; width: 12ch; text-align: right;">${debit}</span>
                    <span style="display: inline-block; width: 12ch; text-align: right;">${credit}</span>
                    <span style="display: inline-block; width: 25ch; text-align: center;">
                        ${actionsHtml}
                    </span>
                `;
                tableContent.appendChild(row);
            });

            // Add event listeners for new buttons
            tableContent.querySelectorAll('.modify-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    this.refreshCallback = () => this.loadAccountEntries(accountNumber, startDate);
                    this.startModification(e.target.dataset.batchId);
                });
            });
            tableContent.querySelectorAll('.delete-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    this.refreshCallback = () => this.loadAccountEntries(accountNumber, startDate);
                    this.deleteEntryBatch(e.target.dataset.batchId);
                });
            });

            const totalsLine = document.querySelector('#account-detail-screen .totals-line');
            const balance = totalDebit - totalCredit;
            const spaceBeforeTotals = '49ch'; // Corresponds to Lgn, Date, Compte, Libellé columns

            totalsLine.innerHTML = `
                <span style="display: inline-block; width: ${spaceBeforeTotals};">Solde ${this.formatAmount(balance)}</span>
                <span style="display: inline-block; width: 12ch; text-align: right;">${this.formatAmount(totalDebit)}</span>
                <span style="display: inline-block; width: 12ch; text-align: right;">${this.formatAmount(totalCredit)}</span>
            `;

        } catch (error) {
            this.showMessage(`Erreur de chargement des écritures: ${error.message}`);
        }
    }

    async startModification(batchId) {
        if (!batchId) {
            this.showMessage('Erreur: Identifiant de lot manquant.');
            return;
        }
        this.showMessage('Chargement du lot pour modification...');
        try {
            const { data: entries, error } = await supabase
                .from('journal_entries')
                .select('*')
                .eq('batch_id', batchId);

            if (error) throw error;
            if (entries.length === 0) {
                this.showMessage('Erreur: Impossible de trouver les écritures à modifier.');
                return;
            }

            this.currentEditingBatchId = batchId;
            this.entryBatch = entries.map(e => ({ ...e })); // Copie des écritures

            // Utiliser les informations de la première écriture pour la navigation
            const firstEntry = entries[0];
            const journal = { id: firstEntry.journal_id, name: 'Modification' }; // Simplification
            this.currentJournal = journal;

            const basePath = ['AS400 beta 2', this.selectedCompany.name, 'Menu Comptabilité', 'Écritures'];
            this.showScreen('entry-detail-screen', [...basePath, 'Modification Lot']);

            // Stocker le batchId sur le bouton de validation
            const validateBatchBtn = document.getElementById('validate-batch-btn');
            if (validateBatchBtn) {
                validateBatchBtn.dataset.batchId = batchId;
                validateBatchBtn.style.display = 'inline-block'; // Ensure visible
                console.log(`[startModification] Stored batchId ${batchId} on validate-batch-btn.`);
            }

            // Ensure add line button is visible
            const addLineBtn = document.getElementById('add-entry-line-btn');
            if (addLineBtn) {
                addLineBtn.style.display = 'inline-block';
            }

            // Ensure the UI knows we are in edit mode
            this.updateEntriesTable(this.entryBatch);

        } catch (error) {
            this.showMessage(`Erreur lors du chargement du lot: ${error.message}`);
        }
    }

    async deleteEntryBatch(batchId) {
        console.log(`deleteEntryBatch called with batchId: ${batchId}`);
        if (!batchId) {
            this.showMessage('Erreur: Identifiant de lot manquant.');
            console.error('deleteEntryBatch: batchId is missing.');
            return;
        }
        const confirmation = confirm('Êtes-vous sûr de vouloir supprimer ce lot d\'écritures ? Cette action est irréversible.');
        if (!confirmation) {
            console.log('Deletion cancelled by user.');
            return;
        }

        this.showMessage('Suppression en cours...');
        try {
            console.log(`Attempting to delete entries with batch_id: ${batchId}`);
            const { data, error } = await supabase.from('journal_entries').delete().eq('batch_id', batchId);
            
            if (error) {
                console.error('Error during deletion:', error);
                throw error;
            }

            console.log('Deletion successful, response:', data);
            this.showMessage('Lot supprimé avec succès.');
            
            // Refresh the current view using the callback
            if (this.refreshCallback) {
                this.refreshCallback();
            }

        } catch (error) {
            console.error('Error in deleteEntryBatch catch block:', error);
            this.showMessage(`Erreur lors de la suppression: ${error.message}`);
        }
    }

    handlePrint(type) {
        const printWindow = window.open('', '_blank');
        const headerTitle = type === 'account' 
            ? `Compte: ${this.navigationPath[this.navigationPath.length - 1]}` 
            : `Journal: ${this.currentJournal.name}`;

        const companyName = this.selectedCompany.name;
        const printDate = new Date().toLocaleDateString('fr-FR');

        let tableHTML = `
            <style>
                body { font-family: Arial, sans-serif; }
                table { width: 100%; border-collapse: collapse; }
                th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                th { background-color: #f2f2f2; }
                .text-right { text-align: right; }
                @media print {
                    .no-print { display: none; }
                }
            </style>
            <h2>${companyName}</h2>
            <h3>${headerTitle}</h3>
            <p>Imprimé le: ${printDate}</p>
            <table>
                <thead>
                    <tr>
                        <th>Date</th>
                        ${type === 'journal' ? '<th>Compte</th>' : ''}
                        <th>Libellé</th>
                        <th class="text-right">Débit</th>
                        <th class="text-right">Crédit</th>
                    </tr>
                </thead>
                <tbody>
        `;

        let totalDebit = 0;
        let totalCredit = 0;

        this.displayedEntries.forEach(entry => {
            const isDebit = entry.s.toUpperCase() !== 'C';
            const amount = parseFloat(entry.montant) || 0;
            if (isDebit) totalDebit += amount; else totalCredit += amount;

            tableHTML += `
                <tr>
                    <td>${this.formatDateForDisplay(entry.date)}</td>
                    ${type === 'journal' ? `<td>${entry.compte}</td>` : ''}
                    <td>${entry.libelle}</td>
                    <td class="text-right">${isDebit ? this.formatAmount(amount) : ''}</td>
                    <td class="text-right">${!isDebit ? this.formatAmount(amount) : ''}</td>
                </tr>
            `;
        });

        const balance = totalDebit - totalCredit;

        tableHTML += `
                </tbody>
                <tfoot>
                    <tr>
                        <th colspan="${type === 'journal' ? 3 : 2}" style="text-align: right; padding-right: 8px;">Totaux</th>
                        <th class="text-right">${this.formatAmount(totalDebit)}</th>
                        <th class="text-right">${this.formatAmount(totalCredit)}</th>
                    </tr>
                    <tr>
                        <th colspan="${type === 'journal' ? 3 : 2}" style="text-align: right; padding-right: 8px;">Solde</th>
                        <th colspan="2" class="text-right">${this.formatAmount(balance)}</th>
                    </tr>
                </tfoot>
            </table>
        `;

        printWindow.document.write(tableHTML);
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
    }

    async loadJournalsForBatchFilter() {
        const journalSelect = document.getElementById('batch-filter-journal');
        if (!journalSelect) return;

        journalSelect.innerHTML = '<option value="">Tous les journaux</option>';

        try {
            const { data: journals, error } = await supabase
                .from('journals')
                .select('id, code, name')
                .eq('company_id', this.selectedCompany.id)
                .order('code', { ascending: true });

            if (error) throw error;

            journals.forEach(journal => {
                const option = document.createElement('option');
                option.value = journal.id;
                option.textContent = `${journal.code} - ${journal.name}`;
                journalSelect.appendChild(option);
            });
        } catch (error) {
            this.showMessage(`Erreur de chargement des journaux: ${error.message}`);
        }
    }

    async loadBatchesList() {
        const tableContent = document.getElementById('batches-table-content');
        tableContent.innerHTML = '<span class="no-data">(Chargement des lots...)</span>';

        const { data: { user } } = await supabase.auth.getUser();
        if (!user || !this.selectedCompany) {
            tableContent.innerHTML = '<span class="no-data">(Veuillez sélectionner une société)</span>';
            return;
        }

        try {
            // Get filter values
            const journalFilter = document.getElementById('batch-filter-journal').value;
            const startDate = document.getElementById('batch-filter-start-date').value;
            const endDate = document.getElementById('batch-filter-end-date').value;

            // Build query
            let query = supabase
                .from('journal_entries')
                .select('batch_id, journal_id, date, compte, s, montant, libelle')
                .eq('user_id', user.id)
                .eq('company_id', this.selectedCompany.id)
                .not('batch_id', 'is', null);

            if (journalFilter) {
                query = query.eq('journal_id', journalFilter);
            }

            const { data: entries, error } = await query.order('date', { ascending: false });

            if (error) throw error;

            // Filter by date on client side (because date format is DD/MM/YYYY)
            let filteredEntries = entries;
            if (startDate || endDate) {
                filteredEntries = entries.filter(entry => {
                    const parts = entry.date.split('/');
                    const entryDay = parseInt(parts[0], 10);
                    const entryMonth = parseInt(parts[1], 10) - 1;
                    let entryYear = parseInt(parts[2], 10);

                    if (entryYear < 100) {
                        const currentYearLastTwoDigits = new Date().getFullYear() % 100;
                        entryYear = (entryYear <= currentYearLastTwoDigits + 10) ? 2000 + entryYear : 1900 + entryYear;
                    }
                    const entryDate = new Date(entryYear, entryMonth, entryDay);
                    entryDate.setHours(0, 0, 0, 0);

                    let valid = true;
                    if (startDate) {
                        const filterStartDate = new Date(startDate);
                        filterStartDate.setHours(0, 0, 0, 0);
                        valid = valid && entryDate >= filterStartDate;
                    }
                    if (endDate) {
                        const filterEndDate = new Date(endDate);
                        filterEndDate.setHours(23, 59, 59, 999);
                        valid = valid && entryDate <= filterEndDate;
                    }
                    return valid;
                });
            }

            // Group entries by batch_id
            const batchesMap = new Map();
            filteredEntries.forEach(entry => {
                if (!batchesMap.has(entry.batch_id)) {
                    batchesMap.set(entry.batch_id, {
                        batch_id: entry.batch_id,
                        journal_id: entry.journal_id,
                        date: entry.date,
                        entries: [],
                        totalDebit: 0,
                        totalCredit: 0
                    });
                }
                const batch = batchesMap.get(entry.batch_id);
                batch.entries.push(entry);

                const amount = parseFloat(entry.montant) || 0;
                if (entry.s.toUpperCase() !== 'C') {
                    batch.totalDebit += amount;
                } else {
                    batch.totalCredit += amount;
                }
            });

            // Get journal names
            const journalIds = [...new Set(filteredEntries.map(e => e.journal_id))];
            let journalsMap = new Map();

            if (journalIds.length > 0) {
                const { data: journals, error: journalError } = await supabase
                    .from('journals')
                    .select('id, code, name')
                    .in('id', journalIds);

                if (journalError) throw journalError;
                journals.forEach(j => journalsMap.set(j.id, `${j.code} - ${j.name}`));
            }

            // Convert map to array and sort by date (most recent first)
            const batches = Array.from(batchesMap.values()).sort((a, b) => {
                const dateA = this.parseDateString(a.date);
                const dateB = this.parseDateString(b.date);
                return dateB - dateA;
            });

            tableContent.innerHTML = '';

            if (batches.length === 0) {
                tableContent.innerHTML = '<span class="no-data">(Aucun lot à afficher)</span>';
                return;
            }

            batches.forEach((batch, index) => {
                const journalName = journalsMap.get(batch.journal_id) || 'Inconnu';
                const row = document.createElement('div');
                row.className = 'table-row';
                row.innerHTML = `
                    <span style="display: inline-block; width: 5ch;">${index + 1}</span>
                    <span style="display: inline-block; width: 12ch;">${this.formatDateForDisplay(batch.date)}</span>
                    <span style="display: inline-block; width: 18ch;">${journalName}</span>
                    <span style="display: inline-block; width: 8ch; text-align: center;">${batch.entries.length}</span>
                    <span style="display: inline-block; width: 15ch; text-align: right;">${this.formatAmount(batch.totalDebit)}</span>
                    <span style="display: inline-block; width: 15ch; text-align: right;">${this.formatAmount(batch.totalCredit)}</span>
                    <span style="display: inline-block; width: 30ch; text-align: center;">
                        <button class="action-btn view-batch-btn" data-batch-id="${batch.batch_id}" style="margin-right: 5px;">Consulter</button>
                        <button class="action-btn modify-batch-btn" data-batch-id="${batch.batch_id}" style="margin-right: 5px;">Modifier</button>
                        <button class="action-btn delete-batch-btn" data-batch-id="${batch.batch_id}">Supprimer</button>
                    </span>
                `;
                tableContent.appendChild(row);
            });

            // Add event listeners for batch actions
            tableContent.querySelectorAll('.view-batch-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    this.viewBatch(e.target.dataset.batchId);
                });
            });
            tableContent.querySelectorAll('.modify-batch-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    this.refreshCallback = () => this.loadBatchesList();
                    this.startModification(e.target.dataset.batchId);
                });
            });
            tableContent.querySelectorAll('.delete-batch-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    this.refreshCallback = () => this.loadBatchesList();
                    this.deleteEntryBatch(e.target.dataset.batchId);
                });
            });

        } catch (error) {
            this.showMessage(`Erreur de chargement des lots: ${error.message}`);
            console.error('Error loading batches:', error);
        }
    }

    parseDateString(dateString) {
        const parts = dateString.split('/');
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1;
        let year = parseInt(parts[2], 10);

        if (year < 100) {
            const currentYearLastTwoDigits = new Date().getFullYear() % 100;
            year = (year <= currentYearLastTwoDigits + 10) ? 2000 + year : 1900 + year;
        }

        return new Date(year, month, day);
    }

    async viewBatch(batchId) {
        if (!batchId) {
            this.showMessage('Erreur: Identifiant de lot manquant.');
            return;
        }

        try {
            const { data: entries, error } = await supabase
                .from('journal_entries')
                .select('*')
                .eq('batch_id', batchId);

            if (error) throw error;
            if (entries.length === 0) {
                this.showMessage('Erreur: Impossible de trouver les écritures.');
                return;
            }

            // Store entries in read-only mode
            this.entryBatch = entries.map(e => ({ ...e }));
            this.currentEditingBatchId = null; // Read-only mode

            const firstEntry = entries[0];
            const journal = { id: firstEntry.journal_id, name: 'Consultation' };
            this.currentJournal = journal;

            const basePath = ['AS400 beta 2', this.selectedCompany.name, 'Menu Comptabilité', 'Écritures', 'Liste des lots'];
            this.showScreen('entry-detail-screen', [...basePath, 'Consultation Lot']);

            // Hide the validation button in view mode
            const validateBatchBtn = document.getElementById('validate-batch-btn');
            if (validateBatchBtn) {
                validateBatchBtn.style.display = 'none';
            }

            // Hide the add line button in view mode
            const addLineBtn = document.getElementById('add-entry-line-btn');
            if (addLineBtn) {
                addLineBtn.style.display = 'none';
            }

            this.updateEntriesTable(this.entryBatch);

        } catch (error) {
            this.showMessage(`Erreur lors de la consultation du lot: ${error.message}`);
        }
    }

    resetBatchFilters() {
        document.getElementById('batch-filter-journal').value = '';
        document.getElementById('batch-filter-start-date').value = '';
        document.getElementById('batch-filter-end-date').value = '';
        this.loadBatchesList();
    }
}

// Initialisation de l'application
document.addEventListener('DOMContentLoaded', () => {
    window.as400App = new AS400App();
});