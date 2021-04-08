describe('Photo Album', () => {
    it('renders photo album', () => {
        cy.visit('/2013/10/14/deliblato/');
        cy.get('.PhotoAlbum').as('album');
        cy.get('@album').should('exist');
        cy.get('@album').find('.PhotoAlbum__ModeSwitch').should('exist');
        cy.get('@album').find('.PhotoAlbum__ImageGallery').should('exist');
        cy.get('@album').find('.PhotoAlbum__Figure').should('exist');
    });

    it('renders geotagging map', () => {
        cy.get('.PhotoAlbum__ModeSwitch__Map').click({ force: true });
        cy.get('.vue-map').should('exist');
        cy.get('div.cluster div').contains(16).click({ force: true });
        cy.get('div[title="Deliblato (IMG_9879.jpg)"]').should('exist');
        cy.window().then((win) => {
            expect(win.google.maps).to.be.a('object');
        });
    });
});
