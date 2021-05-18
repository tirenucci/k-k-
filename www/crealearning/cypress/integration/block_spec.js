describe('Test des block', function() {
    beforeEach(function() {
        cy.clearCookies()
        cy.clearLocalStorage()
        cy.wait(1000)
        cy.visit('/connection')
        cy.wait(1000)
        cy.get('.input__mail')
            .type('admin@logipro.com')
            .should('have.value', 'admin@logipro.com')
        cy.get('.input__pswd')
            .type('admin')
            .should('have.value', 'admin')
            cy.get('.connect__btn')
            .click({force: true})
        cy.wait(2000)
    })

    it('Modification d\'un bloc deja poser bloc', function(){
        cy.contains('mes modules de formation')
            .click({force: true})
        cy.contains('Bien débuter')
            .click({force: true})
        cy.get('.cle-block-title')
            .click({force: true})
        cy.get('.blocks__title').contains('Titre')
        cy.get('input').should('exist')
            .type('. Ceci viens du test cypress')
            .should('have.value', 'C\'est un grain pour les tests. Ceci viens du test cypress')
        cy.get('.orange__btn')
            .click({force: true})
        cy.get('.close__btn')
            .click({force: true})
        cy.contains('C\'est un grain pour les tests. Ceci viens du test cypress').should('exist')
    })

    it('Modification d\'un bloc qu\'on viens de poser et suppression module', function(){
        cy.get('#add')
            .click({force: true})
        cy.get('#name')
            .type('Test')
            .should('have.value', 'Test')
        cy.get('.step__btn')
            .click({force: true})
        cy.wait(1000)
        cy.contains('Glissez/déposez un nouveau bloc ici').should('exist')
        cy.wait(1000)
        cy.get('.title-block')
            .dblclick()
        cy.wait(1000)
        cy.contains('Nouveau grain').should('have.length', 1)
        cy.get('input').should('exist')
            .clear()
            .type('Es ce que ça fonctionne ?')
            .should('have.value', 'Es ce que ça fonctionne ?')

    })

    it("Test du panneau de configuration d'un bloc", function(){
        cy.visit('/training/1')
        cy.wait(1000)
        cy.get('#block_1')
            .click({force:true})
            .should('have.css', 'border', '3px solid rgb(255, 103, 1)')
            .wait(1000)
            .get('[data-cy=btn-block-list]').should('exist')
        cy.get('.unselected')
    })
    

    it('Mise des bloc dans grain au double clic et suppression de trois bloc', function(){
        cy.visit('/training/1')
        cy.wait(1000)
        /*Onglet BLOCS/QUESTIONS/AIDE*/
        cy.get('.blocks__tab')
            .contains('Questions')
            .click({force: true})
        cy.contains('Énoncé').should('exist')
        cy.get('.blocks__tab')
            .contains('Aide')
            .click({force: true})
        cy.contains('Créer et configurer un grain').should('exist')
        cy.get('.blocks__tab')
            .contains('Blocs')
            .click({force: true})
        cy.contains('Titre').should('exist')
        cy.wait(1000)
        /*Pour chaque Bloc on test ces onglets*/
        /*Bloc Titre*/
        cy.get('.title-block')
            .dblclick('center',{force: true})
            .get('.cle-block-title').should('have.length', 2)
        
        cy.wait(1000)
        cy.contains('Grain test').should('exist')
        cy.contains('Options')
            .click({force: true})
        cy.contains('Niveau de titre').should('exist')
        cy.contains('Aide')
            .click({force: true})
        cy.contains('Saisissez le texte du titre').should('exist')
        cy.get('.close__btn')
            .click({force: true})
        cy.contains('Titre').should('exist')
        cy.get("#block_4")
            .click({force: true})
        cy.get('.selected-block')
            .find('.delete')
            .click({force: true})
        cy.contains('Ok')
            .click({force: true})
        cy.wait(1000)
        /*Bloc Paragraphe*/
        /**
         * ===============================================
         */

        cy.get('.paragraph-block')
            .dblclick('center',{force: true})
            .get('.cle-block-paragraph',{timeout: 5000}).should('have.length', 2)
        cy.wait(1000)
        
        cy.contains('Tapez quelque chose').should('exist')
        cy.contains('Options')
            .click({force: true})
        cy.contains('Bloc similaire').should('exist')
        cy.contains('Aide')
            .click({force: true})
        cy.contains('Dans la zone de texte, vous pouvez saisir votre contenu').should('exist')
        cy.get('.close__btn')
            .click({force: true})
        cy.contains('Paragraphe').should('exist')
        cy.get("#block_6")
            .click({force: true})
        cy.get('.selected-block')
            .find('.delete')
            .click({force: true})
        cy.contains('Annuler')
            .click({force: true})
        cy.get("#block_6").should('exist')
        cy.wait(1000)


        /*Bloc séparateur*/
        /**
         * ===============================================
         */

        cy.get('.hr-block')
            .dblclick('center',{force: true})
            .get('.cle-block-hr',{timeout: 5000}).should('have.length', 1)
        
        cy.wait(1000)
        cy.contains('Aide')
            .click({force: true})
        cy.contains('Permet d’ajouter une ligne ').should('exist')
        cy.get('.close__btn')
            .click({force: true})
        cy.contains('Séparateur').should('exist')
        cy.wait(1000)


        /*Bloc Image*/
        /**
         * ===============================================
         */ 

        cy.get('.img-block')
            .dblclick('center',{force: true})
            .get('.cle-block-img',{timeout: 5000}).should('have.length', 2)
        
        cy.wait(1000)
        
        cy.contains('Source de l\'image').should('exist')
        cy.contains('Options')
            .click({force: true})
        cy.contains('Description').should('exist')
        cy.contains('Aide')
            .click({force: true})
        cy.contains('Pour sélectionner le fichier source, cliquez').should('exist')
        cy.get('.close__btn')
            .click({force: true})
        cy.contains('Image').should('exist')
        cy.wait(1000)
        


        /*Bloc Texte à gauche   */
        /**
         * ===============================================
         */ 

        

         /*Bloc Texte à gauche*/
        /**
         * ===============================================
         */ 

        
        cy.wait(1000)
         /*Bloc Vidéo*/
        /**
         * ===============================================
         */ 
        cy.get('.video-block')
            .dblclick('center',{force: true})
            .get('.cle-block-video',{timeout: 5000}).should('have.length', 1)
        cy.wait(1000)
        
        cy.contains('Source de la vidéo').should('exist')
        cy.contains('Options')
            .click({force: true})
        cy.contains('Description').should('exist')
        cy.contains('Aide')
            .click({force: true})
        cy.contains('Ajouter votre fichier ').should('exist')
        cy.get('.close__btn')
            .click({force: true})
        cy.contains('Vidéo').should('exist')

        cy.wait(1000)

        /*Bloc Capture d'écran*/
        /**
         * ===============================================
         */ 
        cy.get('.capture-block')
            .dblclick('center',{force: true})
            .get('.cle-block-video',{timeout: 5000}).should('have.length', 2)
        cy.wait(1000)
        
        cy.contains('Source de la vidéo').should('exist')
        cy.contains('Options')
            .click({force: true})
        cy.contains('Lecture automatique').should('exist')
        cy.contains('Aide')
            .click({force: true})
        cy.contains('Enregistrer votre fichier source').should('exist')
        cy.get('.close__btn')
            .click({force: true})
        cy.contains('Capture d\'écran').should('exist')

        cy.wait(1000)
        /*Bloc Audio*/
        /**
         * ===============================================
         */ 
        cy.get('.audio-block')
            .dblclick('center',{force: true})
            .get('.cle-block-audio',{timeout: 5000}).should('have.length', 1)
    
        cy.wait(1000)
        
        cy.contains('Source de l\'audio').should('exist')
        cy.contains('Options')
            .click({force: true})
        cy.contains('Lecture automatique').should('exist')
        cy.contains('Aide')
            .click({force: true})
        cy.contains('1er cas : Vous disposez de l’enregistrem').should('exist')
        cy.get('.close__btn')
            .click({force: true})
        cy.contains('Audio').should('exist')


        cy.wait(1000)
        /*Bloc Document*/
        /**
         * ===============================================
         */ 
        cy.get('.document-block')
            .dblclick('center',{force: true})
            .get('.cle-block-doc',{timeout: 5000}).should('have.length', 1)
        
        cy.wait(1000)
        
        cy.contains('Source du document').should('exist')
        cy.contains('Options')
            .click({force: true})
        cy.contains('Bloc similaire').should('exist')
        cy.contains('Aide')
            .click({force: true})
        cy.contains('Permet de faire un lien vers un document').should('exist')
        cy.get('.close__btn')
            .click({force: true})
        cy.contains('Document').should('exist')

    
        cy.wait(1000)
        /*Bloc Formule*/
        /**
         * ===============================================
         */ 
        cy.get('.formula-block')
            .dblclick('center',{force: true})
            .get('.cle-block-formula',{timeout: 5000}).should('have.length', 1)
        
        cy.wait(1000)
        
        cy.contains('Ouvrir l\'éditeur').should('exist')
        cy.contains('Options')
            .click({force: true})
        cy.contains('Bloc similaire').should('exist')
        cy.contains('Aide')
            .click({force: true})
        cy.contains('disposez d’un éditeur de formules').should('exist')
        cy.get('.close__btn')
            .click({force: true})
        cy.contains('Formule').should('exist')

    
        cy.wait(1000)
        /*Bloc Objet intégré*/
        /**
         * ===============================================
         */ 
        cy.get('.integrate-block')
            .dblclick('center',{force: true})
        cy.wait(1000)
        cy.get('.cle-block-embed',{timeout: 5000}).should('have.length', 1)
        
        cy.contains('Code d\'intégration').should('exist')
        cy.contains('Options')
            .click({force: true})
        cy.contains('Bloc similaire').should('exist')
        cy.contains('Aide')
            .click({force: true})
        cy.contains('Vous pouvez intégrer des objets').should('exist')
        cy.get('.close__btn')
            .click({force: true})
        cy.contains('Objet intégré').should('exist')


        cy.wait(1000)
    })
  })