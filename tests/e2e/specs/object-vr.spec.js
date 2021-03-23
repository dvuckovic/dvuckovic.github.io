describe('Object VR', () => {
    it('renders object VR', () => {
        cy.visit('/2011/03/21/panoramic-head-v2/');
        cy.get('div#panorama-head > div > div > canvas').should('exist');
        cy.window().then((win) => {
            expect(win.object2vrPlayer).to.be.a('function');
        });
    });
});
